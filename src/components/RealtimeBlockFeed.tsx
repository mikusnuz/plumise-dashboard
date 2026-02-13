import { useRealtimeBlocks } from '../hooks/useRealtimeBlocks'
import { formatDistance } from '../lib/utils'

export const RealtimeBlockFeed = () => {
  const { blocks, connectionStatus, lastBlockTime } = useRealtimeBlocks(5)

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-500'
      case 'connecting':
      case 'reconnecting':
        return 'bg-amber-500 animate-pulse'
      case 'disconnected':
        return 'bg-red-500'
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Live'
      case 'connecting':
        return 'Connecting...'
      case 'reconnecting':
        return 'Reconnecting...'
      case 'disconnected':
        return 'Disconnected'
    }
  }

  return (
    <div className="rounded-lg border border-surface-200 bg-surface-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">Recent Blocks</h3>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${getStatusColor()}`} />
          <span className="text-xs text-text-secondary">
            {getStatusText()}
          </span>
        </div>
      </div>

      {connectionStatus === 'disconnected' && blocks.length === 0 && (
        <div className="mb-3 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
          Failed to connect to WebSocket. Retrying...
        </div>
      )}

      {lastBlockTime && connectionStatus === 'connected' && (
        <div className="mb-3 text-xs text-text-tertiary">
          Last update: {formatDistance(lastBlockTime.getTime())}
        </div>
      )}

      <div className="space-y-2">
        {blocks.length === 0 ? (
          <div className="py-4 text-center text-sm text-text-tertiary">
            Waiting for blocks...
          </div>
        ) : (
          blocks.filter((b) => b?.number != null).map((block) => (
            <div
              key={block.number!.toString()}
              className="flex items-center justify-between rounded-md bg-surface-0 px-3 py-2 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono font-semibold text-text-primary">
                  #{block.number!.toString()}
                </span>
                <span className="text-text-tertiary">
                  {block.transactions?.length ?? 0} txs
                </span>
              </div>
              <span className="text-text-secondary">
                {formatDistance(Number(block.timestamp) * 1000)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
