import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getUserByClerkId } from "@/lib/db"
import OpenAI from "openai"

const CREDITS_REQUIRED = 5

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user and check credits
    const user = await getUserByClerkId(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check credits
    const hasUnlimited = user.subscriptionStatus === "active"
    if (!hasUnlimited && user.credits < CREDITS_REQUIRED) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          credits: user.credits,
          required: CREDITS_REQUIRED,
        },
        { status: 402 }
      )
    }

    const body = await request.json()
    const { prompt } = body

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      )
    }

    // Deduct credits before generating
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
              tool: "image-gen",
              creditsUsed: CREDITS_REQUIRED,
            }),
          }
        )

        if (!usageResponse.ok) {
          const error = await usageResponse.json()
          if (usageResponse.status === 402) {
            return NextResponse.json(error, { status: 402 })
          }
          throw new Error(error.error || "Failed to deduct credits")
        }
      } catch (error: any) {
        console.error("Error deducting credits:", error)
        return NextResponse.json(
          { error: "Failed to process credits" },
          { status: 500 }
        )
      }
    }

    // Generate image with DALL-E 3
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      )
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      })

      const imageUrl = response.data?.[0]?.url

      if (!imageUrl) {
        throw new Error("No image URL returned from OpenAI")
      }

      return NextResponse.json({
        imageUrl,
        prompt,
      })
    } catch (aiError: any) {
      console.error("OpenAI API error:", aiError)

      // Refund credits if generation failed
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
                tool: "image-gen",
                creditsUsed: -CREDITS_REQUIRED, // Negative to refund
              }),
            }
          )
        } catch (refundError) {
          console.error("Failed to refund credits:", refundError)
        }
      }

      return NextResponse.json(
        {
          error: "Image generation failed",
          message: aiError.message || "Failed to generate image",
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("Error in image generation route:", error)
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    )
  }
}

