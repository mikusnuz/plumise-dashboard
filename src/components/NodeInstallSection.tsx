import { useState, useMemo } from 'react'
import { ChevronDown, Terminal, Monitor, Box, Download } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import CodeBlock from './CodeBlock'
import { useTranslation } from '../i18n'

interface NodeInstallSectionProps {
  walletAddress: string
}

type InstallTab = 'desktop' | 'pip' | 'docker'

export const NodeInstallSection = ({ walletAddress }: NodeInstallSectionProps) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<InstallTab>('desktop')
  const [expanded, setExpanded] = useState(false)

  const pipCode = useMemo(
    () =>
      `pip install plumise-agent\n\n# Create .env file\ncat > .env << EOF\nPLUMISE_PRIVATE_KEY=<your-private-key>\nMODEL_NAME=openai/gpt-oss-20b\nDEVICE=auto\nORACLE_API_URL=https://oracle.plumise.com\nPLUMISE_RPC_URL=https://node-1.plumise.com/rpc\nEOF\n\n# Start the agent\nplumise-agent start`,
    []
  )

  const dockerCode = useMemo(
    () =>
      `docker run -d --name plumise-agent \\\n  -e PLUMISE_PRIVATE_KEY=<your-private-key> \\\n  -e MODEL_NAME=openai/gpt-oss-20b \\\n  -e DEVICE=auto \\\n  -e ORACLE_API_URL=https://oracle.plumise.com \\\n  -e PLUMISE_RPC_URL=https://node-1.plumise.com/rpc \\\n  --network host \\\n  ghcr.io/mikusnuz/plumise-agent:latest`,
    []
  )

  const steps = [
    t('myNode.step1'),
    t('myNode.step2'),
    t('myNode.step3'),
    t('myNode.step4'),
  ]

  const tabs: { id: InstallTab; icon: typeof Monitor; label: string }[] = [
    { id: 'desktop', icon: Monitor, label: t('myNode.tabDesktop') },
    { id: 'pip', icon: Terminal, label: t('myNode.tabPip') },
    { id: 'docker', icon: Box, label: 'Docker' },
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
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === id ? 'tab-active' : 'tab-inactive'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content - all panels stacked in same grid cell, tallest wins */}
      <div className="grid [&>*]:col-start-1 [&>*]:row-start-1">
        {/* Desktop app tab */}
        <div className={`space-y-4 ${activeTab === 'desktop' ? '' : 'invisible'}`}>
          <div className="rounded-xl bg-[#0d1117] border border-white/[0.06] p-8 flex flex-col items-center justify-center min-h-[272px] space-y-5">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/15 to-purple-500/15 border border-cyan-500/20">
              <Monitor size={36} className="text-cyan-400" />
            </div>
            <div className="text-center">
              <p className="text-gray-200 font-semibold text-lg mb-1">{t('myNode.desktopTitle')}</p>
              <p className="text-sm text-gray-500 max-w-xs">
                {t('myNode.desktopDesc')}
              </p>
            </div>
            <a
              href="https://github.com/mikusnuz/plumise-agent-app/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2 py-2.5 px-6"
            >
              <Download size={16} />
              {t('myNode.downloadBtn')}
            </a>
          </div>
          <div className="flex items-center gap-3 text-xs text-label">
            <span className="badge-info">{t('myNode.gpuAuto')}</span>
            <span className="badge-success">{t('myNode.noConfig')}</span>
            <span className="text-hint">Windows</span>
          </div>
        </div>

        {/* pip install tab */}
        <div className={`space-y-3 ${activeTab === 'pip' ? '' : 'invisible'}`}>
          <CodeBlock code={pipCode} highlightAddress={walletAddress} title="bash" />
          <div className="flex items-center gap-3 text-xs text-label">
            <span className="badge-info">Python 3.10+</span>
            <span className="text-hint">Linux / macOS</span>
          </div>
        </div>

        {/* Docker tab */}
        <div className={`space-y-3 ${activeTab === 'docker' ? '' : 'invisible'}`}>
          <CodeBlock code={dockerCode} highlightAddress={walletAddress} title="bash" />
          <div className="flex items-center gap-3 text-xs text-label">
            <span className="badge-info">Docker 24+</span>
            <span className="text-hint">Linux / macOS / Windows (WSL)</span>
          </div>
        </div>
      </div>

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
