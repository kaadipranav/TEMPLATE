import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock the database functions
const mockGetUserByClerkId = vi.fn()
const mockUpdateUserCredits = vi.fn()

vi.mock("../db", async () => {
  const actual = await vi.importActual("../db")
  return {
    ...actual,
    getUserByClerkId: mockGetUserByClerkId,
    updateUserCredits: mockUpdateUserCredits,
  }
})

import { deductCredits } from "../db"

describe("Credits System", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should deduct credits correctly", async () => {
    mockGetUserByClerkId.mockResolvedValue({
      id: "user-1",
      clerkId: "clerk-1",
      credits: 100,
    })

    mockUpdateUserCredits.mockResolvedValue({
      id: "user-1",
      credits: 95,
    })

    const result = await deductCredits("clerk-1", 5)

    expect(result).toBeDefined()
    expect(result?.credits).toBe(95)
    expect(mockUpdateUserCredits).toHaveBeenCalledWith("user-1", 95)
  })

  it("should not allow negative credits", async () => {
    mockGetUserByClerkId.mockResolvedValue({
      id: "user-1",
      clerkId: "clerk-1",
      credits: 3,
    })

    mockUpdateUserCredits.mockResolvedValue({
      id: "user-1",
      credits: 0,
    })

    const result = await deductCredits("clerk-1", 10)

    expect(result?.credits).toBeGreaterThanOrEqual(0)
    expect(mockUpdateUserCredits).toHaveBeenCalledWith("user-1", 0)
  })

  it("should throw error if user not found", async () => {
    mockGetUserByClerkId.mockResolvedValue(null)

    await expect(deductCredits("invalid-clerk-id", 5)).rejects.toThrow(
      "User not found"
    )
  })
})
