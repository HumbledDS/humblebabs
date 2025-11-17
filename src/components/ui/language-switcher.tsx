"use client"

import { motion } from "framer-motion"
import { useI18n } from "@/components/i18n-provider"
import { Button } from "./button"

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n()

  const options: Array<{ code: "en" | "fr"; label: string; flag: string; aria: string }> = [
    { code: "en", label: "EN", flag: "🇬🇧", aria: "Switch to English" },
    { code: "fr", label: "FR", flag: "🇫🇷", aria: "Passer en Français" },
  ]

  return (
    <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-full border border-border/60">
      {options.map((opt) => {
        const isActive = lang === opt.code
        return (
          <motion.div key={opt.code} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => setLang(opt.code)}
              aria-label={opt.aria}
              title={opt.aria}
              className={`px-3 py-2 h-8 rounded-full ${isActive ? "bg-blue-600 text-white shadow-md" : "text-gray-700 hover:text-gray-900"}`}
            >
              <span className="text-base leading-none">{opt.flag}</span>
            </Button>
          </motion.div>
        )
      })}
    </div>
  )
}


