import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

export const useLeaderboard = (limit = 50) => {
  return useQuery({
    queryKey: ['leaderboard', limit],
    queryFn: () => api.getLeaderboard(limit),
    staleTime: 60000,
    gcTime: 120000,
    retry: 2,
  })
}
