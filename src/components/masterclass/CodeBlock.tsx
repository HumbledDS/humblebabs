"use client"

import { useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Copy, Check } from "lucide-react"
import { useTheme } from "next-themes"

interface CodeBlockProps {
  code: string
  language: string
  title?: string
  showLineNumbers?: boolean
}

export function CodeBlock({ code, language, title, showLineNumbers = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const { theme } = useTheme()

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isDark = theme === 'dark'

  return (
    <div className="my-6">
      {title && (
        <div className="bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-t-lg border-b border-slate-200 dark:border-slate-600">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">{title}</h4>
        </div>
      )}
      <div className="relative group">
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={copyToClipboard}
            className="p-2 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 rounded-md hover:bg-slate-700 dark:hover:bg-slate-300 transition-colors"
            title="Copier le code"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400 dark:text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
        <SyntaxHighlighter
          language={language}
          style={isDark ? oneDark : oneLight}
          className={`rounded-lg text-sm ${title ? 'rounded-t-none' : ''}`}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            backgroundColor: isDark ? 'rgb(15 23 42)' : 'rgb(248 250 252)',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
