import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

export const useRewardHistory = (address?: string, limit = 50) => {
  return useQuery({
    queryKey: ['rewardHistory', address, limit],
    queryFn: () => api.getRewardHistory(address!, limit),
    enabled: !!address,
    staleTime: 30000,
    gcTime: 60000,
    retry: 2,
  })
}
