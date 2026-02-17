import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

export const useTokenomics = () => {
  return useQuery({
    queryKey: ['tokenomics'],
    queryFn: () => api.getTokenomics(),
    staleTime: 120000,
    gcTime: 300000,
    retry: 2,
  })
}
