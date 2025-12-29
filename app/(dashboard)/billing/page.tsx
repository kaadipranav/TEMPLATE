"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useUserStore } from "@/lib/store/user-store"
import { loadStripe } from "@stripe/stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, Zap, Crown } from "lucide-react"
import { toast } from "@/lib/utils"
import { useSearchParams } from "next/navigation"
import { Metadata } from "next"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
)

export default function BillingPage() {
  const { user: clerkUser } = useUser()
  const { user, credits, fetchUser, refreshCredits } = useUserStore()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (clerkUser?.id) {
      fetchUser(clerkUser.id)
    }
  }, [clerkUser?.id, fetchUser])

  // Handle success/cancel from Stripe
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Subscription activated! Your credits have been updated.")
      if (clerkUser?.id) {
        refreshCredits(clerkUser.id)
      }
    }
    if (searchParams.get("canceled") === "true") {
      toast.error("Checkout was canceled.")
    }
  }, [searchParams, clerkUser?.id, refreshCredits])

  const handleUpgrade = async () => {
    if (!clerkUser?.id) {
      toast.error("Please sign in to upgrade")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/stripe/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session")
      }

      const stripe = await stripePromise
      if (!stripe) {
        throw new Error("Stripe failed to load")
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      })

      if (error) {
        throw new Error(error.message)
      }
    } catch (error: any) {
      console.error("Error:", error)
      toast.error(error.message || "Failed to start checkout")
    } finally {
      setIsLoading(false)
    }
  }

  const isPro = user?.subscriptionStatus === "active"
  const currentPlan = isPro ? "Pro" : "Free"

  return (
    <div className="container mx-auto max-w-5xl p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription and credits
        </p>
      </div>

      {/* Current Plan Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                Your current subscription plan and credits
              </CardDescription>
            </div>
            <Badge variant={isPro ? "default" : "secondary"} className="text-lg px-3 py-1">
              {currentPlan}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted">
            <div className="flex items-center space-x-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Credits Balance</p>
                <p className="text-sm text-muted-foreground">
                  {isPro ? "Unlimited" : `${credits.toLocaleString()} remaining`}
                </p>
              </div>
            </div>
            {!isPro && credits < 10 && (
              <Badge variant="destructive">Low Credits</Badge>
            )}
          </div>

          {isPro && (
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center space-x-2 text-primary">
                <Crown className="h-5 w-5" />
                <p className="font-medium">Pro Plan Active</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                You have unlimited credits and access to all features.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pricing Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Free Plan */}
        <Card className={!isPro ? "border-primary" : ""}>
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>Perfect for trying out our AI tools</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-primary" />
                <span>100 credits per month</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Access to all AI tools</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Basic support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {!isPro ? (
              <Badge variant="outline" className="w-full justify-center py-2">
                Current Plan
              </Badge>
            ) : (
              <Button variant="outline" className="w-full" disabled>
                Downgrade
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className={isPro ? "border-primary" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pro</CardTitle>
              <Badge>Best Value</Badge>
            </div>
            <CardDescription>Unlimited access to all features</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">$29</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <span>Unlimited credits</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-primary" />
                <span>All AI tools included</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Early access to new features</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {isPro ? (
              <Badge variant="default" className="w-full justify-center py-2">
                Current Plan
              </Badge>
            ) : (
              <Button
                onClick={handleUpgrade}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Processing..." : "Upgrade to Pro"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      {/* Info */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            All payments are securely processed by Stripe. Cancel anytime from your account settings.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
