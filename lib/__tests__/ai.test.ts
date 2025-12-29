import { describe, it, expect, vi, beforeEach } from "vitest"
import { streamAIResponse, getProvider, getModel } from "../ai"

// Mock Vercel AI SDK
const mockStreamText = vi.fn().mockResolvedValue({
  toDataStreamResponse: vi.fn(() => new Response()),
  text: "Test AI response",
})

vi.mock("ai/openai", () => ({
  openai: vi.fn((model: string) => ({
    model,
    provider: "openai",
  })),
}))

vi.mock("ai", () => ({
  streamText: mockStreamText,
  generateText: vi.fn().mockResolvedValue({
    text: "Test AI response",
  }),
}))

describe("AI Utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.OPENAI_API_KEY = "test-key"
  })

  it("should get OpenAI provider by default", () => {
    const provider = getProvider()
    expect(provider).toBeDefined()
  })

  it("should get default model name", () => {
    const model = getModel()
    expect(model).toBe("gpt-4o-mini")
  })

  it("should stream AI response with valid prompt", async () => {
    const result = await streamAIResponse({
      prompt: "Test prompt",
      provider: "openai",
    })

    expect(result).toBeDefined()
    expect(mockStreamText).toHaveBeenCalled()
  })

  it("should handle missing API key", () => {
    const originalKey = process.env.OPENAI_API_KEY
    delete process.env.OPENAI_API_KEY

    expect(() => getProvider("openai")).toThrow("OPENAI_API_KEY is not set")

    process.env.OPENAI_API_KEY = originalKey
  })
})
