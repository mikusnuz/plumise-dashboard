import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { Agent } from '../lib/types'

export type { Agent }

export const useAgents = () => {
  return useQuery({
    queryKey: ['agents'],
    queryFn: () => api.getAgents(),
    refetchInterval: 30000,
  })
}

export const useActiveAgents = () => {
  return useQuery({
    queryKey: ['activeAgents'],
    queryFn: () => api.getActiveAgents(),
    refetchInterval: 30000,
  })
}

export const useAgent = (address?: string) => {
  return useQuery({
    queryKey: ['agent', address],
    queryFn: () => api.getAgent(address!),
    enabled: !!address,
    refetchInterval: 30000,
  })
}
