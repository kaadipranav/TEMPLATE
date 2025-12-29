import { create } from "zustand"
import { User } from "@/lib/db"
import { toast } from "@/lib/utils"

interface UserState {
  user: User | null
  credits: number
  isLoading: boolean
  lowCreditsWarningShown: boolean
  setUser: (user: User | null) => void
  setCredits: (credits: number) => void
  fetchUser: (clerkId: string) => Promise<void>
  refreshCredits: (clerkId: string) => Promise<void>
  checkLowCredits: (redirectToBilling?: () => void) => void
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  credits: 0,
  isLoading: false,
  lowCreditsWarningShown: false,

  setUser: (user) => {
    const credits = user?.credits ?? 0
    set({ user, credits })
    // Check for low credits when user is set
    get().checkLowCredits()
  },

  setCredits: (credits) => {
    set({ credits })
    if (get().user) {
      set({ user: { ...get().user!, credits } })
    }
    // Check for low credits when credits are updated
    get().checkLowCredits()
  },

  fetchUser: async (clerkId: string) => {
    set({ isLoading: true })
    try {
      const response = await fetch(`/api/user?clerkId=${clerkId}`)
      if (response.ok) {
        const user = await response.json()
        const credits = user.credits ?? 0
        set({ user, credits, isLoading: false })
        // Check for low credits after fetching
        get().checkLowCredits()
      } else {
        set({ isLoading: false })
      }
    } catch (error) {
      console.error("Error fetching user:", error)
      set({ isLoading: false })
    }
  },

  refreshCredits: async (clerkId: string) => {
    try {
      const response = await fetch(`/api/user?clerkId=${clerkId}`)
      if (response.ok) {
        const user = await response.json()
        const credits = user.credits ?? 0
        set({ credits, user })
        // Check for low credits after refresh
        get().checkLowCredits()
      }
    } catch (error) {
      console.error("Error refreshing credits:", error)
    }
  },

  checkLowCredits: (redirectToBilling) => {
    const { credits, user, lowCreditsWarningShown } = get()
    
    // Don't check if user has unlimited credits
    if (user?.subscriptionStatus === "active") {
      return
    }

    // Show warning if credits are low (less than 10) and haven't shown warning yet
    if (credits < 10 && !lowCreditsWarningShown) {
      set({ lowCreditsWarningShown: true })
      
      const message = "Low credits! Upgrade to Pro for unlimited access."
      
      if (redirectToBilling) {
        toast.error(message, {
          action: {
            label: "Go to Billing",
            onClick: redirectToBilling,
          },
          duration: 5000,
        })
      } else {
        toast.error(message, {
          duration: 5000,
        })
      }
    }

    // Reset warning flag if credits go above threshold
    if (credits >= 10 && lowCreditsWarningShown) {
      set({ lowCreditsWarningShown: false })
    }
  },
}))

