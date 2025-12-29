// Database utilities - re-export from lib/db/index.ts
export { db, schema } from "./db/index"
export type { User, NewUser, UsageLog, NewUsageLog } from "./db/schema"

// Helper functions for common queries
import { eq, desc, sql, count } from "drizzle-orm"
import { db, schema } from "./db/index"

export async function getUserByClerkId(clerkId: string) {
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.clerkId, clerkId))
    .limit(1)
  
  return user || null
}

export async function getUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1)
  
  return user || null
}

export async function createUser(data: {
  clerkId: string
  email: string
  credits?: number
  subscriptionStatus?: string
}) {
  const [user] = await db
    .insert(schema.users)
    .values({
      clerkId: data.clerkId,
      email: data.email,
      credits: data.credits ?? 100,
      subscriptionStatus: data.subscriptionStatus ?? "free",
    })
    .returning()
  
  return user
}

export async function updateUserCredits(
  userId: string,
  credits: number
) {
  const [user] = await db
    .update(schema.users)
    .set({ credits, updatedAt: new Date() })
    .where(eq(schema.users.id, userId))
    .returning()
  
  return user
}

export async function deductCredits(
  userId: string,
  creditsToDeduct: number
) {
  const user = await getUserByClerkId(userId)
  if (!user) {
    throw new Error("User not found")
  }
  
  const newCredits = Math.max(0, user.credits - creditsToDeduct)
  return updateUserCredits(user.id, newCredits)
}

export async function logUsage(data: {
  userId: string
  tool: string
  creditsUsed: number
}) {
  const user = await getUserByClerkId(data.userId)
  if (!user) {
    throw new Error("User not found")
  }
  
  const [log] = await db
    .insert(schema.usageLogs)
    .values({
      userId: user.id,
      tool: data.tool,
      creditsUsed: data.creditsUsed,
    })
    .returning()
  
  return log
}

// Admin functions
export async function getAllUsers() {
  return await db
    .select()
    .from(schema.users)
    .orderBy(desc(schema.users.createdAt))
}

export async function getTotalUsers() {
  const [result] = await db
    .select({ count: count() })
    .from(schema.users)
  
  return result?.count ?? 0
}

export async function getActiveSubscriptions() {
  const [result] = await db
    .select({ count: count() })
    .from(schema.users)
    .where(eq(schema.users.subscriptionStatus, "active"))
  
  return result?.count ?? 0
}

export async function getTotalUsage() {
  const [result] = await db
    .select({ total: sql<number>`sum(${schema.usageLogs.creditsUsed})` })
    .from(schema.usageLogs)
  
  return Number(result?.total ?? 0)
}
