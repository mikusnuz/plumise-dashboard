/// <reference types="vite/client" />

// Chain config and contract addresses are sourced from @plumise/core (see config/chain.ts).
// No VITE_* env vars are used at runtime.

interface Window {
  ethereum?: {
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
    on?: (event: string, callback: (...args: unknown[]) => void) => void
    removeListener?: (event: string, callback: (...args: unknown[]) => void) => void
  }
}
