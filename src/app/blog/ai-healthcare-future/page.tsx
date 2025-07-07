"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Tag, Share2, Heart, Brain, Shield, Users, TrendingUp } from "lucide-react"

export default function BlogPost() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              AI
            </span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              January 10, 2024
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              12 min read
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            The Future of AI in Healthcare: Opportunities and Challenges
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Exploring the transformative potential of artificial intelligence in healthcare and the ethical considerations that come with it.
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold">H</span>
              </div>
              <div>
                <p className="font-medium text-foreground">HumbleBabs</p>
                <p className="text-sm text-muted-foreground">Data Scientist & AI Engineer</p>
              </div>
            </div>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="prose prose-lg max-w-none"
        >
          <div className="bg-card rounded-2xl border border-border p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Artificial intelligence is revolutionizing healthcare in unprecedented ways, from early disease detection 
              to personalized treatment plans. As we stand on the brink of a healthcare transformation, it's crucial 
              to understand both the immense opportunities and the significant challenges that lie ahead.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This article explores the current state of AI in healthcare, examines key applications, and discusses 
              the ethical, regulatory, and technical challenges that must be addressed for responsible AI adoption.
            </p>
          </div>

          <h2 className="text-3xl font-bold mb-6">Current AI Applications in Healthcare</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            AI is already making significant impacts across various healthcare domains:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Medical Imaging</h3>
              <p className="text-muted-foreground text-sm">
                AI-powered diagnostic tools for radiology, pathology, and dermatology with accuracy rates exceeding 95%.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Predictive Analytics</h3>
              <p className="text-muted-foreground text-sm">
                Early warning systems for patient deterioration and risk prediction for chronic diseases.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Personalized Medicine</h3>
              <p className="text-muted-foreground text-sm">
                Treatment optimization based on genetic profiles, medical history, and lifestyle factors.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Drug Discovery</h3>
              <p className="text-muted-foreground text-sm">
                Accelerated drug development through molecular modeling and clinical trial optimization.
              </p>
            </motion.div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Key Opportunities</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            The potential benefits of AI in healthcare are enormous:
          </p>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <div>
                <span className="text-muted-foreground">
                  <strong>Improved Diagnostic Accuracy:</strong> AI can analyze vast amounts of medical data to identify 
                  patterns that human doctors might miss, leading to earlier and more accurate diagnoses.
                </span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <div>
                <span className="text-muted-foreground">
                  <strong>Reduced Healthcare Costs:</strong> By automating routine tasks and improving efficiency, 
                  AI can significantly reduce healthcare costs while improving patient outcomes.
                </span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <div>
                <span className="text-muted-foreground">
                  <strong>Enhanced Patient Care:</strong> 24/7 monitoring capabilities and personalized treatment 
                  plans can lead to better patient experiences and outcomes.
                </span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <div>
                <span className="text-muted-foreground">
                  <strong>Global Healthcare Access:</strong> AI-powered telemedicine and diagnostic tools can 
                  bring quality healthcare to underserved populations worldwide.
                </span>
              </div>
            </li>
          </ul>

          <h2 className="text-3xl font-bold mb-6">Critical Challenges</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Despite the opportunities, significant challenges must be addressed:
          </p>

          <div className="bg-muted/30 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Ethical Considerations:</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-red-500/20 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">
                  !
                </div>
                <div>
                  <h4 className="font-semibold">Privacy and Data Security</h4>
                  <p className="text-sm text-muted-foreground">Protecting sensitive patient data while enabling AI analysis</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-red-500/20 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">
                  !
                </div>
                <div>
                  <h4 className="font-semibold">Bias and Fairness</h4>
                  <p className="text-sm text-muted-foreground">Ensuring AI systems work equally well for all patient populations</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-red-500/20 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">
                  !
                </div>
                <div>
                  <h4 className="font-semibold">Accountability</h4>
                  <p className="text-sm text-muted-foreground">Determining responsibility when AI systems make medical decisions</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Technical Challenges</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Implementing AI in healthcare requires addressing several technical hurdles:
          </p>

          <div className="space-y-6 mb-8">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-3">Data Quality and Interoperability</h3>
              <p className="text-muted-foreground leading-relaxed">
                Healthcare data is often fragmented across different systems and formats. Creating unified, 
                high-quality datasets for AI training requires significant data engineering efforts and 
                standardized protocols for data sharing.
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-3">Model Validation and Regulation</h3>
              <p className="text-muted-foreground leading-relaxed">
                AI models in healthcare must meet rigorous regulatory standards. The FDA and other regulatory 
                bodies are developing frameworks for AI/ML-based medical devices, requiring extensive 
                validation and clinical trials.
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-3">Integration with Existing Systems</h3>
              <p className="text-muted-foreground leading-relaxed">
                Healthcare organizations have complex, legacy IT systems. Integrating AI solutions requires 
                careful planning to ensure compatibility, security, and minimal disruption to clinical workflows.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">The Path Forward</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            To realize the full potential of AI in healthcare, we must:
          </p>

          <div className="bg-primary/5 rounded-xl p-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">Establish Robust Governance</h4>
                  <p className="text-sm text-muted-foreground">Create comprehensive frameworks for AI ethics, privacy, and accountability</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">Invest in Infrastructure</h4>
                  <p className="text-sm text-muted-foreground">Build secure, scalable platforms for AI deployment and data management</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">Foster Collaboration</h4>
                  <p className="text-sm text-muted-foreground">Encourage partnerships between healthcare providers, tech companies, and regulators</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold">Prioritize Human-Centered Design</h4>
                  <p className="text-sm text-muted-foreground">Ensure AI enhances rather than replaces human expertise and compassion</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Conclusion</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            The future of AI in healthcare holds immense promise for improving patient outcomes, reducing costs, 
            and expanding access to quality care. However, realizing this potential requires careful attention 
            to ethical considerations, robust technical implementation, and collaborative governance.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            As we move forward, it's essential to balance innovation with responsibility, ensuring that AI 
            serves as a tool to enhance human healthcare rather than replace it. The decisions we make today 
            will shape the healthcare landscape for generations to come.
          </p>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-border"
        >
          <div className="flex items-center gap-4 mb-4">
            <Tag className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium text-foreground">Tags:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {["AI", "Healthcare", "Ethics", "Innovation", "Medical Technology", "Digital Health"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-muted/50 rounded-full text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
} 