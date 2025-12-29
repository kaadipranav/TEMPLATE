import { auth, currentUser } from "@clerk/nextjs/server"
import { getUserByClerkId, createUser } from "./db"

/**
 * Get the current authenticated user from Clerk
 * Returns null if not authenticated
 */
export async function getAuthUser() {
  const { userId } = await auth()
  if (!userId) return null
  
  const clerkUser = await currentUser()
  if (!clerkUser) return null
  
  return {
    clerkId: userId,
    email: clerkUser.emailAddresses[0]?.emailAddress || "",
    firstName: clerkUser.firstName || "",
    lastName: clerkUser.lastName || "",
    imageUrl: clerkUser.imageUrl || "",
  }
}

/**
 * Get or create user in database
 * Syncs Clerk user with our database
 */
export async function getOrCreateDbUser() {
  const authUser = await getAuthUser()
  if (!authUser) {
    throw new Error("User not authenticated")
  }
  
  // Try to get existing user
  let dbUser = await getUserByClerkId(authUser.clerkId)
  
  // Create user if doesn't exist
  if (!dbUser) {
    dbUser = await createUser({
      clerkId: authUser.clerkId,
      email: authUser.email,
    })
  }
  
  return dbUser
}

/**
 * Check if user is authenticated
 */
export async function requireAuth() {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("Unauthorized")
  }
  return userId
}
