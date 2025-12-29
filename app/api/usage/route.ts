import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { deductCredits, logUsage, getUserByClerkId, updateUserCredits } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { tool, creditsUsed } = body

    if (!tool || typeof creditsUsed !== "number") {
      return NextResponse.json(
        { error: "Invalid request: tool and creditsUsed (number) are required" },
        { status: 400 }
      )
    }

    // Handle refunds (negative creditsUsed)
    const isRefund = creditsUsed < 0
    const creditsToProcess = Math.abs(creditsUsed)

    if (!isRefund && creditsToProcess <= 0) {
      return NextResponse.json(
        { error: "Invalid request: creditsUsed must be a positive number" },
        { status: 400 }
      )
    }

    // Get user
    const user = await getUserByClerkId(userId)
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Check if user has enough credits (unless they have unlimited or refund)
    const hasUnlimited = user.subscriptionStatus === "active"
    if (!isRefund && !hasUnlimited && user.credits < creditsToProcess) {
      return NextResponse.json(
        { 
          error: "Insufficient credits",
          credits: user.credits,
          required: creditsToProcess
        },
        { status: 402 } // Payment Required
      )
    }

    // Deduct or refund credits (only if not unlimited)
    if (!hasUnlimited) {
      if (isRefund) {
        // Refund: add credits back
        await updateUserCredits(user.id, user.credits + creditsToProcess)
      } else {
        // Deduct credits
        await deductCredits(userId, creditsToProcess)
      }
    }

    // Log usage (only for deductions, not refunds)
    if (!isRefund) {
      await logUsage({
        userId: userId,
        tool: tool,
        creditsUsed: creditsToProcess,
      })
    }

    // Get updated user to return new credit balance
    const updatedUser = await getUserByClerkId(userId)

    return NextResponse.json({
      success: true,
      creditsRemaining: updatedUser?.credits ?? 0,
      hasUnlimited,
    })
  } catch (error: any) {
    console.error("Error processing usage:", error)
    return NextResponse.json(
      { error: error.message || "Failed to process usage" },
      { status: 500 }
    )
  }
}
