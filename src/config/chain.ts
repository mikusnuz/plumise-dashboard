import { defineChain } from 'viem'

export const plumise = defineChain({
  id: Number(import.meta.env.VITE_CHAIN_ID),
  name: 'Plumise',
  nativeCurrency: {
    decimals: 18,
    name: 'PLM',
    symbol: 'PLM',
  },
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_RPC_URL],
      webSocket: [import.meta.env.VITE_WS_URL],
    },
    public: {
      http: [import.meta.env.VITE_RPC_URL],
      webSocket: [import.meta.env.VITE_WS_URL],
    },
  },
  blockExplorers: {
    default: { name: 'Plumscan', url: 'https://scan.plumise.com' },
  },
})

export const CONTRACTS = {
  REWARD_POOL: import.meta.env.VITE_REWARD_POOL_ADDRESS as `0x${string}`,
  AGENT_REGISTRY: import.meta.env.VITE_AGENT_REGISTRY_ADDRESS as `0x${string}`,
  CHALLENGE_MANAGER: import.meta.env.VITE_CHALLENGE_MANAGER_ADDRESS as `0x${string}`,
}
