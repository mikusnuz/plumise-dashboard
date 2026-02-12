import { useState, useCallback } from 'react'
import { Copy, Check } from 'lucide-react'
import { useTranslation } from '../i18n'

interface CodeBlockProps {
  code: string
  language?: string
  highlightAddress?: string
}

export const CodeBlock = ({ code, highlightAddress }: CodeBlockProps) => {
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
    <div className="relative group rounded-lg bg-[#0d1117] border border-white/5">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-1.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-gray-200"
        title={t('myNode.copyBtn')}
      >
        {copied ? (
          <Check size={16} className="text-green-400" />
        ) : (
          <Copy size={16} />
        )}
      </button>
      <pre className="p-4 pr-12 overflow-x-auto text-sm font-mono text-gray-200 leading-relaxed">
        <code>{renderCode()}</code>
      </pre>
      {copied && (
        <span className="absolute top-3 right-12 text-xs text-green-400 font-medium">
          {t('myNode.copied')}
        </span>
      )}
    </div>
  )
}

export default CodeBlock
