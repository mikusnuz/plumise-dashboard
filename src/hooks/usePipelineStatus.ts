import { useEffect, useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { io, Socket } from 'socket.io-client'

interface PipelineNode {
  nodeAddress: string
  modelName: string
  grpcEndpoint: string
  httpEndpoint: string
  ramMb: number
  device: string
  vramMb: number
  totalLayers: number
  layerStart: number
  layerEnd: number
  ready: boolean
  pipelineOrder: number
  createdAt: Date
  updatedAt: Date
}

interface TopologyEvent {
  model: string
  nodes: PipelineNode[]
  count: number
  timestamp: number
}

interface NodeStatusEvent {
  address: string
  model: string
  ready: boolean
  timestamp: number
}

interface NodeJoinedEvent {
  address: string
  model: string
  timestamp: number
}

interface NodeLeftEvent {
  address: string
  model: string
  timestamp: number
}

export const usePipelineStatus = () => {
  const queryClient = useQueryClient()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastEvent, setLastEvent] = useState<{
    type: 'topology' | 'nodeStatus' | 'nodeJoined' | 'nodeLeft'
    timestamp: number
    data?: unknown
  } | null>(null)

  const handleTopologyChange = useCallback(
    (event: TopologyEvent) => {
      setLastEvent({ type: 'topology', timestamp: event.timestamp, data: event })
      queryClient.invalidateQueries({ queryKey: ['pipelineTopology'] })
    },
    [queryClient]
  )

  const handleNodeStatusChange = useCallback(
    (event: NodeStatusEvent) => {
      setLastEvent({ type: 'nodeStatus', timestamp: event.timestamp, data: event })
      queryClient.invalidateQueries({ queryKey: ['pipelineTopology'] })
    },
    [queryClient]
  )

  const handleNodeJoined = useCallback(
    (event: NodeJoinedEvent) => {
      setLastEvent({ type: 'nodeJoined', timestamp: event.timestamp, data: event })
      queryClient.invalidateQueries({ queryKey: ['pipelineTopology'] })
    },
    [queryClient]
  )

  const handleNodeLeft = useCallback(
    (event: NodeLeftEvent) => {
      setLastEvent({ type: 'nodeLeft', timestamp: event.timestamp, data: event })
      queryClient.invalidateQueries({ queryKey: ['pipelineTopology'] })
    },
    [queryClient]
  )

  useEffect(() => {
    const oracleWsUrl = import.meta.env.VITE_ORACLE_WS_URL || 'https://dashboard.plumise.com'

    const newSocket = io(`${oracleWsUrl}/pipeline`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
    })

    newSocket.on('connect', () => {
      console.log('Pipeline WebSocket connected')
      setIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('Pipeline WebSocket disconnected')
      setIsConnected(false)
    })

    newSocket.on('pipeline:topology', handleTopologyChange)
    newSocket.on('pipeline:nodeStatus', handleNodeStatusChange)
    newSocket.on('pipeline:nodeJoined', handleNodeJoined)
    newSocket.on('pipeline:nodeLeft', handleNodeLeft)

    newSocket.on('connect_error', (error) => {
      console.error('Pipeline WebSocket connection error:', error)
    })

    setSocket(newSocket)

    return () => {
      newSocket.off('connect')
      newSocket.off('disconnect')
      newSocket.off('pipeline:topology')
      newSocket.off('pipeline:nodeStatus')
      newSocket.off('pipeline:nodeJoined')
      newSocket.off('pipeline:nodeLeft')
      newSocket.off('connect_error')
      newSocket.close()
    }
  }, [handleTopologyChange, handleNodeStatusChange, handleNodeJoined, handleNodeLeft])

  return {
    socket,
    isConnected,
    lastEvent,
  }
}
