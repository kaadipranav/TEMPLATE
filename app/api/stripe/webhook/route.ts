import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { getUserByClerkId, updateUserCredits } from "@/lib/db"
import { db } from "@/lib/db"
import { schema } from "@/lib/db"
import { eq } from "drizzle-orm"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "No signature" },
      { status: 400 }
    )
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set")
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  try {
    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.mode === "subscription" && session.metadata?.userId) {
          const userId = session.metadata.userId
          const customerId = session.customer as string
          const subscriptionId = session.subscription as string

          // Get user from database
          const user = await getUserByClerkId(userId)
          if (!user) {
            console.error("User not found:", userId)
            break
          }

          // Update user with Stripe customer ID and subscription
          await db
            .update(schema.users)
            .set({
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              subscriptionStatus: "active",
              updatedAt: new Date(),
            })
            .where(eq(schema.users.id, user.id))

          // Give unlimited credits (or set to a high number)
          await updateUserCredits(user.id, 999999)

          console.log(`Subscription activated for user: ${userId}`)
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find user by Stripe customer ID
        const [user] = await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.stripeCustomerId, customerId))
          .limit(1)

        if (user) {
          const status = subscription.status === "active" ? "active" : "cancelled"
          
          await db
            .update(schema.users)
            .set({
              subscriptionStatus: status,
              stripeSubscriptionId: subscription.id,
              updatedAt: new Date(),
            })
            .where(eq(schema.users.id, user.id))

          // If subscription is active, ensure unlimited credits
          if (status === "active") {
            await updateUserCredits(user.id, 999999)
          } else {
            // If cancelled, reset to free tier credits
            await updateUserCredits(user.id, 100)
          }

          console.log(`Subscription updated for user: ${user.id}, status: ${status}`)
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find user by Stripe customer ID
        const [user] = await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.stripeCustomerId, customerId))
          .limit(1)

        if (user) {
          await db
            .update(schema.users)
            .set({
              subscriptionStatus: "cancelled",
              updatedAt: new Date(),
            })
            .where(eq(schema.users.id, user.id))

          // Reset to free tier credits
          await updateUserCredits(user.id, 100)

          console.log(`Subscription cancelled for user: ${user.id}`)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Error processing webhook:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}
