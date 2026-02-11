import { useEffect, useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { wsClient, contracts } from '../lib/contracts'

type EventType =
  | 'AgentRegistered'
  | 'AgentDeregistered'
  | 'Heartbeat'
  | 'RewardsDistributed'
  | 'RewardClaimed'
  | 'ChallengeCreated'
  | 'ChallengeSolved'

interface EventHandlers {
  onAgentEvent?: () => void
  onRewardEvent?: () => void
  onChallengeEvent?: () => void
}

export const useRealtimeEvents = (handlers?: EventHandlers) => {
  const queryClient = useQueryClient()
  const [lastEvent, setLastEvent] = useState<{
    type: EventType
    timestamp: number
    data?: unknown
  } | null>(null)

  const handleAgentEvent = useCallback(
    (type: EventType, data?: unknown) => {
      setLastEvent({ type, timestamp: Date.now(), data })
      queryClient.invalidateQueries({ queryKey: ['agents'] })
      queryClient.invalidateQueries({ queryKey: ['activeAgents'] })
      queryClient.invalidateQueries({ queryKey: ['networkStats'] })
      handlers?.onAgentEvent?.()
    },
    [queryClient, handlers]
  )

  const handleRewardEvent = useCallback(
    (type: EventType, data?: unknown) => {
      setLastEvent({ type, timestamp: Date.now(), data })
      queryClient.invalidateQueries({ queryKey: ['rewards'] })
      queryClient.invalidateQueries({ queryKey: ['epochs'] })
      queryClient.invalidateQueries({ queryKey: ['networkStats'] })
      handlers?.onRewardEvent?.()
    },
    [queryClient, handlers]
  )

  const handleChallengeEvent = useCallback(
    (type: EventType, data?: unknown) => {
      setLastEvent({ type, timestamp: Date.now(), data })
      queryClient.invalidateQueries({ queryKey: ['challenges'] })
      queryClient.invalidateQueries({ queryKey: ['currentChallenge'] })
      handlers?.onChallengeEvent?.()
    },
    [queryClient, handlers]
  )

  useEffect(() => {
    const unwatchers: Array<() => void> = []

    const setupWatchers = async () => {
      try {
        // AgentRegistry events
        const unwatchAgentRegistered = wsClient.watchContractEvent({
          address: contracts.agentRegistry.address,
          abi: contracts.agentRegistry.abi,
          eventName: 'AgentRegistered',
          onLogs: (logs) => {
            logs.forEach(() => {
              handleAgentEvent('AgentRegistered')
            })
          },
          onError: (error) => console.error('AgentRegistered watch error:', error),
        })

        const unwatchAgentDeregistered = wsClient.watchContractEvent({
          address: contracts.agentRegistry.address,
          abi: contracts.agentRegistry.abi,
          eventName: 'AgentDeregistered',
          onLogs: (logs) => {
            logs.forEach(() => {
              handleAgentEvent('AgentDeregistered')
            })
          },
          onError: (error) => console.error('AgentDeregistered watch error:', error),
        })

        const unwatchHeartbeat = wsClient.watchContractEvent({
          address: contracts.agentRegistry.address,
          abi: contracts.agentRegistry.abi,
          eventName: 'Heartbeat',
          onLogs: (logs) => {
            logs.forEach(() => {
              handleAgentEvent('Heartbeat')
            })
          },
          onError: (error) => console.error('Heartbeat watch error:', error),
        })

        // RewardPool events
        const unwatchRewardsDistributed = wsClient.watchContractEvent({
          address: contracts.rewardPool.address,
          abi: contracts.rewardPool.abi,
          eventName: 'RewardsDistributed',
          onLogs: (logs) => {
            logs.forEach(() => {
              handleRewardEvent('RewardsDistributed')
            })
          },
          onError: (error) => console.error('RewardsDistributed watch error:', error),
        })

        const unwatchRewardClaimed = wsClient.watchContractEvent({
          address: contracts.rewardPool.address,
          abi: contracts.rewardPool.abi,
          eventName: 'RewardClaimed',
          onLogs: (logs) => {
            logs.forEach(() => {
              handleRewardEvent('RewardClaimed')
            })
          },
          onError: (error) => console.error('RewardClaimed watch error:', error),
        })

        // ChallengeManager events
        const unwatchChallengeCreated = wsClient.watchContractEvent({
          address: contracts.challengeManager.address,
          abi: contracts.challengeManager.abi,
          eventName: 'ChallengeCreated',
          onLogs: (logs) => {
            logs.forEach(() => {
              handleChallengeEvent('ChallengeCreated')
            })
          },
          onError: (error) => console.error('ChallengeCreated watch error:', error),
        })

        const unwatchChallengeSolved = wsClient.watchContractEvent({
          address: contracts.challengeManager.address,
          abi: contracts.challengeManager.abi,
          eventName: 'ChallengeSolved',
          onLogs: (logs) => {
            logs.forEach(() => {
              handleChallengeEvent('ChallengeSolved')
            })
          },
          onError: (error) => console.error('ChallengeSolved watch error:', error),
        })

        unwatchers.push(
          unwatchAgentRegistered,
          unwatchAgentDeregistered,
          unwatchHeartbeat,
          unwatchRewardsDistributed,
          unwatchRewardClaimed,
          unwatchChallengeCreated,
          unwatchChallengeSolved
        )
      } catch (error) {
        console.error('Failed to setup event watchers:', error)
      }
    }

    setupWatchers()

    return () => {
      unwatchers.forEach((unwatch) => unwatch())
    }
  }, [handleAgentEvent, handleRewardEvent, handleChallengeEvent])

  return {
    lastEvent,
  }
}
