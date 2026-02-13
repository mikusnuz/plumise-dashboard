import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

export const useNetworkStats = () => {
  const { data, isLoading, isError, dataUpdatedAt, isStale } = useQuery({
    queryKey: ['networkStats'],
    queryFn: () => api.getStats(),
    refetchInterval: 30000,
    staleTime: 25000,
    gcTime: 60000,
    retry: 2,
  })

  return {
    activeAgents: data?.activeAgents ?? 0,
    totalAgents: data?.totalAgents ?? 0,
    currentEpoch: data?.currentEpoch ?? 0,
    blockNumber: data?.blockNumber ?? 0,
    isLoading,
    isError,
    isStale,
    lastUpdated: dataUpdatedAt ? new Date(dataUpdatedAt) : null,
  }
}
