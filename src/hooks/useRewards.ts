import { useQuery } from '@tanstack/react-query'
import { publicClient, contracts } from '../lib/contracts'

export interface Contribution {
  taskCount: bigint
  uptimeSeconds: bigint
  responseScore: bigint
  lastUpdated: bigint
}

export const useRewards = (address?: `0x${string}`) => {
  return useQuery({
    queryKey: ['rewards', address],
    queryFn: async () => {
      if (!address) return null

      const pendingReward = await publicClient.readContract({
        ...contracts.rewardPool,
        functionName: 'getPendingReward',
        args: [address],
      }) as bigint

      const contribution = await publicClient.readContract({
        ...contracts.rewardPool,
        functionName: 'getContribution',
        args: [address],
      }) as Contribution

      return {
        pending: pendingReward,
        contribution,
      }
    },
    enabled: !!address,
    refetchInterval: 10000,
  })
}

export const useCurrentEpoch = () => {
  return useQuery({
    queryKey: ['currentEpoch'],
    queryFn: async () => {
      const epoch = await publicClient.readContract({
        ...contracts.rewardPool,
        functionName: 'getCurrentEpoch',
      }) as bigint

      return Number(epoch)
    },
    refetchInterval: 10000,
  })
}

export const useEpochRewards = (epoch: number) => {
  return useQuery({
    queryKey: ['epochRewards', epoch],
    queryFn: async () => {
      const [reward, agents, distributed] = await Promise.all([
        publicClient.readContract({
          ...contracts.rewardPool,
          functionName: 'epochRewards',
          args: [BigInt(epoch)],
        }) as Promise<bigint>,
        publicClient.readContract({
          ...contracts.rewardPool,
          functionName: 'getEpochAgents',
          args: [BigInt(epoch)],
        }) as Promise<`0x${string}`[]>,
        publicClient.readContract({
          ...contracts.rewardPool,
          functionName: 'epochDistributed',
          args: [BigInt(epoch)],
        }) as Promise<boolean>,
      ])

      return {
        reward,
        agents,
        distributed,
        epoch,
      }
    },
    enabled: epoch > 0,
  })
}

export const useRewardFormula = () => {
  return useQuery({
    queryKey: ['rewardFormula'],
    queryFn: async () => {
      const [taskWeight, uptimeWeight, responseWeight] = await Promise.all([
        publicClient.readContract({
          ...contracts.rewardPool,
          functionName: 'taskWeight',
        }) as Promise<bigint>,
        publicClient.readContract({
          ...contracts.rewardPool,
          functionName: 'uptimeWeight',
        }) as Promise<bigint>,
        publicClient.readContract({
          ...contracts.rewardPool,
          functionName: 'responseWeight',
        }) as Promise<bigint>,
      ])

      return {
        task: Number(taskWeight),
        uptime: Number(uptimeWeight),
        response: Number(responseWeight),
      }
    },
  })
}
