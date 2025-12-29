import { NextRequest } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getUserByClerkId } from "@/lib/db"
import { readFile } from "fs/promises"
import { join } from "path"
import pdfParse from "pdf-parse"
import OpenAI from "openai"
import { streamText } from "ai"
import { openai } from "ai/openai"

const CREDITS_REQUIRED = 10
const CHUNK_SIZE = 1000 // Characters per chunk
const CHUNK_OVERLAP = 200 // Overlap between chunks

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new Response("Unauthorized", { status: 401 })
    }

    // Get user and check credits
    const user = await getUserByClerkId(userId)
    if (!user) {
      return new Response("User not found", { status: 404 })
    }

    // Check credits
    const hasUnlimited = user.subscriptionStatus === "active"
    if (!hasUnlimited && user.credits < CREDITS_REQUIRED) {
      return new Response(
        JSON.stringify({
          error: "Insufficient credits",
          credits: user.credits,
          required: CREDITS_REQUIRED,
        }),
        {
          status: 402,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    const body = await request.json()
    const { filename } = body

    if (!filename) {
      return new Response(
        JSON.stringify({ error: "Filename is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Deduct credits before processing
    if (!hasUnlimited) {
      try {
        const usageResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/usage`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: request.headers.get("cookie") || "",
            },
            body: JSON.stringify({
              tool: "pdf-summarizer",
              creditsUsed: CREDITS_REQUIRED,
            }),
          }
        )

        if (!usageResponse.ok) {
          const error = await usageResponse.json()
          if (usageResponse.status === 402) {
            return new Response(JSON.stringify(error), {
              status: 402,
              headers: { "Content-Type": "application/json" },
            })
          }
          throw new Error(error.error || "Failed to deduct credits")
        }
      } catch (error: any) {
        console.error("Error deducting credits:", error)
        return new Response(
          JSON.stringify({ error: "Failed to process credits" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        )
      }
    }

    // Read and parse PDF
    const filepath = join(process.cwd(), "uploads", userId, filename)
    const pdfBuffer = await readFile(filepath)
    const pdfData = await pdfParse(pdfBuffer)
    const text = pdfData.text

    if (!text || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "PDF contains no extractable text" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Chunk the text
    const chunks: string[] = []
    for (let i = 0; i < text.length; i += CHUNK_SIZE - CHUNK_OVERLAP) {
      const chunk = text.slice(i, i + CHUNK_SIZE)
      chunks.push(chunk)
    }

    // Generate embeddings and create summary
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    const openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    try {
      // Create embeddings for chunks (for RAG)
      const embeddingPromises = chunks.map((chunk) =>
        openaiClient.embeddings.create({
          model: "text-embedding-3-small",
          input: chunk,
        })
      )

      // Wait for all embeddings (we'll use them conceptually for RAG)
      await Promise.all(embeddingPromises)

      // Combine chunks for summarization
      const combinedText = chunks.join("\n\n")

      // Generate summary using streaming
      const result = await streamText({
        model: openai("gpt-4o-mini"),
        system: `You are an expert at analyzing and summarizing documents. Provide a clear, concise, and comprehensive summary of the PDF content. 
        
Structure your summary with:
1. Key Points (main topics covered)
2. Important Details (specific information)
3. Conclusions (if applicable)

Be thorough but concise.`,
        prompt: `Please summarize the following PDF content:\n\n${combinedText.substring(0, 15000)}`, // Limit to avoid token limits
        maxTokens: 2000,
        temperature: 0.7,
      })

      return result.toDataStreamResponse()
    } catch (aiError: any) {
      console.error("AI API error:", aiError)

      // Refund credits if summarization failed
      if (!hasUnlimited) {
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/usage`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Cookie: request.headers.get("cookie") || "",
              },
              body: JSON.stringify({
                tool: "pdf-summarizer",
                creditsUsed: -CREDITS_REQUIRED, // Negative to refund
              }),
            }
          )
        } catch (refundError) {
          console.error("Failed to refund credits:", refundError)
        }
      }

      return new Response(
        JSON.stringify({
          error: "Summarization failed",
          message: aiError.message || "Failed to generate summary",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      )
    }
  } catch (error: any) {
    console.error("Error in PDF summarization route:", error)
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}

