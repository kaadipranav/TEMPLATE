import { NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { getAllUsers, getTotalUsers, getActiveSubscriptions, getTotalUsage } from "@/lib/db"

// EASY CUSTOM: Change this to your admin email
const SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL || "admin@example.com"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is superadmin
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userEmail = clerkUser.emailAddresses[0]?.emailAddress || ""
    if (userEmail !== SUPERADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      )
    }

    // Fetch all data
    const [users, totalUsers, activeSubs, totalUsage] = await Promise.all([
      getAllUsers(),
      getTotalUsers(),
      getActiveSubscriptions(),
      getTotalUsage(),
    ])

    // Calculate revenue stub (active subs * $29)
    const revenue = activeSubs * 29

    return NextResponse.json({
      users,
      metrics: {
        totalUsers,
        activeSubscriptions: activeSubs,
        totalUsage,
        revenue, // Stub revenue calculation
      },
    })
  } catch (error: any) {
    console.error("Error fetching admin data:", error)
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    )
  }
}

