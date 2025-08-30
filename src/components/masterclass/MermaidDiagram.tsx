"use client"

import { useEffect, useRef } from "react"
import mermaid from "mermaid"
import { useTheme } from "next-themes"

interface MermaidDiagramProps {
  chart: string
  title?: string
}

export function MermaidDiagram({ chart, title }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const isDark = theme === 'dark'
    
    mermaid.initialize({
      startOnLoad: true,
      theme: isDark ? 'dark' : 'default',
      themeVariables: {
        primaryColor: isDark ? '#3b82f6' : '#2563eb',
        primaryTextColor: isDark ? '#f1f5f9' : '#1e293b',
        primaryBorderColor: isDark ? '#475569' : '#94a3b8',
        lineColor: isDark ? '#64748b' : '#475569',
        sectionBkgColor: isDark ? '#1e293b' : '#f8fafc',
        altSectionBkgColor: isDark ? '#334155' : '#e2e8f0',
        gridColor: isDark ? '#475569' : '#cbd5e1',
        secondaryColor: isDark ? '#475569' : '#e2e8f0',
        tertiaryColor: isDark ? '#334155' : '#f1f5f9',
      },
    })

    if (ref.current) {
      ref.current.innerHTML = chart
      mermaid.contentLoaded()
    }
  }, [chart, theme])

  return (
    <div className="my-8">
      {title && (
        <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 text-center">
          {title}
        </h4>
      )}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
        <div 
          ref={ref} 
          className="mermaid flex justify-center items-center min-h-[200px]"
        />
      </div>
    </div>
  )
}
