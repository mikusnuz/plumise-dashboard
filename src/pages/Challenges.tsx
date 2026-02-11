import { Zap, TrendingUp, CheckCircle2 } from 'lucide-react'
import StatCard from '../components/StatCard'
import ChallengeCard from '../components/ChallengeCard'
import {
  useCurrentChallenge,
  useChallenges,
} from '../hooks/useChallenges'
import { formatAddress, formatDuration, formatNumber } from '../lib/formatters'
import { useTranslation } from '../i18n'

export const Challenges = () => {
  const { t } = useTranslation()
  const { data: currentChallenge } = useCurrentChallenge()
  const { data: history } = useChallenges()

  const solvedCount = history?.filter((c) => c.solved).length ?? 0
  const difficulty = currentChallenge?.difficulty ?? 0
  const totalChallenges = history?.length ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-heading mb-2">{t('challenges.title')}</h1>
        <p className="text-label">
          {t('challenges.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title={t('challenges.totalChallenges')}
          value={formatNumber(totalChallenges)}
          icon={Zap}
        />
        <StatCard
          title={t('challenges.currentDifficulty')}
          value={formatNumber(difficulty)}
          icon={TrendingUp}
        />
        <StatCard
          title={t('challenges.solvedChallenges')}
          value={formatNumber(solvedCount)}
          icon={CheckCircle2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentChallenge ? (
          <ChallengeCard challenge={currentChallenge} />
        ) : (
          <div className="glass-card p-6">
            <p className="text-label text-center">{t('challenges.loading')}</p>
          </div>
        )}

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 text-heading">
            {t('challenges.difficultyTrend')}
          </h3>
          <div className="space-y-3">
            {history?.slice(0, 5).map((challenge, index) => (
              <div
                key={challenge.id}
                className="flex items-center justify-between p-3 rounded-lg bg-elevated"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-sm font-medium text-cyan-400">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm text-body">
                      {t('challenges.challengeId')} #{challenge.id}
                    </p>
                    <p className="text-xs text-hint">
                      {challenge.solved ? t('challenges.solved') : t('challenges.unsolved')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-heading">
                    {challenge.difficulty}
                  </p>
                  <p className="text-xs text-hint">{t('challenges.difficulty')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 text-heading">
          {t('challenges.history')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-elevated border-b border-theme">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-label uppercase">
                  {t('challenges.challengeId')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-label uppercase">
                  {t('challenges.difficulty')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-label uppercase">
                  {t('rewards.status')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-label uppercase">
                  {t('challenges.solver')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-label uppercase">
                  {t('challenges.solveTime')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-label uppercase">
                  {t('challenges.bonus')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              {history?.map((challenge) => {
                const createdAt = Number(challenge.createdAt)
                const expiresAt = Number(challenge.expiresAt)
                const solveTime = expiresAt - createdAt

                return (
                  <tr key={challenge.id} className="table-row">
                    <td className="px-6 py-4 text-heading font-medium">
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
                        {challenge.solved ? t('challenges.solved') : t('challenges.unsolved')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {challenge.solved ? (
                        <span className="font-mono text-sm text-body">
                          {formatAddress(challenge.solver)}
                        </span>
                      ) : (
                        <span className="text-sm text-hint">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-body">
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
