import { create } from "zustand"
import { User } from "@/lib/db"

interface UserState {
  user: User | null
  credits: number
  isLoading: boolean
  setUser: (user: User | null) => void
  setCredits: (credits: number) => void
  fetchUser: (clerkId: string) => Promise<void>
  refreshCredits: (clerkId: string) => Promise<void>
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  credits: 0,
  isLoading: false,

  setUser: (user) => {
    set({ user, credits: user?.credits ?? 0 })
  },

  setCredits: (credits) => {
    set({ credits })
    if (get().user) {
      set({ user: { ...get().user!, credits } })
    }
  },

  fetchUser: async (clerkId: string) => {
    set({ isLoading: true })
    try {
      const response = await fetch(`/api/user?clerkId=${clerkId}`)
      if (response.ok) {
        const user = await response.json()
        set({ user, credits: user.credits ?? 0, isLoading: false })
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
        set({ credits: user.credits ?? 0, user })
      }
    } catch (error) {
      console.error("Error refreshing credits:", error)
    }
  },
}))

