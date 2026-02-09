import { useQuery } from '@tanstack/react-query'
import { publicClient, contracts } from '../lib/contracts'

export interface Agent {
  wallet: `0x${string}`
  nodeId: string
  metadata: string
  registeredAt: bigint
  lastHeartbeat: bigint
  status: number
  stake: bigint
}

export const useAgents = () => {
  return useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const addresses = await publicClient.readContract({
        ...contracts.agentRegistry,
        functionName: 'getAllAgents',
      }) as `0x${string}`[]

      const agents = await Promise.all(
        addresses.map(async (address) => {
          const agent = await publicClient.readContract({
            ...contracts.agentRegistry,
            functionName: 'getAgent',
            args: [address],
          }) as Agent

          return {
            ...agent,
            wallet: address,
          }
        })
      )

      return agents
    },
    refetchInterval: 10000,
  })
}

export const useActiveAgents = () => {
  return useQuery({
    queryKey: ['activeAgents'],
    queryFn: async () => {
      const addresses = await publicClient.readContract({
        ...contracts.agentRegistry,
        functionName: 'getActiveAgents',
      }) as `0x${string}`[]

      const agents = await Promise.all(
        addresses.map(async (address) => {
          const agent = await publicClient.readContract({
            ...contracts.agentRegistry,
            functionName: 'getAgent',
            args: [address],
          }) as Agent

          return {
            ...agent,
            wallet: address,
          }
        })
      )

      return agents
    },
    refetchInterval: 10000,
  })
}

export const useAgentCount = () => {
  return useQuery({
    queryKey: ['agentCount'],
    queryFn: async () => {
      const [total, active] = await Promise.all([
        publicClient.readContract({
          ...contracts.agentRegistry,
          functionName: 'getTotalAgentCount',
        }) as Promise<bigint>,
        publicClient.readContract({
          ...contracts.agentRegistry,
          functionName: 'getActiveAgentCount',
        }) as Promise<bigint>,
      ])

      return {
        total: Number(total),
        active: Number(active),
      }
    },
    refetchInterval: 10000,
  })
}
