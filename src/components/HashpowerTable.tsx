import { useTranslation } from '../i18n'
import { formatAddress, formatDuration } from '../lib/formatters'
import type { AgentCapacity } from '../lib/types'

interface HashpowerTableProps {
  data: AgentCapacity[]
  loading?: boolean
}

export const HashpowerTable = ({ data, loading }: HashpowerTableProps) => {
  const { t } = useTranslation()

  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-elevated rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-label">{t('hashpower.noAgents')}</p>
      </div>
    )
  }

  const deviceColor = (device: string) => {
    if (device.toLowerCase().includes('cuda') || device.toLowerCase().includes('gpu'))
      return 'badge-success'
    if (device === 'cpu') return 'badge-warning'
    return 'badge-info'
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="px-6 py-4 border-b border-theme">
        <h3 className="text-lg font-semibold text-heading">{t('hashpower.agentDetails')}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-elevated border-b border-theme">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-label uppercase tracking-wider">
                {t('hashpower.agent')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-label uppercase tracking-wider">
                {t('hashpower.device')}
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-label uppercase tracking-wider">
                {t('hashpower.benchmark')}
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-label uppercase tracking-wider">
                {t('hashpower.actual')}
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-label uppercase tracking-wider">
                {t('hashpower.utilizationCol')}
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-label uppercase tracking-wider">
                {t('hashpower.uptime')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            {data.map((agent) => {
              const benchmark = agent.benchmarkTokPerSec || 0
              const actual = parseFloat(agent.throughputTokPerSec || '0')
              const utilization = benchmark > 0 ? ((actual / benchmark) * 100).toFixed(1) : '-'

              return (
                <tr key={agent.address} className="table-row">
                  <td className="px-6 py-4">
                    <p className="font-mono text-sm text-heading">{formatAddress(agent.address)}</p>
                    {(agent.ramMb > 0 || agent.vramMb > 0) && (
                      <p className="text-xs text-hint mt-1">
                        {agent.ramMb > 0 && `RAM ${(agent.ramMb / 1024).toFixed(1)}GB`}
                        {agent.ramMb > 0 && agent.vramMb > 0 && ' / '}
                        {agent.vramMb > 0 && `VRAM ${(agent.vramMb / 1024).toFixed(1)}GB`}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={deviceColor(agent.device)}>
                      {agent.device || 'unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-body font-mono">
                    {benchmark > 0 ? `${benchmark.toFixed(2)} tok/s` : '-'}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-body font-mono">
                    {actual > 0 ? `${actual.toFixed(2)} tok/s` : '-'}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-mono">
                    <span className={
                      utilization === '-' ? 'text-label' :
                      parseFloat(utilization) >= 80 ? 'text-green-400' :
                      parseFloat(utilization) >= 50 ? 'text-yellow-400' :
                      'text-red-400'
                    }>
                      {utilization === '-' ? '-' : `${utilization}%`}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-body">
                    {formatDuration(agent.uptimeSeconds)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default HashpowerTable
