import { useQuery } from '@tanstack/react-query'
import { publicClient } from '../lib/contracts'
import { useAgentCount } from './useAgents'
import { useCurrentEpoch } from './useRewards'

export const useNetworkStats = () => {
  const { data: agentCount } = useAgentCount()
  const { data: currentEpoch } = useCurrentEpoch()

  const blockNumber = useQuery({
    queryKey: ['blockNumber'],
    queryFn: async () => {
      const block = await publicClient.getBlockNumber()
      return Number(block)
    },
    refetchInterval: 5000,
  })

  return {
    activeAgents: agentCount?.active ?? 0,
    totalAgents: agentCount?.total ?? 0,
    currentEpoch: currentEpoch ?? 0,
    blockNumber: blockNumber.data ?? 0,
    isLoading: blockNumber.isLoading,
  }
}
