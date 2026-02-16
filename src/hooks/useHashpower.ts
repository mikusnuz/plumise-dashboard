import { useMemo } from 'react'
import { useAgentCapacities, useThroughput } from './useThroughput'

export const useHashpower = () => {
  const { data: capacities, isLoading: capLoading } = useAgentCapacities()
  const { data: throughput, isLoading: thruLoading } = useThroughput()

  const summary = useMemo(() => {
    if (!capacities) return { totalBenchmark: 0, totalActual: 0, utilization: 0, activeAgents: 0 }

    const totalBenchmark = capacities.reduce((sum, c) => sum + (c.benchmarkTokPerSec || 0), 0)
    const totalActual = capacities.reduce((sum, c) => sum + parseFloat(c.throughputTokPerSec || '0'), 0)
    const utilization = totalBenchmark > 0 ? (totalActual / totalBenchmark) * 100 : 0

    return {
      totalBenchmark,
      totalActual,
      utilization,
      activeAgents: capacities.length,
    }
  }, [capacities])

  return {
    capacities,
    throughput,
    summary,
    isLoading: capLoading || thruLoading,
  }
}
