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

  // Handle scroll to close mobile menu
  useEffect(() => {
    const handleScroll = () => {
      if (mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    if (mobileMenuOpen) {
      window.addEventListener('scroll', handleScroll)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [mobileMenuOpen])

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [mobileMenuOpen])

  return (
    <>
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
      </motion.header>
      
      {/* Mobile menu - Now moved outside header and with proper z-index */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop - no backdrop blur, just transparency */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-background/20"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Mobile menu panel - shorter height with blur only on menu */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 right-0 z-[70] bg-background/90 backdrop-blur-md shadow-2xl border-b border-border/50 rounded-b-2xl"
              style={{ height: 'auto', maxHeight: '60vh' }}
            >
              {/* Top bar: X and theme toggle */}
              <div className="flex items-center justify-end gap-4 p-6">
                {mounted && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setTheme(theme === "dark" ? "light" : "dark")
                      setMobileMenuOpen(false)
                    }}
                    className="rounded-xl p-3 text-foreground hover:bg-muted/50 transition-all duration-300 border border-border/30"
                    aria-label="Toggle theme"
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={theme}
                        initial={{ opacity: 0, rotate: -180 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 180 }}
                        transition={{ duration: 0.3 }}
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
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  className="rounded-xl p-3 text-foreground hover:bg-muted/50 transition-all duration-300 border border-border/30"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>
              
              {/* Navigation links */}
              <div className="flex flex-col items-end px-8 space-y-4 pb-8">
                {navigation.map((item, index) => {
                  const isActive = pathname === item.href
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="w-full max-w-xs"
                      whileHover="hover"
                    >
                      <Link
                        href={item.href}
                        className={`relative flex items-center justify-end rounded-xl px-6 py-4 text-2xl font-bold transition-all duration-300 w-full group overflow-hidden ${
                          isActive
                            ? 'bg-gradient-to-l from-primary/20 to-primary/10 text-primary border-2 border-primary/40 shadow-lg shadow-primary/20'
                            : 'text-foreground hover:bg-gradient-to-l hover:from-primary/10 hover:to-primary/5 hover:text-primary hover:border-primary/20 border-2 border-transparent'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {/* Animated background effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-l from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          variants={{
                            hover: { scale: 1.02 }
                          }}
                        />
                        
                        {/* Text content */}
                        <span className="ml-auto relative z-10">{item.name}</span>
                        
                        {/* Active indicator - much more prominent */}
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center gap-2 ml-3 relative z-10"
                          >
                            <motion.div
                              className="w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/50"
                              animate={{ 
                                scale: [1, 1.2, 1],
                                boxShadow: ["0 0 10px rgba(var(--primary), 0.5)", "0 0 20px rgba(var(--primary), 0.8)", "0 0 10px rgba(var(--primary), 0.5)"]
                              }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                            <motion.div
                              className="w-1 h-1 bg-primary/60 rounded-full"
                              animate={{ opacity: [0.6, 1, 0.6] }}
                              transition={{ 
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                          </motion.div>
                        )}
                        
                        {/* Hover underline indicator */}
                        {!isActive && (
                          <motion.div
                            className="absolute bottom-2 left-46 right-6 h-0.5 bg-gradient-to-r from-primary/60 to-purple-600/60 z-10"
                            variants={{
                              hover: { 
                                opacity: 1,
                                scaleX: 1
                              }
                            }}
                            initial={{ 
                              opacity: 0,
                              scaleX: 0
                            }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            style={{ originX: 1 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}