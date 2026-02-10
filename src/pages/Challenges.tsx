import { Zap, TrendingUp, CheckCircle2 } from 'lucide-react'
import StatCard from '../components/StatCard'
import ChallengeCard from '../components/ChallengeCard'
import {
  useCurrentChallenge,
  useChallenges,
} from '../hooks/useChallenges'
import { formatAddress, formatDuration, formatNumber } from '../lib/formatters'

export const Challenges = () => {
  const { data: currentChallenge } = useCurrentChallenge()
  const { data: history } = useChallenges()

  const solvedCount = history?.filter((c) => c.solved).length ?? 0
  const difficulty = currentChallenge?.difficulty ?? 0
  const totalChallenges = history?.length ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Challenges</h1>
        <p className="text-slate-400">
          View current and historical proof-of-work challenges
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Challenges"
          value={formatNumber(totalChallenges)}
          icon={Zap}
        />
        <StatCard
          title="Current Difficulty"
          value={formatNumber(difficulty)}
          icon={TrendingUp}
        />
        <StatCard
          title="Solved Challenges"
          value={formatNumber(solvedCount)}
          icon={CheckCircle2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentChallenge ? (
          <ChallengeCard challenge={currentChallenge} />
        ) : (
          <div className="glass-card p-6">
            <p className="text-slate-400 text-center">Loading challenge...</p>
          </div>
        )}

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 text-white">
            Difficulty Trend
          </h3>
          <div className="space-y-3">
            {history?.slice(0, 5).map((challenge, index) => (
              <div
                key={challenge.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-sm font-medium text-cyan-400">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm text-slate-300">
                      Challenge #{challenge.id}
                    </p>
                    <p className="text-xs text-slate-500">
                      {challenge.solved ? 'Solved' : 'Unsolved'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">
                    {challenge.difficulty}
                  </p>
                  <p className="text-xs text-slate-500">Difficulty</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 text-white">
          Challenge History
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">
                  Challenge ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">
                  Difficulty
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">
                  Solver
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">
                  Solve Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">
                  Bonus
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {history?.map((challenge) => {
                const createdAt = new Date(challenge.createdAt).getTime() / 1000
                const expiresAt = new Date(challenge.expiresAt).getTime() / 1000
                const solveTime = expiresAt - createdAt

                return (
                  <tr key={challenge.id} className="table-row">
                    <td className="px-6 py-4 text-white font-medium">
                      #{challenge.id}
                    </td>
                    <td className="px-6 py-4 text-cyan-400 font-mono">
                      {challenge.difficulty}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          challenge.solved ? 'badge-success' : 'badge-warning'
                        }
                      >
                        {challenge.solved ? 'Solved' : 'Unsolved'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {challenge.solved ? (
                        <span className="font-mono text-sm text-slate-300">
                          {formatAddress(challenge.solver)}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {challenge.solved ? formatDuration(solveTime) : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-purple-400 font-medium">
                      +{challenge.rewardBonus}%
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Challenges
