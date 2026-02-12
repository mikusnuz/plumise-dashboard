import { useEffect, useState } from 'react'
import { wsClient } from '../lib/contracts'
import type { Block } from 'viem'

export const useRealtimeBlocks = (maxBlocks = 5) => {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [latestBlock, setLatestBlock] = useState<Block | null>(null)

  useEffect(() => {
    let unwatch: (() => void) | undefined

    const setupWatcher = async () => {
      try {
        setIsConnected(true)

        unwatch = wsClient.watchBlocks({
          onBlock: (block) => {
            if (!block || block.number == null) return
            setLatestBlock(block)
            setBlocks((prev) => {
              const newBlocks = [block, ...prev]
              return newBlocks.slice(0, maxBlocks)
            })
          },
          onError: (error) => {
            console.error('Block watch error:', error)
            setIsConnected(false)
          },
        })
      } catch (error) {
        console.error('Failed to setup block watcher:', error)
        setIsConnected(false)
      }
    }

    setupWatcher()

    return () => {
      if (unwatch) {
        unwatch()
      }
    }
  }, [maxBlocks])

  return {
    blocks,
    latestBlock,
    isConnected,
  }
}
