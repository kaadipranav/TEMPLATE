"use client"

import { useEffect } from "react"
import { useUser, useClerk } from "@clerk/nextjs"
import { useUserStore } from "@/lib/store/user-store"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { CreditCard, LogOut, User, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DashboardHeader() {
  const { user: clerkUser } = useUser()
  const { signOut } = useClerk()
  const { user, credits, fetchUser, isLoading } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    if (clerkUser?.id) {
      fetchUser(clerkUser.id)
    }
  }, [clerkUser?.id, fetchUser])

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Credits Display */}
        <div className="flex items-center space-x-2 rounded-lg border bg-muted px-3 py-1.5">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">
            {isLoading ? "..." : credits.toLocaleString()} Credits
          </span>
          {credits < 10 && (
            <Badge variant="destructive" className="ml-2 text-xs">
              Low
            </Badge>
          )}
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              {clerkUser?.imageUrl ? (
                <img
                  src={clerkUser.imageUrl}
                  alt={clerkUser.fullName || "User"}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {clerkUser?.firstName?.[0] || clerkUser?.emailAddresses[0]?.emailAddress?.[0] || "U"}
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">
                  {clerkUser?.fullName || "User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {clerkUser?.emailAddresses[0]?.emailAddress}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/billing" className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

