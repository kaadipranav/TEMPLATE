import { NextRequest } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { streamAIResponse, getModel, type AIProvider } from "@/lib/ai"
import { getUserByClerkId } from "@/lib/db"
import { streamText } from "ai"

// Credit costs per tool
const CREDIT_COSTS: Record<string, number> = {
  "ai-chat": 1,
  "content-gen": 2,
  "image-gen": 5,
  "pdf-summarizer": 10,
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tool: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { tool } = await params
    const creditsRequired = CREDIT_COSTS[tool] || 1

    // Get user and check credits
    const user = await getUserByClerkId(userId)
    if (!user) {
      return new Response("User not found", { status: 404 })
    }

    // Check if user has enough credits (unless unlimited)
    const hasUnlimited = user.subscriptionStatus === "active"
    if (!hasUnlimited && user.credits < creditsRequired) {
      return new Response(
        JSON.stringify({
          error: "Insufficient credits",
          credits: user.credits,
          required: creditsRequired,
        }),
        {
          status: 402, // Payment Required
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Parse request body
    const body = await request.json()
    const {
      prompt,
      messages,
      provider,
      model,
      maxTokens,
      temperature,
      system,
    } = body

    // Deduct credits BEFORE making AI call (to prevent abuse)
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
              tool: tool,
              creditsUsed: creditsRequired,
            }),
          }
        )

        if (!usageResponse.ok) {
          const error = await usageResponse.json()
          if (usageResponse.status === 402) {
            return new Response(
              JSON.stringify(error),
              {
                status: 402,
                headers: { "Content-Type": "application/json" },
              }
            )
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

    // EASY CUSTOM: Modify system prompts here for each tool
    const systemPrompts: Record<string, string> = {
      "ai-chat": "You are a helpful AI assistant. Be concise, friendly, and accurate.",
      "content-gen": "You are an expert content writer. Create engaging, well-structured content based on the user's requirements.",
      "image-gen": "You are an AI image generation assistant. Help users create detailed image prompts.",
      "pdf-summarizer": "You are an expert at analyzing and summarizing documents. Provide clear, concise summaries.",
    }

    const defaultSystem = systemPrompts[tool] || system || "You are a helpful AI assistant."

    // Stream AI response
    try {
      const result = await streamAIResponse({
        prompt: prompt,
        messages: messages,
        provider: provider as AIProvider,
        model: model,
        maxTokens: maxTokens || 2000,
        temperature: temperature || 0.7,
        system: system || defaultSystem,
      })

      // Return streaming response
      return result.toDataStreamResponse()
    } catch (aiError: any) {
      console.error("AI API error:", aiError)
      
      // Refund credits if AI call failed (only if not unlimited)
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
                tool: tool,
                creditsUsed: -creditsRequired, // Negative to refund
              }),
            }
          )
        } catch (refundError) {
          console.error("Failed to refund credits:", refundError)
        }
      }

      return new Response(
        JSON.stringify({
          error: "AI service error",
          message: aiError.message || "Failed to generate response",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      )
    }
  } catch (error: any) {
    console.error("Error in AI route:", error)
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
