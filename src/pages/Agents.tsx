import { useState, useMemo } from 'react'
import { Users, Activity } from 'lucide-react'
import StatCard from '../components/StatCard'
import AgentTable from '../components/AgentTable'
import { useAgents } from '../hooks/useAgents'
import { formatNumber } from '../lib/formatters'
import { useTranslation } from '../i18n'

const HEARTBEAT_TIMEOUT_S = 10 * 60

function isAgentActive(agent: { status: number; lastHeartbeat: string | number }): boolean {
  if (agent.status !== 1) return false
  const now = Math.floor(Date.now() / 1000)
  return now - Number(agent.lastHeartbeat) <= HEARTBEAT_TIMEOUT_S
}

export const Agents = () => {
  const { t } = useTranslation()
  const [showActiveOnly, setShowActiveOnly] = useState(false)
  const { data: allAgents, isLoading } = useAgents()

  const activeCount = useMemo(
    () => (allAgents ?? []).filter(isAgentActive).length,
    [allAgents],
  )
  const totalAgents = allAgents?.length ?? 0

  const agents = useMemo(
    () => showActiveOnly ? (allAgents ?? []).filter(isAgentActive) : allAgents,
    [allAgents, showActiveOnly],
  )

  const activePercentage =
    totalAgents > 0
      ? ((activeCount / totalAgents) * 100).toFixed(1)
      : '0'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-heading mb-2">{t('agents.title')}</h1>
        <p className="text-label">
          {t('agents.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title={t('agents.totalAgents')}
          value={formatNumber(totalAgents)}
          icon={Users}
        />
        <StatCard
          title={t('agents.activeAgents')}
          value={formatNumber(activeCount)}
          icon={Activity}
          change={t('agents.activePercent', { percent: activePercentage })}
        />
        <StatCard
          title={t('agents.inactiveAgents')}
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
                ? 'tab-active'
                : 'tab-inactive'
            }`}
          >
            {t('agents.allAgents')}
          </button>
          <button
            onClick={() => setShowActiveOnly(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              showActiveOnly
                ? 'tab-active'
                : 'tab-inactive'
            }`}
          >
            {t('agents.activeOnly')}
          </button>
        </div>
      </div>

      <AgentTable agents={agents ?? []} loading={isLoading} />
    </div>
  )
}

export default Agents
