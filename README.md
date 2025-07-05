# 🚀 HumbleBabs Portfolio

> **Full-Stack Developer & AI Engineer** | Building innovative digital experiences with cutting-edge technologies

[![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.23-0055FF?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

---

## 🎯 About This Portfolio

Welcome to my digital playground! This portfolio showcases my journey as a **Data Scientist & AI Engineer**, featuring innovative projects, technical insights, and a passion for transforming data into actionable solutions.

### 🌟 What You'll Discover

- **🤖 AI & Machine Learning Projects** - From predictive analytics to computer vision
- **☁️ Cloud Computing Solutions** - Scalable architectures on AWS, Azure, and GCP  
- **📊 Data Science Applications** - Interactive dashboards and real-time analytics
- **💻 Full-Stack Development** - Modern web applications with React and Node.js
- **📝 Technical Blog** - Deep dives into ML, cloud computing, and development
- **🎨 Interactive Experience** - Smooth animations and responsive design

---

## ✨ Key Features

### 🎨 **Modern Design System**
- **Dark/Light Theme** - Automatic theme switching with system preference detection
- **Responsive Layout** - Optimized for desktop, tablet, and mobile devices
- **Smooth Animations** - Framer Motion powered micro-interactions
- **Glassmorphism Effects** - Modern UI with backdrop blur and transparency

### 📱 **Interactive Components**
- **Dynamic Navigation** - Smart navbar with scroll effects and mobile menu
- **Project Showcase** - Detailed case studies with live demos and code links
- **Blog Platform** - Technical articles with syntax highlighting and sharing
- **Contact Integration** - Multi-channel communication options

### 🚀 **Performance Optimized**
- **Next.js 15** - Latest features with App Router and Server Components
- **TypeScript** - Type-safe development for better code quality
- **Tailwind CSS v4** - Utility-first styling with custom design tokens
- **SEO Optimized** - Meta tags, structured data, and performance metrics

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) for type safety
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom design system
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for smooth interactions
- **Icons**: [Lucide React](https://lucide.dev/) for consistent iconography

### **Backend & Infrastructure**
- **Runtime**: [Node.js](https://nodejs.org/) with modern ES modules
- **Content**: [MDX](https://mdxjs.com/) for rich blog posts and documentation
- **Deployment**: [Vercel](https://vercel.com/) for optimal performance
- **Analytics**: Built-in performance monitoring and user insights

### **Development Tools**
- **Package Manager**: [npm](https://www.npmjs.com/) with lockfile
- **Linting**: [ESLint](https://eslint.org/) with Next.js configuration
- **Formatting**: [Prettier](https://prettier.io/) for consistent code style
- **Type Checking**: TypeScript compiler with strict mode

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ 
- npm or yarn package manager

### **Installation**

```bash
# Clone the repository
git clone https://github.com/HumbledDS/humblebabs-portfolio.git
cd humblebabs-portfolio

# Install dependencies
npm install

# Start development server
npm run dev

# Open your browser
open http://localhost:3000
```

### **Available Scripts**

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint for code quality

# Content Management
npm run content:dev  # Start content development server
npm run content:build # Build content for production
```

---

## 📁 Project Structure

```
humblebabs/
├── 📂 src/
│   ├── 📂 app/                    # Next.js App Router pages
│   │   ├── 📄 page.tsx           # Homepage with hero and featured content
│   │   ├── 📂 about/             # About page with experience and skills
│   │   ├── 📂 projects/          # Projects showcase and detailed views
│   │   ├── 📂 blog/              # Blog platform with articles
│   │   ├── 📂 resume/            # Interactive resume page
│   │   ├── 📂 contact/           # Contact form and information
│   │   └── 📄 layout.tsx         # Root layout with navigation
│   ├── 📂 components/            # Reusable React components
│   │   ├── 📂 layout/            # Header, footer, and layout components
│   │   ├── 📂 ui/                # Design system components
│   │   └── 📂 sections/          # Page-specific sections
│   ├── 📂 content/               # MDX content and assets
│   │   ├── 📂 blog/              # Blog posts in MDX format
│   │   └── 📂 projects/          # Project documentation
│   ├── 📂 lib/                   # Utility functions and helpers
│   └── 📂 types/                 # TypeScript type definitions
├── 📂 public/                    # Static assets and images
├── 📄 tailwind.config.ts         # Tailwind CSS configuration
├── 📄 next.config.mjs            # Next.js configuration
└── 📄 package.json               # Dependencies and scripts
```

---

## 🎨 Customization Guide

### **Theme & Colors**
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        // Add your custom colors here
      }
    }
  }
}
```

### **Content Management**
- **Blog Posts**: Add MDX files in `src/content/blog/`
- **Projects**: Create project pages in `src/app/projects/`
- **Components**: Extend the design system in `src/components/ui/`

### **Deployment**
```bash
# Deploy to Vercel
npm run build
vercel --prod

# Or use Vercel CLI for automatic deployments
vercel
```

---

## 🌟 Featured Projects

### **🤖 AI-Powered Analytics Dashboard**
- **Tech Stack**: React, Python, TensorFlow, AWS
- **Features**: Real-time ML predictions, interactive visualizations
- **Live Demo**: [View Project](https://analytics.humblebabs.com)

### **☁️ Cloud ML Pipeline**
- **Tech Stack**: AWS, Docker, Python, MLflow
- **Features**: Automated model training and deployment
- **Status**: Open Source on GitHub

### **📊 Data Visualization Suite**
- **Tech Stack**: Vue.js, D3.js, WebSocket, Node.js
- **Features**: Real-time data exploration and collaboration
- **Status**: Beta Release

---

## 📝 Blog Highlights

### **Latest Articles**
- [Building Scalable ML Pipelines with Apache Airflow](/blog/building-scalable-ml-pipelines)
- [The Future of AI in Healthcare: Opportunities and Challenges](/blog/ai-healthcare-future)
- [Optimizing React Performance: A Deep Dive](/blog/optimizing-react-performance)

---

## 🤝 Let's Connect

I'm always excited to collaborate on interesting projects and share knowledge with the community!

### **📧 Get In Touch**
- **Email**: [hello@humblebabs.com](mailto:hello@humblebabs.com)
- **LinkedIn**: [HumbleBabs](https://linkedin.com/in/humblebabs)
- **GitHub**: [@HumbledDS](https://github.com/HumbledDS)
- **Portfolio**: [humblebabs.com](https://humblebabs.com)

### **💼 Available For**
- **Freelance Projects** - AI/ML development and consulting
- **Open Source** - Contributing to interesting projects
- **Speaking** - Tech talks and workshops
- **Mentoring** - Helping developers grow their skills

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ and lots of ☕ by [HumbleBabs](https://humblebabs.com)**

[![GitHub stars](https://img.shields.io/github/stars/HumbledDS/humblebabs-portfolio?style=social)](https://github.com/HumbledDS/humblebabs-portfolio)
[![GitHub forks](https://img.shields.io/github/forks/HumbledDS/humblebabs-portfolio?style=social)](https://github.com/HumbledDS/humblebabs-portfolio)

</div>
