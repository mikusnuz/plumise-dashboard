import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

export const useThroughput = () => {
  return useQuery({
    queryKey: ['throughput'],
    queryFn: () => api.getThroughputHistory(24),
    refetchInterval: 30000,
    staleTime: 25000,
  })
}

export const useAgentCapacities = () => {
  return useQuery({
    queryKey: ['agentCapacities'],
    queryFn: () => api.getAgentCapacities(),
    refetchInterval: 30000,
    staleTime: 25000,
  })
}
