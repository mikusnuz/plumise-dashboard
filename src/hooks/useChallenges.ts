import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { Challenge } from '../lib/types'

export type { Challenge }

export const useCurrentChallenge = () => {
  return useQuery({
    queryKey: ['currentChallenge'],
    queryFn: () => api.getCurrentChallenge(),
    refetchInterval: 5000,
  })
}

export const useChallenges = () => {
  return useQuery({
    queryKey: ['challenges'],
    queryFn: () => api.getChallenges(),
    refetchInterval: 10000,
  })
}
