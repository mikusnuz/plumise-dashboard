import { useState } from 'react'
import { Users, Activity } from 'lucide-react'
import StatCard from '../components/StatCard'
import AgentTable from '../components/AgentTable'
import { useAgents, useActiveAgents } from '../hooks/useAgents'
import { useNetworkStats } from '../hooks/useNetworkStats'
import { formatNumber } from '../lib/formatters'

export const Agents = () => {
  const [showActiveOnly, setShowActiveOnly] = useState(false)
  const { data: allAgents, isLoading: allLoading } = useAgents()
  const { data: activeAgents, isLoading: activeLoading } = useActiveAgents()
  const { totalAgents, activeAgents: activeCount } = useNetworkStats()

  const agents = showActiveOnly ? activeAgents : allAgents
  const isLoading = showActiveOnly ? activeLoading : allLoading

  const activePercentage =
    totalAgents > 0
      ? ((activeCount / totalAgents) * 100).toFixed(1)
      : '0'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">AI Agents</h1>
        <p className="text-slate-400">
          Monitor active agents and their status on the network
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Agents"
          value={formatNumber(totalAgents)}
          icon={Users}
        />
        <StatCard
          title="Active Agents"
          value={formatNumber(activeCount)}
          icon={Activity}
          change={`${activePercentage}% active`}
        />
        <StatCard
          title="Inactive Agents"
          value={formatNumber(totalAgents - activeCount)}
          icon={Users}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setShowActiveOnly(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              !showActiveOnly
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-400'
                : 'bg-slate-700/30 text-slate-400 hover:text-cyan-400'
            }`}
          >
            All Agents
          </button>
          <button
            onClick={() => setShowActiveOnly(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              showActiveOnly
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-400'
                : 'bg-slate-700/30 text-slate-400 hover:text-cyan-400'
            }`}
          >
            Active Only
          </button>
        </div>
      </div>

      <AgentTable agents={agents ?? []} loading={isLoading} />
    </div>
  )
}

export default Agents
