import { formatUnits } from 'viem'

export const formatAddress = (address: string, chars = 4): string => {
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`
}

export const formatPLM = (value: bigint | string, decimals = 4): string => {
  const bigintValue = typeof value === 'string' ? BigInt(value) : value
  const formatted = formatUnits(bigintValue, 18)
  const num = parseFloat(formatted)

  if (num === 0) return '0'
  if (num < 0.0001) return '< 0.0001'

  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })
}

export const formatNumber = (value: number, decimals = 0): string => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })
}

export const formatPercent = (value: number, decimals = 2): string => {
  return `${value.toFixed(decimals)}%`
}

export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000)
  const now = Date.now()
  const diff = now - date.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return `${seconds}s ago`
}

export const formatDuration = (seconds: number): string => {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes}m ${secs}s`
  return `${secs}s`
}
