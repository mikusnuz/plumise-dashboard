import { useQuery } from '@tanstack/react-query'
import { publicClient, contracts } from '../lib/contracts'

export interface Challenge {
  id: bigint
  difficulty: bigint
  seed: string
  createdAt: bigint
  expiresAt: bigint
  solved: boolean
  solver: `0x${string}`
  rewardBonus: bigint
}

export const useCurrentChallenge = () => {
  return useQuery({
    queryKey: ['currentChallenge'],
    queryFn: async () => {
      const challenge = await publicClient.readContract({
        ...contracts.challengeManager,
        functionName: 'getCurrentChallenge',
      }) as Challenge

      return challenge
    },
    refetchInterval: 5000,
  })
}

export const useChallengeHistory = (offset = 0, limit = 10) => {
  return useQuery({
    queryKey: ['challengeHistory', offset, limit],
    queryFn: async () => {
      const challenges = await publicClient.readContract({
        ...contracts.challengeManager,
        functionName: 'getChallengeHistory',
        args: [BigInt(offset), BigInt(limit)],
      }) as Challenge[]

      return challenges
    },
  })
}

export const useChallengeDifficulty = () => {
  return useQuery({
    queryKey: ['challengeDifficulty'],
    queryFn: async () => {
      const difficulty = await publicClient.readContract({
        ...contracts.challengeManager,
        functionName: 'currentDifficulty',
      }) as bigint

      return Number(difficulty)
    },
    refetchInterval: 10000,
  })
}

export const useTotalChallenges = () => {
  return useQuery({
    queryKey: ['totalChallenges'],
    queryFn: async () => {
      const total = await publicClient.readContract({
        ...contracts.challengeManager,
        functionName: 'getTotalChallenges',
      }) as bigint

      return Number(total)
    },
    refetchInterval: 10000,
  })
}
