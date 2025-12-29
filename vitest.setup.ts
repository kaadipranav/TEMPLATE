import "@testing-library/jest-dom"
import { vi } from "vitest"

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}))

// Mock Clerk
vi.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    user: {
      id: "test-user-id",
      emailAddresses: [{ emailAddress: "test@example.com" }],
    },
  }),
  useClerk: () => ({
    signOut: vi.fn(),
  }),
  auth: vi.fn(() => Promise.resolve({ userId: "test-user-id" })),
  currentUser: vi.fn(() =>
    Promise.resolve({
      id: "test-user-id",
      emailAddresses: [{ emailAddress: "test@example.com" }],
    })
  ),
}))

