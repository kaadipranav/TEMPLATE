import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock auth and database
const mockAuth = vi.fn()
const mockGetUserByClerkId = vi.fn()
const mockDeductCredits = vi.fn()
const mockLogUsage = vi.fn()

vi.mock("@clerk/nextjs/server", () => ({
  auth: () => mockAuth(),
}))

vi.mock("../db", () => ({
  getUserByClerkId: mockGetUserByClerkId,
  deductCredits: mockDeductCredits,
  logUsage: mockLogUsage,
  updateUserCredits: vi.fn(),
}))

describe("Usage API", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuth.mockResolvedValue({ userId: "test-user-id" })
  })

  it("should return 402 for insufficient credits", async () => {
    mockGetUserByClerkId.mockResolvedValue({
      id: "user-1",
      credits: 5,
      subscriptionStatus: "free",
    })

    // Import the route handler
    const { POST } = await import("../../app/api/usage/route")

    const request = new Request("http://localhost/api/usage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tool: "ai-chat",
        creditsUsed: 10,
      }),
    })

    const response = await POST(request as any)
    const data = await response.json()

    expect(response.status).toBe(402)
    expect(data.error).toBe("Insufficient credits")
    expect(data.credits).toBe(5)
  })

  it("should deduct credits for valid request", async () => {
    mockGetUserByClerkId
      .mockResolvedValueOnce({
        id: "user-1",
        credits: 100,
        subscriptionStatus: "free",
      })
      .mockResolvedValueOnce({
        id: "user-1",
        credits: 99,
        subscriptionStatus: "free",
      })

    mockDeductCredits.mockResolvedValue({
      id: "user-1",
      credits: 99,
    })

    mockLogUsage.mockResolvedValue({
      id: "log-1",
      userId: "user-1",
      tool: "ai-chat",
      creditsUsed: 1,
    })

    const { POST } = await import("../../app/api/usage/route")

    const request = new Request("http://localhost/api/usage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tool: "ai-chat",
        creditsUsed: 1,
      }),
    })

    const response = await POST(request as any)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.creditsRemaining).toBe(99)
  })
})

