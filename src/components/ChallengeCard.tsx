import { motion } from 'motion/react'
import { Zap, Clock, CheckCircle2 } from 'lucide-react'
import type { Challenge } from '../hooks/useChallenges'
import { formatAddress, formatDuration } from '../lib/formatters'
import { useTranslation } from '../i18n'

interface ChallengeCardProps {
  challenge: Challenge
}

export const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
  const { t } = useTranslation()
  const now = Math.floor(Date.now() / 1000)
  const expiresAt = Number(challenge.expiresAt)
  const timeRemaining = expiresAt - now
  const isExpired = timeRemaining <= 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-heading mb-2">
            {t('challenges.currentChallenge')}
          </h3>
          <p className="text-sm text-label">
            {t('challenges.challengeId')} #{challenge.id}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
          <Zap size={24} className="text-cyan-400" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-elevated">
          <div>
            <p className="text-xs text-hint mb-1">{t('challenges.difficulty')}</p>
            <p className="text-2xl font-bold text-heading">
              {challenge.difficulty}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-hint mb-1">{t('challenges.rewardBonus')}</p>
            <p className="text-lg font-semibold text-purple-400">
              +{challenge.rewardBonus}%
            </p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-elevated">
          <p className="text-xs text-hint mb-2">{t('challenges.challengeSeed')}</p>
          <p className="font-mono text-sm text-body break-all">
            {challenge.seed}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {challenge.solved ? (
            <div className="flex items-center gap-2 p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex-1">
              <CheckCircle2 size={20} className="text-green-400" />
              <div>
                <p className="text-xs text-green-400 font-medium">{t('challenges.solvedBy')}</p>
                <p className="font-mono text-sm text-green-300">
                  {formatAddress(challenge.solver)}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 flex-1">
              <Clock
                size={20}
                className={isExpired ? 'text-red-400' : 'text-orange-400'}
              />
              <div>
                <p
                  className={`text-xs font-medium ${
                    isExpired ? 'text-red-400' : 'text-orange-400'
                  }`}
                >
                  {isExpired ? t('challenges.expired') : t('challenges.timeRemaining')}
                </p>
                <p
                  className={`text-sm ${
                    isExpired ? 'text-red-300' : 'text-orange-300'
                  }`}
                >
                  {isExpired ? t('challenges.challengeExpired') : formatDuration(timeRemaining)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ChallengeCard
