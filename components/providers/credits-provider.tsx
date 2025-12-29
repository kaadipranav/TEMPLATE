"use client"

import { useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useUserStore } from "@/lib/store/user-store"
import { useRouter } from "next/navigation"

export default function CreditsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { user: clerkUser } = useUser()
  const { fetchUser, checkLowCredits } = useUserStore()
  const router = useRouter()

  // Fetch user data on mount
  useEffect(() => {
    if (clerkUser?.id) {
      fetchUser(clerkUser.id)
    }
  }, [clerkUser?.id, fetchUser])

  // Check for low credits periodically
  useEffect(() => {
    if (clerkUser?.id) {
      const interval = setInterval(() => {
        checkLowCredits(() => router.push("/billing"))
      }, 30000) // Check every 30 seconds

      return () => clearInterval(interval)
    }
  }, [clerkUser?.id, checkLowCredits, router])

  return <>{children}</>
}

