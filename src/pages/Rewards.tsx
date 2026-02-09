import { Award, TrendingUp, Users } from 'lucide-react'
import StatCard from '../components/StatCard'
import RewardChart from '../components/RewardChart'
import { useCurrentEpoch, useEpochRewards, useRewardFormula } from '../hooks/useRewards'
import { formatNumber, formatPLM } from '../lib/formatters'

export const Rewards = () => {
  const { data: currentEpochData } = useCurrentEpoch()
  const { data: formula } = useRewardFormula()

  // Fetch last 50 epochs for detailed history
  const epochRewardsQueries = Array.from({ length: 50 }, (_, i) => {
    const epoch = (currentEpochData ?? 0) - i
    return useEpochRewards(epoch)
  })

  const rewardChartData = epochRewardsQueries
    .filter((q) => q.data)
    .map((q) => ({
      epoch: q.data!.epoch,
      reward: q.data!.reward,
    }))
    .reverse()

  const totalDistributed = rewardChartData.reduce(
    (sum, item) => sum + item.reward,
    0n
  )

  const avgReward =
    rewardChartData.length > 0
      ? totalDistributed / BigInt(rewardChartData.length)
      : 0n

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Reward Distribution</h1>
        <p className="text-slate-400">
          Track reward history and distribution across epochs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Distributed"
          value={`${formatPLM(totalDistributed)} PLM`}
          icon={Award}
        />
        <StatCard
          title="Average per Epoch"
          value={`${formatPLM(avgReward)} PLM`}
          icon={TrendingUp}
        />
        <StatCard
          title="Epochs Tracked"
          value={formatNumber(rewardChartData.length)}
          icon={Users}
        />
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Reward Formula</h3>
        <p className="text-sm text-slate-400 mb-4">
          Rewards are calculated based on weighted contributions:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20">
            <p className="text-sm text-cyan-400 mb-2">Task Completion</p>
            <p className="text-3xl font-bold text-white">
              {formula?.task ?? 50}%
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
            <p className="text-sm text-purple-400 mb-2">Uptime</p>
            <p className="text-3xl font-bold text-white">
              {formula?.uptime ?? 30}%
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/20">
            <p className="text-sm text-pink-400 mb-2">Response Quality</p>
            <p className="text-3xl font-bold text-white">
              {formula?.response ?? 20}%
            </p>
          </div>
        </div>
      </div>

      {rewardChartData.length > 0 ? (
        <RewardChart data={rewardChartData} />
      ) : (
        <div className="glass-card p-6">
          <p className="text-slate-400 text-center">Loading reward history...</p>
        </div>
      )}

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 text-white">
          Recent Epoch Rewards
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">
                  Epoch
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">
                  Total Reward
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">
                  Agents
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">
                  Avg per Agent
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {epochRewardsQueries.slice(0, 10).map((query) =>
                query.data ? (
                  <tr key={query.data.epoch} className="table-row">
                    <td className="px-6 py-4 text-white font-medium">
                      #{formatNumber(query.data.epoch)}
                    </td>
                    <td className="px-6 py-4 text-cyan-400 font-mono">
                      {formatPLM(query.data.reward)} PLM
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {formatNumber(query.data.agents.length)}
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-mono">
                      {query.data.agents.length > 0
                        ? formatPLM(
                            query.data.reward / BigInt(query.data.agents.length)
                          )
                        : '0'}{' '}
                      PLM
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          query.data.distributed ? 'badge-success' : 'badge-warning'
                        }
                      >
                        {query.data.distributed ? 'Distributed' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Rewards
