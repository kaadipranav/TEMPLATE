import { NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { createCheckoutSession, PRICE_IDS } from "@/lib/stripe"
import { getUserByClerkId } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Get user from database
    const dbUser = await getUserByClerkId(userId)
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      )
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress || ""
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    // Create Stripe checkout session
    const session = await createCheckoutSession({
      customerId: dbUser.stripeCustomerId || undefined,
      priceId: PRICE_IDS.PRO_MONTHLY,
      userId: userId,
      userEmail: email,
      successUrl: `${siteUrl}/billing?success=true`,
      cancelUrl: `${siteUrl}/billing?canceled=true`,
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
