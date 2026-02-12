import { useState, useMemo } from 'react'
import { ChevronDown, Terminal, Box } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import CodeBlock from './CodeBlock'
import { useTranslation } from '../i18n'

interface NodeInstallSectionProps {
  walletAddress: string
}

type InstallTab = 'oneline' | 'binary'
type OsTab = 'mac' | 'linux' | 'windows'

const detectOS = (): OsTab => {
  const p = navigator.platform.toLowerCase()
  if (p.includes('mac')) return 'mac'
  if (p.includes('win')) return 'windows'
  return 'linux'
}

export const NodeInstallSection = ({ walletAddress }: NodeInstallSectionProps) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<InstallTab>('oneline')
  const [osTab, setOsTab] = useState<OsTab>(detectOS)
  const [expanded, setExpanded] = useState(false)

  const onelineCode = useMemo(
    () =>
      `curl -fsSL https://get.plumise.com/node | sh -s -- \\\n  --wallet ${walletAddress}`,
    [walletAddress]
  )

  const binaryCode = useMemo(
    () =>
      `curl -fsSL https://get.plumise.com/install | sh && \\\n  plumise-node start --wallet ${walletAddress}`,
    [walletAddress]
  )

  const steps = [
    t('myNode.step1'),
    t('myNode.step2'),
    t('myNode.step3'),
    t('myNode.step4'),
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="mb-5">
        <h2 className="text-xl font-bold text-heading mb-1">
          {t('myNode.setupTitle')}
        </h2>
        <p className="text-sm text-label">
          {t('myNode.setupDesc')}
        </p>
      </div>

      {/* Install method tabs */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setActiveTab('oneline')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'oneline' ? 'tab-active' : 'tab-inactive'
          }`}
        >
          <Terminal size={16} />
          {t('myNode.tabOneline')}
        </button>
        <button
          onClick={() => setActiveTab('binary')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'binary' ? 'tab-active' : 'tab-inactive'
          }`}
        >
          <Box size={16} />
          {t('myNode.tabBinary')}
        </button>
      </div>

      {/* One-line tab */}
      {activeTab === 'oneline' && (
        <div className="space-y-3">
          <CodeBlock code={onelineCode} highlightAddress={walletAddress} />
          <div className="flex items-center gap-3 text-xs text-label">
            <span className="badge-info">{t('myNode.gpuAuto')}</span>
            <span className="text-hint">{t('myNode.setupTime')}</span>
          </div>
        </div>
      )}

      {/* Binary tab */}
      {activeTab === 'binary' && (
        <div className="space-y-3">
          {/* OS sub-tabs */}
          <div className="flex gap-1.5">
            {(['mac', 'linux', 'windows'] as const).map((os) => (
              <button
                key={os}
                onClick={() => setOsTab(os)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  osTab === os ? 'tab-active' : 'tab-inactive'
                }`}
              >
                {t(`myNode.os${os.charAt(0).toUpperCase() + os.slice(1)}` as
                  'myNode.osMac' | 'myNode.osLinux' | 'myNode.osWindows')}
              </button>
            ))}
          </div>

          {osTab === 'windows' ? (
            <div className="rounded-lg bg-elevated p-6 text-center space-y-2">
              <p className="text-label font-medium">{t('myNode.comingSoon')}</p>
              <p className="text-sm text-hint">
                {t('myNode.useWsl')}{' '}
                <a
                  href="https://learn.microsoft.com/windows/wsl/install"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline"
                >
                  WSL Install Guide
                </a>
              </p>
            </div>
          ) : (
            <CodeBlock code={binaryCode} highlightAddress={walletAddress} />
          )}

          <div className="flex items-center gap-3 text-xs text-label">
            <span className="badge-success">{t('myNode.noDocker')}</span>
          </div>
        </div>
      )}

      {/* What this does - collapsible */}
      <div className="mt-5 border-t border-[var(--border-divider)] pt-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm font-medium text-label hover:text-heading transition-colors w-full"
        >
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} />
          </motion.span>
          {t('myNode.whatThisDoes')}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <ol className="mt-3 space-y-2 pl-1">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-label">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-400">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default NodeInstallSection
