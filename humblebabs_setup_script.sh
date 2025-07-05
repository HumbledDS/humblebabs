#!/bin/bash

# HumbleBabs Portfolio Setup Script
# Run this from your humblebabs directory
#npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
#npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx framer-motion lucide-react next-themes gray-matter reading-time react-hook-form @hookform/resolvers zod date-fns clsx tailwind-merge @tailwindcss/typography @tailwindcss/forms
#mkdir -p components/{ui,layout,sections,blog} content/{blog,projects} lib types public/images
#cat > tailwind.config.ts << 'EOF'
#cat > next.config.mjs << 'EOF'
#cat > types/index.ts << 'EOF'
#cat > lib/utils.ts << 'EOF'
#cat > content/blog/welcome-to-humblebabs.mdx << 'EOF'
#cat > content/projects/ml-customer-segmentation.mdx << 'EOF'
set -e

echo "🚀 Setting up HumbleBabs Portfolio..."

# Check if we're in the right directory
if [ ! -d ".git" ]; then
    echo "❌ Not in a git repository. Make sure you're in the humblebabs directory."
    exit 1
fi

echo "✅ Git repository detected"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "📦 Initializing Next.js project in current directory..."
    npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
else
    echo "📦 package.json found, checking if it's Next.js..."
    if grep -q "next" package.json; then
        echo "✅ Next.js project detected"
    else
        echo "⚠️  Existing package.json found but not Next.js. You may need to backup and reinitialize."
    fi
fi

echo "📋 Installing HumbleBabs dependencies..."

# Install portfolio-specific dependencies
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
npm install framer-motion lucide-react next-themes
npm install gray-matter reading-time
npm install react-hook-form @hookform/resolvers zod
npm install date-fns clsx tailwind-merge
npm install -D @tailwindcss/typography @tailwindcss/forms prettier prettier-plugin-tailwindcss

echo "📁 Creating HumbleBabs project structure..."

# Create directory structure
mkdir -p components/{ui,layout,sections,blog}
mkdir -p content/{blog,projects}
mkdir -p lib types public/images

# Create initial files
echo "⚙️ Setting up configuration files..."

# Enhanced Tailwind config for HumbleBabs
cat > tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
export default config
EOF

# Next.js config with MDX
cat > next.config.mjs << 'EOF'
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  experimental: {
    mdxRs: true,
  },
  images: {
    domains: ['images.unsplash.com', 'github.com', 'avatars.githubusercontent.com'],
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
EOF

# Types for HumbleBabs
cat > types/index.ts << 'EOF'
export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  tags: string[]
  readingTime: string
  author?: string
}

export interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  demoUrl?: string
  githubUrl?: string
  category: 'ai' | 'cloud' | 'data' | 'web' | 'ml'
  featured?: boolean
  status: 'completed' | 'in-progress' | 'planning'
}

export interface Experience {
  company: string
  position: string
  duration: string
  description: string
  technologies: string[]
  location?: string
}

export interface Skill {
  name: string
  level: number // 1-5
  category: 'programming' | 'tools' | 'cloud' | 'data' | 'ai'
}
EOF

# Utility functions
cat > lib/utils.ts << 'EOF'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}
EOF

# Create first blog post
cat > content/blog/welcome-to-humblebabs.mdx << 'EOF'
---
title: "Welcome to HumbleBabs - My Data Science Journey"
date: "2024-07-03"
excerpt: "Introduction to my portfolio and what you can expect to find here - data science, AI, and cloud computing insights."
tags: ["introduction", "data-science", "ai", "cloud"]
author: "HumbleBabs"
---

# Welcome to My Digital Space 👋

Hello! I'm excited to share my journey in data science, artificial intelligence, and cloud computing through this portfolio website.

## What You'll Find Here

### 🧠 AI & Machine Learning Projects
Deep dives into my machine learning experiments, from predictive models to neural networks and everything in between.

### ☁️ Cloud Computing Adventures  
My experiences with AWS, Azure, and GCP - building scalable data pipelines and deploying ML models in the cloud.

### 📊 Data Science Insights
Real-world data analysis projects, visualization techniques, and the stories hidden in data.

### 💭 Technical Blog
Tutorials, lessons learned, and insights from my professional journey in the data world.

## My Philosophy

I believe in **humble** learning - staying curious, admitting what I don't know, and always being ready to learn something new. That's where "HumbleBabs" comes from!

## Let's Connect

Feel free to explore my projects, read my thoughts, and reach out if you'd like to collaborate or just chat about data science!

*Happy exploring!* 🚀
EOF

# Create sample project
cat > content/projects/ml-customer-segmentation.mdx << 'EOF'
---
title: "Customer Segmentation with Machine Learning"
description: "Advanced customer segmentation using clustering algorithms and behavioral analysis"
image: "/images/projects/customer-segmentation.jpg"
technologies: ["Python", "Scikit-learn", "Pandas", "Plotly", "K-means"]
githubUrl: "https://github.com/HumbledDS/customer-segmentation"
category: "ml"
featured: true
status: "completed"
---

# Customer Segmentation with Machine Learning

A comprehensive analysis of customer behavior patterns using unsupervised learning techniques to identify distinct customer segments for targeted marketing strategies.

## Project Overview

This project applies machine learning clustering algorithms to customer transaction data to identify meaningful customer segments based on purchasing behavior, demographics, and engagement patterns.

## Key Features

- **Data Preprocessing**: Comprehensive cleaning and feature engineering
- **Clustering Analysis**: K-means, DBSCAN, and Hierarchical clustering
- **Visualization**: Interactive plots and customer journey mapping
- **Business Insights**: Actionable recommendations for each segment

## Technologies Used

- **Python**: Core programming language
- **Scikit-learn**: Machine learning algorithms
- **Pandas & NumPy**: Data manipulation and analysis
- **Plotly**: Interactive visualizations
- **Jupyter**: Development environment

## Results

Identified 5 distinct customer segments with 85% silhouette score, leading to 23% improvement in targeted campaign effectiveness.
EOF

# Environment template
cat > .env.local.example << 'EOF'
# Database (optional - for contact forms and analytics)
DATABASE_URL=

# Email service (for contact form)
RESEND_API_KEY=

# Analytics
NEXT_PUBLIC_GA_ID=
VERCEL_ANALYTICS_ID=

# GitHub (for project integration)
GITHUB_TOKEN=
GITHUB_USERNAME=HumbledDS
EOF

# Update README for HumbleBabs
cat > README.md << 'EOF'
# HumbleBabs Portfolio 🚀

Welcome to my personal portfolio website showcasing my journey in Data Science, AI, and Cloud Computing.

## 🌟 Features

- **Modern Design**: Clean, responsive interface with dark/light theme
- **Project Showcase**: Detailed case studies of my data science and AI projects  
- **Technical Blog**: Insights, tutorials, and lessons learned
- **Interactive Resume**: My professional journey and skills
- **Contact Integration**: Easy ways to connect and collaborate

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Content**: MDX for blog posts and project documentation
- **Animations**: Framer Motion for smooth interactions
- **Deployment**: Vercel for optimal performance

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
humblebabs/
├── app/                 # Next.js app router pages
├── components/          # Reusable React components
├── content/            # MDX content (blog posts, projects)
├── lib/                # Utility functions
├── public/             # Static assets
└── types/              # TypeScript type definitions
```

## 🎨 Customization

The portfolio is built with modularity in mind:

- **Colors**: Customize theme in `tailwind.config.ts`
- **Content**: Add projects and blog posts in `/content`
- **Components**: Modular design system in `/components`

## 📊 Focus Areas

- **Data Science**: Analytics, visualization, and insights
- **Machine Learning**: Model development and deployment
- **Cloud Computing**: Scalable data solutions
- **AI Applications**: Practical AI implementations

## 🤝 Contributing

This is a personal portfolio, but suggestions and feedback are welcome!

## 📫 Connect

- **GitHub**: [@HumbledDS](https://github.com/HumbledDS)
- **LinkedIn**: [Your LinkedIn]
- **Email**: [Your Email]

---

Built with ❤️ and lots of ☕ by HumbleBabs
EOF

echo "✅ HumbleBabs portfolio setup complete!"
echo ""
echo "🎉 Ready to start building!"
echo ""
echo "Next steps:"
echo "1. npm run dev"
echo "2. Open http://localhost:3000"
echo "3. Start customizing your content!"
echo ""
echo "📂 Your project structure:"
echo "   └── humblebabs/"
echo "       ├── app/           # Your pages"
echo "       ├── components/    # UI components"  
echo "       ├── content/       # Blog & projects"
echo "       └── lib/           # Utilities"
echo ""
echo "🎨 Ready to customize:"
echo "   - Update content/blog/ with your posts"
echo "   - Add projects to content/projects/"
echo "   - Personalize components with your info"
echo ""
echo "Happy coding, HumbleBabs! 🚀"