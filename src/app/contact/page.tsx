"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Linkedin, Github, Send, CheckCircle, AlertCircle } from "lucide-react"
import { useI18n } from "@/components/i18n-provider"

const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    value: "contact@humblebabs.com",
    href: "mailto:babacar.work2024@gmail.com",
    description: "Send me an email for any inquiries"
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+33 6 79 81 97 72",
    href: "tel:+33679819772",
    description: "Call me for urgent matters"
  },
  {
    icon: MapPin,
    title: "Location",
    value: "Region Parisienne, France",
    href: "#",
    description: "Based in the Paris Region"
  }
]

const socialLinks = [
  {
    icon: Linkedin,
    title: "LinkedIn",
    href: "https://linkedin.com/in/babacargueye1/",
    color: "hover:text-blue-600"
  },
  {
    icon: Github,
    title: "GitHub",
    href: "https://github.com/humbledds",
    color: "hover:text-gray-900 dark:hover:text-white"
  }
]

export default function ContactPage() {
  const { t } = useI18n()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de l\'envoi')
      }

      setIsSubmitted(true)
      setError(null) // Clear any previous errors
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({ name: "", email: "", subject: "", message: "" })
      }, 3000)
      
    } catch (error) {
      console.error('Erreur:', error)
      setError(error instanceof Error ? error.message : 'Erreur lors de l\'envoi du message')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t("contact.title").split(" ").slice(0, 2).join(" ")} <span className="text-[#23235b]">{t("contact.title").split(" ").slice(2).join(" ")}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-8">{t("contact.connectTitle")}</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {t("contact.connectIntro")}
            </p>

            {/* Contact Methods */}
            <div className="space-y-6 mb-8">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <method.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{method.title}</h3>
                    <a
                      href={method.href}
                      className="text-primary hover:text-primary/80 transition-colors mb-1 block"
                    >
                      {method.value}
                    </a>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">{t("contact.followMe")}</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.title}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`p-3 bg-muted/50 rounded-lg text-muted-foreground ${social.color} transition-all duration-300 hover:scale-110`}
                  >
                    <social.icon className="w-6 h-6" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Availability Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 p-6 bg-green-500/10 border border-green-500/20 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="font-semibold text-green-600">{t("contact.availability")}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("contact.availabilityDesc")}
              </p>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-card rounded-2xl border border-border p-8">
              <h2 className="text-2xl font-bold mb-6">{t("contact.sendMessage")}</h2>
              
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-600 font-medium">{error}</span>
                  </div>
                </motion.div>
              )}
              
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">{t("contact.sentTitle")}</h3>
                  <p className="text-muted-foreground">
                    {t("contact.sentDesc")}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        {t("contact.form.name")}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder={t("contact.form.namePlaceholder")}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        {t("contact.form.email")}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder={t("contact.form.emailPlaceholder")}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                      {t("contact.form.subject")}
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    >
                      <option value="">{t("contact.form.subjectSelect")}</option>
                      <option value="Project Inquiry">{t("contact.form.subjectOptions.project")}</option>
                      <option value="Collaboration">{t("contact.form.subjectOptions.collaboration")}</option>
                      <option value="Job Opportunity">{t("contact.form.subjectOptions.job")}</option>
                      <option value="Consultation">{t("contact.form.subjectOptions.consultation")}</option>
                      <option value="General Question">{t("contact.form.subjectOptions.general")}</option>
                      <option value="Other">{t("contact.form.subjectOptions.other")}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      {t("contact.form.message")}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                      placeholder={t("contact.form.messagePlaceholder")}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        {t("contact.form.sending")}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {t("contact.form.send")}
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t("contact.faqTitle")}</h2>
            <p className="text-muted-foreground">{t("contact.faqSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-3">What types of projects do you work on?</h3>
              <p className="text-muted-foreground text-sm">
                I specialize in AI/ML applications, data science projects, full-stack web development, 
                and cloud infrastructure. From small MVPs to large-scale production systems.
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-3">What's your typical project timeline?</h3>
              <p className="text-muted-foreground text-sm">
                Project timelines vary based on complexity. Simple projects can take 2-4 weeks, 
                while complex applications may take 2-6 months. I always provide detailed estimates upfront.
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-3">Do you work with international clients?</h3>
              <p className="text-muted-foreground text-sm">
                Absolutely! I work with clients worldwide and am comfortable with different time zones. 
                I use modern collaboration tools to ensure smooth communication.
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-3">What's your development process?</h3>
              <p className="text-muted-foreground text-sm">
                I follow an agile approach with regular check-ins, iterative development, and continuous 
                feedback. This ensures we stay aligned and deliver exactly what you need.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 