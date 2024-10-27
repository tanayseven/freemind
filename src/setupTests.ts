import "@testing-library/jest-dom"
import { vi } from "vitest"
import { cleanup } from "@testing-library/svelte"

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  value: vi.fn().mockImplementation((query) => ({
    addEventListener: vi.fn(),
    addListener: vi.fn(),
    dispatchEvent: vi.fn(),
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
    removeListener: vi.fn(),
  })),
  writable: true,
})

// Cleanup after each test
afterEach(() => {
  cleanup()
})
