import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { formatAddress, formatTime } from '../lib/formatters'
import type { Agent } from '../hooks/useAgents'

interface AgentTableProps {
  agents: Agent[]
  loading?: boolean
}

const statusLabels = ['Inactive', 'Active', 'Slashed']
const statusColors = ['badge-warning', 'badge-success', 'badge-danger']

export const AgentTable = ({ agents, loading }: AgentTableProps) => {
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-700/30 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (agents.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-slate-400">No agents found</p>
      </div>
    )
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800/50 border-b border-slate-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Agent
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Last Heartbeat
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Registered
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {agents.map((agent) => (
              <motion.tr
                key={agent.wallet}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="table-row cursor-pointer"
                onClick={() =>
                  setExpandedAgent(
                    expandedAgent === agent.wallet ? null : agent.wallet
                  )
                }
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-mono text-sm text-white">
                      {formatAddress(agent.wallet)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Node: {formatAddress(agent.nodeId)}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={statusColors[agent.status]}>
                    {statusLabels[agent.status]}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">
                  {formatTime(new Date(agent.lastHeartbeat).getTime() / 1000)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">
                  {formatTime(new Date(agent.registeredAt).getTime() / 1000)}
                </td>
                <td className="px-6 py-4">
                  <ChevronDown
                    size={20}
                    className={`text-slate-400 transition-transform ${
                      expandedAgent === agent.wallet ? 'rotate-180' : ''
                    }`}
                  />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {expandedAgent && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-700 overflow-hidden"
          >
            {agents
              .filter((a) => a.wallet === expandedAgent)
              .map((agent) => (
                <div key={agent.wallet} className="p-6 bg-slate-800/30">
                  <h4 className="text-sm font-medium text-slate-300 mb-3">
                    Agent Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500 mb-1">Wallet Address</p>
                      <p className="font-mono text-slate-300">{agent.wallet}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Node ID</p>
                      <p className="font-mono text-slate-300">{agent.nodeId}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Metadata</p>
                      <p className="text-slate-300">
                        {agent.metadata || 'No metadata'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Stake</p>
                      <p className="text-slate-300">
                        {agent.stake} PLM
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AgentTable
