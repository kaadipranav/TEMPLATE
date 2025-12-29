import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"

import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { ErrorBoundary } from "@/components/error-boundary"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "AI SaaS Starter 2025 - Launch Your AI-Powered SaaS in 48 Hours",
    template: "%s | AI SaaS Starter 2025",
  },
  description: "Complete Next.js boilerplate for building AI-powered SaaS applications. Includes authentication, payments, credits system, and 4 working AI examples.",
  keywords: ["AI SaaS", "Next.js", "OpenAI", "Stripe", "Boilerplate", "Starter Kit"],
  authors: [{ name: "AI SaaS Starter" }],
  creator: "AI SaaS Starter",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://ai-saas-starter.com",
    title: "AI SaaS Starter 2025",
    description: "Launch your AI-powered SaaS in 48 hours",
    siteName: "AI SaaS Starter 2025",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI SaaS Starter 2025",
    description: "Launch your AI-powered SaaS in 48 hours",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ErrorBoundary>
            <ThemeProvider>
              <div className="flex min-h-screen flex-col bg-background text-foreground">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </ThemeProvider>
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  )
}

