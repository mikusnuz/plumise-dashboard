import { useState } from 'react'
import { Wallet, Award, Activity, TrendingUp } from 'lucide-react'
import { motion } from 'motion/react'
import StatCard from '../components/StatCard'
import { useRewards } from '../hooks/useRewards'
import { formatAddress, formatPLM, formatNumber } from '../lib/formatters'

export const MyNode = () => {
  const [walletAddress, setWalletAddress] = useState<`0x${string}` | undefined>()
  const { data: rewardData } = useRewards(walletAddress)

  const handleConnect = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask to connect your wallet')
      return
    }

    try {
      const accounts = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[]

      const addr = accounts[0]
      // Validate address format before using it
      if (addr && /^0x[0-9a-fA-F]{40}$/.test(addr)) {
        setWalletAddress(addr as `0x${string}`)
      } else {
        alert('Invalid wallet address returned')
      }
    } catch (error) {
      // Log connection errors (non-sensitive info only)
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
          <h1 className="text-3xl font-bold text-white mb-2">My Node</h1>
          <p className="text-slate-400">
            Connect your wallet to view your node status and rewards
          </p>
        </div>

        <div className="glass-card p-12 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <div className="p-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 w-24 h-24 flex items-center justify-center mx-auto">
              <Wallet size={48} className="text-cyan-400" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Connect Your Wallet
              </h2>
              <p className="text-slate-400">
                Connect your wallet to view your agent status, pending rewards, and
                claim your earnings
              </p>
            </div>

            <button onClick={handleConnect} className="btn-primary w-full py-3">
              Connect Wallet
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
          <h1 className="text-3xl font-bold text-white mb-2">My Node</h1>
          <p className="text-slate-400">Monitor your agent and claim rewards</p>
        </div>
        <button onClick={handleDisconnect} className="btn-secondary">
          Disconnect
        </button>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
            <Wallet size={32} className="text-cyan-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">Connected Wallet</p>
            <p className="text-xl font-mono text-white">{formatAddress(walletAddress, 8)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Pending Rewards"
          value={`${formatPLM(rewardData?.pending ?? '0')} PLM`}
          icon={Award}
        />
        <StatCard
          title="Tasks Completed"
          value={formatNumber(rewardData?.contribution.taskCount ?? 0)}
          icon={Activity}
        />
        <StatCard
          title="Response Score"
          value={formatNumber(rewardData?.contribution.responseScore ?? 0)}
          icon={TrendingUp}
        />
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 text-white">
          Contribution Stats
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-lg bg-slate-800/50">
            <p className="text-sm text-slate-400 mb-2">Uptime</p>
            <p className="text-2xl font-bold text-white">
              {formatNumber(
                (rewardData?.contribution.uptimeSeconds ?? 0) / 3600,
                2
              )}{' '}
              hours
            </p>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/50">
            <p className="text-sm text-slate-400 mb-2">Last Updated</p>
            <p className="text-2xl font-bold text-white">
              {rewardData?.contribution.lastUpdated
                ? new Date(rewardData.contribution.lastUpdated).toLocaleString()
                : 'Never'}
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
            <h3 className="text-lg font-semibold text-white mb-1">
              Claim Rewards
            </h3>
            <p className="text-sm text-slate-400">
              Claim your accumulated rewards to your wallet
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400 mb-1">Available to Claim</p>
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
            ? 'No Rewards Available'
            : 'Claim Rewards'}
        </button>
      </motion.div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Activity Log</h3>
        <div className="text-center py-8 text-slate-400">
          No recent activity to display
        </div>
      </div>
    </div>
  )
}

export default MyNode
