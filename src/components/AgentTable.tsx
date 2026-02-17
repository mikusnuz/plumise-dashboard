import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { formatAddress, formatTime } from '../lib/formatters'
import { useTranslation } from '../i18n'
import type { Agent } from '../hooks/useAgents'

interface AgentTableProps {
  agents: Agent[]
  loading?: boolean
}

const HEARTBEAT_TIMEOUT_S = 10 * 60 // 10 minutes

function getEffectiveStatus(agent: Agent): number {
  if (agent.status === 2) return 2 // slashed
  const now = Math.floor(Date.now() / 1000)
  const elapsed = now - Number(agent.lastHeartbeat)
  if (elapsed > HEARTBEAT_TIMEOUT_S) return 0 // inactive by timeout
  return agent.status
}

export const AgentTable = ({ agents, loading }: AgentTableProps) => {
  const { t } = useTranslation()
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null)

  const statusLabels = [t('agents.statusInactive'), t('agents.statusActive'), t('agents.statusSlashed')]
  const statusColors = ['badge-warning', 'badge-success', 'badge-danger']

  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-elevated rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (agents.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-label">{t('agents.noAgents')}</p>
      </div>
    )
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-elevated border-b border-theme">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-label uppercase tracking-wider">
                {t('agents.agent')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-label uppercase tracking-wider">
                {t('agents.status')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-label uppercase tracking-wider">
                {t('agents.lastHeartbeat')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-label uppercase tracking-wider">
                {t('agents.registered')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-label uppercase tracking-wider">
                {t('agents.details')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
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
                    <p className="font-mono text-sm text-heading">
                      {formatAddress(agent.wallet)}
                    </p>
                    <p className="text-xs text-hint mt-1">
                      {t('agents.node')}: {formatAddress(agent.nodeId)}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={statusColors[getEffectiveStatus(agent)]}>
                    {statusLabels[getEffectiveStatus(agent)]}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-body">
                  {formatTime(Number(agent.lastHeartbeat))}
                </td>
                <td className="px-6 py-4 text-sm text-body">
                  {formatTime(Number(agent.registeredAt))}
                </td>
                <td className="px-6 py-4">
                  <ChevronDown
                    size={20}
                    className={`text-label transition-transform ${
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
            className="border-t border-theme overflow-hidden"
          >
            {agents
              .filter((a) => a.wallet === expandedAgent)
              .map((agent) => (
                <div key={agent.wallet} className="p-6 bg-elevated">
                  <h4 className="text-sm font-medium text-body mb-3">
                    {t('agents.agentDetails')}
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-hint mb-1">{t('agents.walletAddress')}</p>
                      <p className="font-mono text-body">{agent.wallet}</p>
                    </div>
                    <div>
                      <p className="text-hint mb-1">{t('agents.nodeId')}</p>
                      <p className="font-mono text-body">{agent.nodeId}</p>
                    </div>
                    <div>
                      <p className="text-hint mb-1">{t('agents.metadata')}</p>
                      <p className="text-body">
                        {agent.metadata || t('agents.noMetadata')}
                      </p>
                    </div>
                    <div>
                      <p className="text-hint mb-1">{t('agents.stake')}</p>
                      <p className="text-body">
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
