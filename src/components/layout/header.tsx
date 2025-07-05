"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { Menu, X, Sun, Moon, Monitor, Sparkles, Code2, Database, Brain, Cloud } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const navigation = [
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
]

const skillIcons = [Brain, Cloud, Database, Code2]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-2xl shadow-primary/5' 
          : 'bg-background/60 backdrop-blur-md border-b border-border/20'
      }`}
    >
      {/* Animated gradient line */}
      <motion.div 
        className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent"
        initial={{ width: "0%" }}
        animate={{ width: scrolled ? "100%" : "0%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        {/* Brand with enhanced animation */}
        <motion.div 
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Link href="/" className="group relative">
            <motion.div className="flex items-center gap-3">
              {/* Animated logo icon */}
              <motion.div
                className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-purple-600 to-blue-600 flex items-center justify-center"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <motion.div
                  className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/20 to-purple-600/20 blur-lg group-hover:blur-xl transition-all duration-300"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <Sparkles className="w-4 h-4 text-white relative z-10" />
              </motion.div>
              
              {/* Brand text with gradient */}
              <motion.span 
                className="font-jetbrains-mono text-xl font-bold bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                HumbleBabs
                <motion.span
                  className="absolute -top-1 -right-1 text-xs opacity-60"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  .dev
                </motion.span>
              </motion.span>
            </motion.div>
          </Link>
        </motion.div>
        
        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="relative -m-2.5 inline-flex items-center justify-center rounded-xl p-2.5 text-foreground hover:bg-muted/50 transition-all duration-300 group"
            onClick={() => setMobileMenuOpen(true)}
          >
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              whileHover={{ scale: 1.05 }}
            />
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6 relative z-10" aria-hidden="true" />
          </motion.button>
        </div>
        
        {/* Navigation + Theme toggle group aligné à droite */}
        <div className="hidden lg:flex items-center gap-x-8">
          {/* Navigation links */}
          <div className="flex items-center gap-x-8">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.07 }}
                  whileHover={{ scale: 1.08 }}
                >
                  <Link
                    href={item.href}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
                      isActive 
                        ? 'text-primary bg-primary/10' 
                        : 'text-foreground hover:text-primary'
                    }`}
                  >
                    <span className="relative z-10">{item.name}</span>
                    <span
                      className={`absolute left-0 bottom-1 h-0.5 w-0 bg-primary rounded transition-all duration-300 group-hover:w-full ${isActive ? 'w-full' : ''}`}
                    />
                  </Link>
                </motion.div>
              )
            })}
          </div>
          {/* Theme toggle */}
          {mounted && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative rounded-xl p-3 hover:bg-muted/50 transition-all duration-300 group overflow-hidden"
              aria-label="Toggle theme"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.1 }}
              />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ opacity: 0, rotate: -180, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 180, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5 text-yellow-500" />
                  ) : theme === "light" ? (
                    <Moon className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Monitor className="h-5 w-5 text-purple-600" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          )}
        </div>
      </nav>
      
      {/* Enhanced mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden"
          >
            <motion.div 
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background/95 backdrop-blur-xl px-6 py-6 sm:max-w-sm border-l border-border/50 shadow-2xl"
            >
              {/* Mobile header */}
              <div className="flex items-center justify-between mb-8">
                <Link href="/" className="group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-jetbrains-mono text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      HumbleBabs
                    </span>
                  </div>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="rounded-xl p-2.5 text-foreground hover:bg-muted/50 transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              {/* Mobile navigation */}
              <div className="space-y-2">
                {navigation.map((item, index) => {
                  const isActive = pathname === item.href
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all duration-300 ${
                          isActive
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'text-foreground hover:bg-muted/50 hover:text-primary'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                        {isActive && (
                          <motion.div
                            className="ml-auto w-2 h-2 bg-primary rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              {/* Mobile theme toggle */}
              <div className="mt-8 pt-6 border-t border-border/30">
                {mounted && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setTheme(theme === "dark" ? "light" : "dark")
                      setMobileMenuOpen(false)
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-foreground hover:bg-muted/50 transition-all duration-300"
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      {theme === "dark" ? (
                        <Sun className="h-5 w-5 text-yellow-500" />
                      ) : theme === "light" ? (
                        <Moon className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Monitor className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                    {theme === "dark" ? "Light Mode" : theme === "light" ? "Dark Mode" : "System Theme"}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}