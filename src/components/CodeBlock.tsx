import { useState, useCallback } from 'react'
import { Copy, Check } from 'lucide-react'
import { useTranslation } from '../i18n'

interface CodeBlockProps {
  code: string
  language?: string
  highlightAddress?: string
  title?: string
}

export const CodeBlock = ({ code, highlightAddress, title = 'bash' }: CodeBlockProps) => {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  const renderCode = () => {
    if (!highlightAddress) return code
    const parts = code.split(highlightAddress)
    if (parts.length === 1) return code
    return parts.map((part, i) => (
      <span key={i}>
        {part}
        {i < parts.length - 1 && (
          <span className="text-cyan-400">{highlightAddress}</span>
        )}
      </span>
    ))
  }

  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.06] shadow-lg">
      {/* iTerm-style title bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1b26] border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
        </div>
        <span className="text-[11px] font-medium text-gray-500 select-none">{title}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors text-xs"
          title={t('myNode.copyBtn')}
        >
          {copied ? (
            <>
              <Check size={13} className="text-green-400" />
              <span className="text-green-400">{t('myNode.copied')}</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>{t('myNode.copyBtn')}</span>
            </>
          )}
        </button>
      </div>
      {/* Code content */}
      <div className="bg-[#0d1117]">
        <pre className="p-4 overflow-x-auto text-[13px] font-mono text-gray-300 leading-[1.7]">
          <code>{renderCode()}</code>
        </pre>
      </div>
    </div>
  )
}

export default CodeBlock
