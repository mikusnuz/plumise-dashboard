import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

export const useNetworkStats = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['networkStats'],
    queryFn: () => api.getStats(),
    refetchInterval: 5000,
  })

  return {
    activeAgents: data?.activeAgents ?? 0,
    totalAgents: data?.totalAgents ?? 0,
    currentEpoch: data?.currentEpoch ?? 0,
    blockNumber: data?.blockNumber ?? 0,
    isLoading,
  }
}
