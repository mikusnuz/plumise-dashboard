import { Cpu, Users, Activity, Gauge } from 'lucide-react'
import StatCard from '../components/StatCard'
import AgentCapacityChart from '../components/AgentCapacityChart'
import HashpowerTimeline from '../components/HashpowerTimeline'
import HashpowerTable from '../components/HashpowerTable'
import { useHashpower } from '../hooks/useHashpower'
import { useTranslation } from '../i18n'

export const Hashpower = () => {
  const { t } = useTranslation()
  const { capacities, throughput, summary, isLoading } = useHashpower()

  const throughputChartData = throughput
    ? throughput.filter((d) => d?.epoch != null).slice().reverse()
    : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-heading mb-2">{t('hashpower.title')}</h1>
        <p className="text-label">{t('hashpower.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('hashpower.networkCapacity')}
          value={`${summary.totalBenchmark.toFixed(1)} tok/s`}
          icon={Cpu}
          loading={isLoading}
        />
        <StatCard
          title={t('hashpower.activeAgents')}
          value={String(summary.activeAgents)}
          icon={Users}
          loading={isLoading}
        />
        <StatCard
          title={t('hashpower.networkThroughput')}
          value={`${summary.totalActual.toFixed(1)} tok/s`}
          icon={Activity}
          loading={isLoading}
        />
        <StatCard
          title={t('hashpower.utilization')}
          value={`${summary.utilization.toFixed(1)}%`}
          icon={Gauge}
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {capacities && capacities.length > 0 && (
          <AgentCapacityChart data={capacities} />
        )}
        {throughputChartData.length > 0 && (
          <HashpowerTimeline data={throughputChartData} />
        )}
      </div>

      <HashpowerTable data={capacities || []} loading={isLoading} />
    </div>
  )
}

export default Hashpower
