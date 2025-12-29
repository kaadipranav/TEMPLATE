import Link from "next/link"
import { CheckCircle2, CreditCard, Lock, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16 pt-10 md:gap-24 md:pt-14">
      {/* Hero */}
      <section className="container grid items-center gap-10 md:grid-cols-[1.1fr_minmax(0,1fr)]">
        <div className="space-y-6">
          <Badge className="flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 px-3 py-1 text-xs font-medium text-white shadow-md">
            <Sparkles className="h-3.5 w-3.5" />
            Launch your AI SaaS in days, not months
          </Badge>

          <div className="space-y-4">
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Launch AI SaaS in Days –{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                Next.js Boilerplate
              </span>
            </h1>
            <p className="text-balance text-base text-muted-foreground sm:text-lg">
              A production-ready Next.js 15 starter kit with Clerk auth, Stripe
              billing, Supabase + Drizzle, and 4 AI tools built-in. Save 100+
              hours of boilerplate and ship your micro-SaaS this week.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/sign-up">Get started – Free trial</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
              asChild
            >
              <Link href="/sign-in">View live demo</Link>
            </Button>
          </div>

          <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Auth, billing, AI & admin included</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Deploy to Vercel in minutes</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-cyan-400/10 blur-3xl" />
          <Card className="border-muted bg-gradient-to-b from-background/60 to-muted/60 shadow-lg backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span>What you get</span>
                <span className="text-xs font-normal text-muted-foreground">
                  100+ hours saved
                </span>
              </CardTitle>
              <CardDescription>
                Pre-built flows so you can focus on your niche, not boilerplate.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                  <span>
                    <span className="font-medium text-foreground">
                      4 AI tools ready to sell
                    </span>{" "}
                    – Chat, content, image, and PDF summarizer with credits.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                  <span>
                    <span className="font-medium text-foreground">
                      Full SaaS stack wired
                    </span>{" "}
                    – Clerk auth, Supabase + Drizzle, Stripe subscriptions.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                  <span>
                    <span className="font-medium text-foreground">
                      Production-grade UI
                    </span>{" "}
                    – Shadcn + Tailwind with dark mode & responsive layout.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container space-y-8">
        <div className="space-y-3 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Everything you need to sell an AI SaaS
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
            Auth, AI, billing, and admin – wired together with a clean
            codebase and clear extension points.
          </p>
        </div>

        <div
          id="tools"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Clerk Auth</CardTitle>
              <CardDescription>Sign up, sign in, and profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Email + social login out of the box.</p>
              <p>Protected routes, middleware, and webhooks included.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI Tools</CardTitle>
              <CardDescription>4 production-ready demos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Chat, content gen, image gen, and PDF summarizer.</p>
              <p>Credits system baked into every call.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Billing & Credits</CardTitle>
              <CardDescription>Stripe subscriptions + usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Free tier with 100 credits, paid plan with unlimited usage.</p>
              <p>Supabase + Drizzle for reliable tracking.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Admin Dashboard</CardTitle>
              <CardDescription>See users & usage at a glance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Superadmin-only area for monitoring accounts.</p>
              <p>Ready to plug into revenue metrics.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container space-y-8">
        <div className="space-y-3 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Simple pricing, built for ROI
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
            Use the included pricing copy or swap it for your own – the billing
            flows are already wired.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <Card className="border-muted">
            <CardHeader>
              <CardTitle className="flex items-baseline justify-between">
                <span>Free Tier</span>
                <span className="text-sm font-normal text-muted-foreground">
                  Great for testing
                </span>
              </CardTitle>
              <CardDescription>
                Use this tier as a free trial or credit-limited starter plan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-1 text-3xl font-semibold">
                $0
                <span className="text-xs font-normal text-muted-foreground">
                  /month
                </span>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                  <span>100 credits per month included</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                  <span>Access to all 4 AI tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                  <span>Perfect for validating your niche</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/40 shadow-lg shadow-primary/10">
            <CardHeader>
              <CardTitle className="flex items-baseline justify-between">
                <span>Pro Plan</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  Best seller
                </span>
              </CardTitle>
              <CardDescription>
                Default paid plan: unlimited credits for serious users.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-1 text-3xl font-semibold">
                $29
                <span className="text-xs font-normal text-muted-foreground">
                  /month
                </span>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                  <span>Unlimited credits & usage</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                  <span>Priority support potential for your buyers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                  <span>Stripe subscriptions pre-wired</span>
                </li>
              </ul>
              <Button className="w-full" asChild>
                <Link href="/sign-up">Start with Pro</Link>
              </Button>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />
                Powered by Stripe subscriptions
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="container">
        <Card className="border-dashed border-primary/40 bg-gradient-to-r from-primary/5 via-background to-primary/5">
          <CardContent className="flex flex-col items-center justify-between gap-4 py-6 text-center sm:flex-row sm:text-left">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold sm:text-base">
                Ready to launch your AI SaaS in days?
              </h3>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Sign up, connect your keys, and start selling – the stack is
                already done for you.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild size="sm" className="sm:w-auto">
                <Link href="/sign-up">Get Started</Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="sm:w-auto">
                <Link href="/sign-in">Sign in to your dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

