import { useEffect, useState, useRef } from 'react'
import { wsClient } from '../lib/contracts'
import type { Block } from 'viem'

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting'

export const useRealtimeBlocks = (maxBlocks = 5) => {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting')
  const [latestBlock, setLatestBlock] = useState<Block | null>(null)
  const [lastBlockTime, setLastBlockTime] = useState<Date | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const reconnectAttemptsRef = useRef(0)

  useEffect(() => {
    let unwatch: (() => void) | undefined
    let healthCheckInterval: NodeJS.Timeout | undefined

    const setupWatcher = async () => {
      try {
        setConnectionStatus(reconnectAttemptsRef.current > 0 ? 'reconnecting' : 'connecting')

        unwatch = wsClient.watchBlocks({
          onBlock: (block) => {
            if (!block || block.number == null) return
            setConnectionStatus('connected')
            setLatestBlock(block)
            setLastBlockTime(new Date())
            reconnectAttemptsRef.current = 0
            setBlocks((prev) => {
              const newBlocks = [block, ...prev]
              return newBlocks.slice(0, maxBlocks)
            })
          },
          onError: (error) => {
            console.error('Block watch error:', error)
            setConnectionStatus('disconnected')
            scheduleReconnect()
          },
        })

        setConnectionStatus('connected')

        healthCheckInterval = setInterval(() => {
          if (lastBlockTime) {
            const timeSinceLastBlock = Date.now() - lastBlockTime.getTime()
            if (timeSinceLastBlock > 60000) {
              console.warn('No blocks received for 60s, reconnecting...')
              setConnectionStatus('reconnecting')
              if (unwatch) unwatch()
              scheduleReconnect()
            }
          }
        }, 30000)
      } catch (error) {
        console.error('Failed to setup block watcher:', error)
        setConnectionStatus('disconnected')
        scheduleReconnect()
      }
    }

    const scheduleReconnect = () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current)
      const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000)
      reconnectAttemptsRef.current++
      reconnectTimeoutRef.current = setTimeout(() => {
        setupWatcher()
      }, delay)
    }

    setupWatcher()

    return () => {
      if (unwatch) unwatch()
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current)
      if (healthCheckInterval) clearInterval(healthCheckInterval)
    }
  }, [maxBlocks])

  return {
    blocks,
    latestBlock,
    connectionStatus,
    isConnected: connectionStatus === 'connected',
    lastBlockTime,
  }
}
