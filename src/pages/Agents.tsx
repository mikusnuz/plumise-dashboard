import { useState } from 'react'
import { Users, Activity } from 'lucide-react'
import StatCard from '../components/StatCard'
import AgentTable from '../components/AgentTable'
import { useAgents, useActiveAgents } from '../hooks/useAgents'
import { useNetworkStats } from '../hooks/useNetworkStats'
import { formatNumber } from '../lib/formatters'
import { useTranslation } from '../i18n'

export const Agents = () => {
  const { t } = useTranslation()
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
