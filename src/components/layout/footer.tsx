"use client"

import Link from "next/link"
import { Github, Linkedin, Twitter, Mail, Heart, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/humblebabs",
    icon: Github,
    color: "hover:text-gray-900 dark:hover:text-white",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/humblebabs",
    icon: Linkedin,
    color: "hover:text-blue-600",
  },
  {
    name: "Twitter",
    href: "https://twitter.com/humblebabs",
    icon: Twitter,
    color: "hover:text-blue-400",
  },
  {
    name: "Email",
    href: "mailto:hello@humblebabs.com",
    icon: Mail,
    color: "hover:text-red-500",
  },
]

const quickLinks = [
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Latest Article", href: "/blog/building-scalable-ml-pipelines" },
  { name: "Contact", href: "/contact" },
]

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-background via-muted/20 to-muted/40 border-t border-border/50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      
      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <motion.div 
            className="md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link href="/" className="inline-block mb-4 group">
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="font-jetbrains-mono text-xl font-bold bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  HumbleBabs
                </span>
              </motion.div>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
              Full-stack developer passionate about building innovative experiences. 
              Specializing in AI, Cloud Computing, and Data Science solutions.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={item.href}
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-300 ${item.color} group relative overflow-hidden`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ scale: 1.1 }}
                    />
                    <item.icon className="w-5 h-5 relative z-10" aria-hidden="true" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-300 relative group"
                  >
                    <span className="relative">
                      {link.name}
                      <motion.span
                        className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 group-hover:w-full transition-all duration-300"
                        whileHover={{ width: "100%" }}
                      />
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-foreground mb-4">Get In Touch</h3>
            <div className="space-y-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                <Mail className="w-4 h-4" />
                <a href="mailto:hello@humblebabs.com" className="text-sm">
                  hello@humblebabs.com
                </a>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm">Available for opportunities</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div 
          className="mt-12 pt-8 border-t border-border/30"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <motion.p 
              className="text-sm text-muted-foreground text-center md:text-left"
              whileHover={{ scale: 1.02 }}
            >
              &copy; {new Date().getFullYear()} HumbleBabs. All rights reserved.
            </motion.p>
            <motion.div 
              className="flex items-center gap-2 text-sm text-muted-foreground"
              whileHover={{ scale: 1.05 }}
            >
              <span>Built with</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>using Next.js, TypeScript & Tailwind CSS</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
} 