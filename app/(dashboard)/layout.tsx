import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Metadata } from "next"
import Sidebar from "@/components/layout/sidebar"
import DashboardHeader from "@/components/layout/dashboard-header"
import CreditsProvider from "@/components/providers/credits-provider"
import { ErrorBoundary } from "@/components/error-boundary"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your AI tools, credits, and subscription",
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  
  // Redirect to sign-in if not authenticated
  if (!userId) {
    redirect("/sign-in")
  }
  
  return (
    <ErrorBoundary>
      <CreditsProvider>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <DashboardHeader />
            <main className="flex-1 overflow-y-auto bg-muted/50">
              {children}
            </main>
          </div>
        </div>
      </CreditsProvider>
    </ErrorBoundary>
  )
}
