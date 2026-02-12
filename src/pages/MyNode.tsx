import { useState, useEffect, useRef } from 'react'
import { Wallet, Award, Activity, TrendingUp, Layers, CheckCircle, XCircle } from 'lucide-react'
import { motion } from 'motion/react'
import StatCard from '../components/StatCard'
import NodeInstallSection from '../components/NodeInstallSection'
import { useRewards } from '../hooks/useRewards'
import { usePipelineTopology } from '../hooks/usePipeline'
import { formatAddress, formatPLM, formatNumber } from '../lib/formatters'
import { useTranslation } from '../i18n'

/**
 * Detect PlumWallet provider with priority:
 * 1. window.plumise.ethereum (branded namespace, always PlumWallet)
 * 2. window.ethereum.providers[] with isPlumWallet flag
 * 3. window.ethereum.isPlumWallet direct check
 * 4. window.ethereum fallback
 */
function getProvider(): any {
  const plumise = (window as any).plumise?.ethereum
  if (plumise) return plumise

  const providers = (window as any).ethereum?.providers
  if (Array.isArray(providers)) {
    const plumProvider = providers.find((p: any) => p.isPlumWallet === true)
    if (plumProvider) return plumProvider
  }

  if ((window as any).ethereum?.isPlumWallet) return (window as any).ethereum

  return (window as any).ethereum ?? null
}

export const MyNode = () => {
  const { t } = useTranslation()
  const [walletAddress, setWalletAddress] = useState<`0x${string}` | undefined>()
  const { data: rewardData } = useRewards(walletAddress)
  const { data: topology } = usePipelineTopology()
  const eip6963Provider = useRef<any>(null)

  const myNode = topology?.nodes.find(
    (node) => node.address.toLowerCase() === walletAddress?.toLowerCase()
  )

  // Listen for EIP-6963 wallet announcements (PlumWallet)
  useEffect(() => {
    const handler = (event: any) => {
      const detail = event.detail
      if (detail?.info?.rdns === 'com.plumbug.plumwallet' || detail?.provider?.isPlumWallet) {
        eip6963Provider.current = detail.provider
      }
    }
    window.addEventListener('eip6963:announceProvider', handler)
    window.dispatchEvent(new Event('eip6963:requestProvider'))
    return () => window.removeEventListener('eip6963:announceProvider', handler)
  }, [])

  const handleConnect = async () => {
    const ethereum = eip6963Provider.current ?? getProvider()
    if (!ethereum) {
      alert(t('myNode.installWallet'))
      return
    }

    try {
      const accounts = (await ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[]

      const addr = accounts[0]
      if (addr && /^0x[0-9a-fA-F]{40}$/.test(addr)) {
        setWalletAddress(addr as `0x${string}`)
      } else {
        alert(t('myNode.invalidAddress'))
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  const handleDisconnect = () => {
    setWalletAddress(undefined)
  }

  if (!walletAddress) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-heading mb-2">{t('myNode.title')}</h1>
          <p className="text-label">
            {t('myNode.connectSubtitle')}
          </p>
        </div>

        <div className="glass-card p-12 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <div className="p-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 w-24 h-24 flex items-center justify-center mx-auto">
              <Wallet size={48} className="text-cyan-400" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-heading mb-2">
                {t('myNode.connectWallet')}
              </h2>
              <p className="text-label">
                {t('myNode.connectDesc')}
              </p>
            </div>

            <button onClick={handleConnect} className="btn-primary w-full py-3">
              {t('myNode.connectBtn')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-heading mb-2">{t('myNode.title')}</h1>
          <p className="text-label">{t('myNode.connectedSubtitle')}</p>
        </div>
        <button onClick={handleDisconnect} className="btn-secondary">
          {t('myNode.disconnect')}
        </button>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
            <Wallet size={32} className="text-cyan-400" />
          </div>
          <div>
            <p className="text-sm text-label mb-1">{t('myNode.connectedWallet')}</p>
            <p className="text-xl font-mono text-heading">{formatAddress(walletAddress, 8)}</p>
          </div>
        </div>
      </div>

      <NodeInstallSection walletAddress={walletAddress} />

      {myNode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-heading mb-1">
                {t('myNode.pipelineStatus')}
              </h3>
              <p className="text-sm text-label">
                {t('myNode.pipelineDesc')}
              </p>
            </div>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                myNode.ready
                  ? 'bg-green-500/20 border border-green-500/30'
                  : 'bg-red-500/20 border border-red-500/30'
              }`}
            >
              {myNode.ready ? (
                <CheckCircle size={16} className="text-green-400" />
              ) : (
                <XCircle size={16} className="text-red-400" />
              )}
              <span
                className={`text-sm font-medium ${
                  myNode.ready ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {myNode.ready ? t('pipeline.online') : t('pipeline.offline')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-elevated">
              <div className="flex items-center gap-2 mb-2">
                <Layers size={16} className="text-label" />
                <p className="text-xs text-hint">{t('myNode.layerRange')}</p>
              </div>
              <p className="text-xl font-bold text-heading">
                {myNode.layerStart} - {myNode.layerEnd}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-elevated">
              <p className="text-xs text-hint mb-2">{t('myNode.pipelineOrder')}</p>
              <p className="text-xl font-bold text-heading">#{myNode.pipelineOrder}</p>
            </div>

            <div className="p-4 rounded-lg bg-elevated">
              <p className="text-xs text-hint mb-2">{t('myNode.grpcEndpoint')}</p>
              <p className="text-sm font-mono text-body truncate">{myNode.grpcEndpoint}</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title={t('myNode.pendingRewards')}
          value={`${formatPLM(rewardData?.pending ?? '0')} PLM`}
          icon={Award}
        />
        <StatCard
          title={t('myNode.tasksCompleted')}
          value={formatNumber(rewardData?.contribution.taskCount ?? 0)}
          icon={Activity}
        />
        <StatCard
          title={t('myNode.responseScore')}
          value={formatNumber(rewardData?.contribution.responseScore ?? 0)}
          icon={TrendingUp}
        />
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 text-heading">
          {t('myNode.contributionStats')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-lg bg-elevated">
            <p className="text-sm text-label mb-2">{t('myNode.uptime')}</p>
            <p className="text-2xl font-bold text-heading">
              {formatNumber(
                (rewardData?.contribution.uptimeSeconds ?? 0) / 3600,
                2
              )}{' '}
              {t('myNode.hours')}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-elevated">
            <p className="text-sm text-label mb-2">{t('myNode.lastUpdated')}</p>
            <p className="text-2xl font-bold text-heading">
              {rewardData?.contribution.lastUpdated
                ? new Date(rewardData.contribution.lastUpdated).toLocaleString()
                : t('myNode.never')}
            </p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-heading mb-1">
              {t('myNode.claimRewards')}
            </h3>
            <p className="text-sm text-label">
              {t('myNode.claimDesc')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-label mb-1">{t('myNode.availableToClaim')}</p>
            <p className="text-3xl font-bold text-cyan-400">
              {formatPLM(rewardData?.pending ?? '0')} PLM
            </p>
          </div>
        </div>

        <button
          className="btn-primary w-full py-3"
          disabled={BigInt(rewardData?.pending ?? '0') === 0n}
        >
          {BigInt(rewardData?.pending ?? '0') === 0n
            ? t('myNode.noRewards')
            : t('myNode.claimBtn')}
        </button>
      </motion.div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 text-heading">{t('myNode.activityLog')}</h3>
        <div className="text-center py-8 text-label">
          {t('myNode.noActivity')}
        </div>
      </div>
    </div>
  )
}

export default MyNode
