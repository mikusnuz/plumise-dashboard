import { useState } from 'react'
import { motion } from 'motion/react'
import { Network, Cpu, Zap, Activity, ArrowRight } from 'lucide-react'
import StatCard from '../components/StatCard'
import { usePipelineTopology } from '../hooks/usePipeline'
import { usePipelineStatus } from '../hooks/usePipelineStatus'
import { formatAddress } from '../lib/formatters'
import { useTranslation } from '../i18n'

export const Pipeline = () => {
  const { t } = useTranslation()
  const [selectedModel] = useState('openai/gpt-oss-20b')
  const { data: topology, isLoading } = usePipelineTopology(selectedModel)
  const { isConnected } = usePipelineStatus()

  const onlineNodes = topology?.nodes.filter(n => n.ready).length ?? 0
  const totalNodes = topology?.nodes.length ?? 0

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-heading">{t('pipeline.title')}</h1>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}
            />
            <span className="text-xs text-label">
              {isConnected ? t('pipeline.realtimeConnected') : t('pipeline.realtimeDisconnected')}
            </span>
          </div>
        </div>
        <p className="text-label">
          {t('pipeline.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title={t('pipeline.model')}
          value={topology?.model.split('/')[1] ?? '...'}
          icon={Network}
        />
        <StatCard
          title={t('pipeline.totalLayers')}
          value={topology?.totalLayers ?? 0}
          icon={Zap}
        />
        <StatCard
          title={t('pipeline.onlineNodes')}
          value={onlineNodes}
          icon={Activity}
          change={`${totalNodes} ${t('pipeline.total')}`}
        />
        <StatCard
          title={t('pipeline.coverage')}
          value={totalNodes > 0 ? `${((onlineNodes / totalNodes) * 100).toFixed(0)}%` : '0%'}
          icon={Cpu}
        />
      </div>

      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-heading mb-4">{t('pipeline.topologyTitle')}</h2>
        <p className="text-label mb-6">{t('pipeline.topologyDesc')}</p>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-elevated rounded animate-pulse" />
            ))}
          </div>
        ) : topology && topology.nodes.length > 0 ? (
          <div className="space-y-4">
            {topology.nodes
              .sort((a, b) => a.pipelineOrder - b.pipelineOrder)
              .map((node, idx) => (
                <motion.div
                  key={node.address}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative"
                >
                  <div
                    className={`p-6 rounded-lg border transition-all ${
                      node.ready
                        ? 'bg-elevated border-green-500/30 hover:border-green-500/50'
                        : 'bg-elevated/50 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-lg ${
                            node.ready
                              ? 'bg-green-500/20 border border-green-500/30'
                              : 'bg-red-500/20 border border-red-500/30'
                          }`}
                        >
                          <Cpu
                            size={24}
                            className={node.ready ? 'text-green-400' : 'text-red-400'}
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-mono text-sm text-heading">
                              {formatAddress(node.address, 8)}
                            </p>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-medium ${
                                node.ready
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
                              }`}
                            >
                              {node.ready ? t('pipeline.online') : t('pipeline.offline')}
                            </span>
                          </div>
                          <p className="text-sm text-label">
                            {t('pipeline.layerRange', {
                              start: node.layerStart,
                              end: node.layerEnd,
                              total: topology.totalLayers,
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-hint mb-1">{t('pipeline.order')}</p>
                        <p className="text-2xl font-bold text-heading">#{node.pipelineOrder}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-theme">
                      <p className="text-xs text-hint mb-1">{t('pipeline.status')}</p>
                      <p className="text-xs font-mono text-body">{node.ready ? 'Online' : 'Offline'}</p>
                    </div>
                  </div>

                  {idx < topology.nodes.length - 1 && (
                    <div className="flex justify-center py-2">
                      <ArrowRight size={20} className="text-label" />
                    </div>
                  )}
                </motion.div>
              ))}
          </div>
        ) : (
          <div className="text-center py-12 text-label">
            {t('pipeline.noNodes')}
          </div>
        )}
      </div>
    </div>
  )
}

export default Pipeline
