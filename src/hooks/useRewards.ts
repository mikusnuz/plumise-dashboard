import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { Contribution, Rewards, RewardFormula, Epoch } from '../lib/types'

export type { Contribution, Rewards, RewardFormula, Epoch }

export const useRewards = (address?: string) => {
  return useQuery({
    queryKey: ['rewards', address],
    queryFn: () => api.getRewards(address!),
    enabled: !!address,
    refetchInterval: 30000,
  })
}

export const useEpochs = () => {
  return useQuery({
    queryKey: ['epochs'],
    queryFn: () => api.getEpochs(),
    refetchInterval: 30000,
  })
}

export const useEpoch = (epoch?: number) => {
  return useQuery({
    queryKey: ['epoch', epoch],
    queryFn: () => api.getEpoch(epoch!),
    enabled: !!epoch && epoch > 0,
    refetchInterval: 30000,
  })
}

export const useRewardFormula = () => {
  return useQuery({
    queryKey: ['rewardFormula'],
    queryFn: () => api.getFormula(),
  })
}
