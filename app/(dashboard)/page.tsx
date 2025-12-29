import { redirect } from "next/navigation"

export default function DashboardPage() {
  // Redirect to AI Chat as default dashboard page
  redirect("/ai-chat")
}

