import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Sidebar from "@/components/layout/sidebar"
import DashboardHeader from "@/components/layout/dashboard-header"

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
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto bg-muted/50">
          {children}
        </main>
      </div>
    </div>
  )
}

