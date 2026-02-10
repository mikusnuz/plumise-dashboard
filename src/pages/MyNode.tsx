import { useState } from 'react'
import { Wallet, Award, Activity, TrendingUp } from 'lucide-react'
import { motion } from 'motion/react'
import StatCard from '../components/StatCard'
import { useRewards } from '../hooks/useRewards'
import { formatAddress, formatPLM, formatNumber } from '../lib/formatters'
import { useTranslation } from '../i18n'

export const MyNode = () => {
  const { t } = useTranslation()
  const [walletAddress, setWalletAddress] = useState<`0x${string}` | undefined>()
  const { data: rewardData } = useRewards(walletAddress)

  const handleConnect = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert(t('myNode.installMetamask'))
      return
    }

    try {
      const accounts = (await window.ethereum.request({
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
