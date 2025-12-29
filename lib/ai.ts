import { streamText, generateText } from "ai"
import { openai } from "ai/openai"
import type { CoreMessage } from "ai"

// EASY CUSTOM: Change default provider here or via env
const DEFAULT_PROVIDER = process.env.AI_PROVIDER || "openai"
const DEFAULT_MODEL = process.env.AI_MODEL || "gpt-4o-mini"

export type AIProvider = "openai" | "groq" | "anthropic"

/**
 * Get the AI model provider based on env or parameter
 * Note: Groq and Anthropic require additional setup
 */
export function getProvider(provider?: AIProvider) {
  const selectedProvider = provider || (DEFAULT_PROVIDER as AIProvider)

  switch (selectedProvider) {
    case "groq":
      // EASY CUSTOM: Uncomment and install @ai-sdk/groq to enable Groq
      // import { createGroq } from "@ai-sdk/groq"
      // return createGroq({ apiKey: process.env.GROQ_API_KEY })
      throw new Error("Groq provider not configured. Install @ai-sdk/groq package.")
    case "anthropic":
      // EASY CUSTOM: Uncomment and install @ai-sdk/anthropic to enable Anthropic
      // import { createAnthropic } from "@ai-sdk/anthropic"
      // return createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
      throw new Error("Anthropic provider not configured. Install @ai-sdk/anthropic package.")
    case "openai":
    default:
      if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is not set")
      }
      return openai
  }
}

/**
 * Get the model name based on provider
 */
export function getModel(provider?: AIProvider, customModel?: string) {
  if (customModel) return customModel

  const selectedProvider = provider || (DEFAULT_PROVIDER as AIProvider)

  switch (selectedProvider) {
    case "groq":
      return "llama-3.1-70b-versatile"
    case "anthropic":
      return "claude-3-5-sonnet-20241022"
    case "openai":
    default:
      return DEFAULT_MODEL
  }
}

/**
 * Stream text generation using the selected provider
 */
export async function streamAIResponse({
  prompt,
  messages,
  provider,
  model,
  maxTokens = 2000,
  temperature = 0.7,
  system,
}: {
  prompt?: string
  messages?: CoreMessage[]
  provider?: AIProvider
  model?: string
  maxTokens?: number
  temperature?: number
  system?: string
}) {
  const selectedProvider = provider || (DEFAULT_PROVIDER as AIProvider)
  const modelName = getModel(selectedProvider, model)
  const aiProvider = getProvider(selectedProvider)

  const result = await streamText({
    model: aiProvider(modelName),
    prompt: prompt,
    messages: messages,
    system: system,
    maxTokens,
    temperature,
  })

  return result
}

/**
 * Generate a single text response (non-streaming)
 */
export async function generateAIResponse({
  prompt,
  messages,
  provider,
  model,
  maxTokens = 2000,
  temperature = 0.7,
  system,
}: {
  prompt?: string
  messages?: CoreMessage[]
  provider?: AIProvider
  model?: string
  maxTokens?: number
  temperature?: number
  system?: string
}) {
  const selectedProvider = provider || (DEFAULT_PROVIDER as AIProvider)
  const modelName = getModel(selectedProvider, model)
  const aiProvider = getProvider(selectedProvider)

  const result = await generateText({
    model: aiProvider(modelName),
    prompt: prompt,
    messages: messages,
    system: system,
    maxTokens,
    temperature,
  })

  return result.text
}
