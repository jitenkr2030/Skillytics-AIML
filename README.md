# 🧠 Skillytics - AI/ML Mission-Based Learning System

A revolutionary platform that teaches AI/ML through hands-on missions instead of videos. Learn by fixing, building, training, debugging, and deploying models in real-world scenarios.

## 🎯 Core Philosophy

**Problem → Data → Model → Mistake → Fix → Insight**

No videos. No lectures. Only missions that mimic what ML engineers actually do in the real world.

## ✨ Features

### 🚀 Mission-Based Learning
- **8 Mission Types**: Model Debug, Data Quality, Algorithm Selection, Math-in-Code, Training Optimization, Evaluation Metrics, ML Security & Ethics, Deployment
- **Real-World Scenarios**: Every mission is based on actual ML engineering challenges
- **Progressive Difficulty**: From beginner to expert with structured skill tree
- **Hands-On Coding**: Write real Python code to solve actual ML problems

### 🤖 AI Mentor System
- **Progressive Hints**: Get contextual guidance without giving away answers
- **Smart Feedback**: Understand what went wrong and how to fix it
- **Learning Paths**: Personalized recommendations based on your progress

### 📊 Comprehensive Analytics
- **Skill Profiling**: Track your strengths and improvement areas
- **Progress Tracking**: Monitor completion rates and learning patterns
- **Achievement System**: Unlock badges and showcase your expertise
- **Career Portfolio**: Build a real portfolio of ML projects

### 🎨 Modern UI/UX
- **Mobile-First Design**: Learn on any device, anywhere
- **PWA Ready**: Install as a native app on mobile devices
- **Dark/Light Mode**: Comfortable learning in any environment
- **Responsive Code Editor**: Write and test code directly in your browser

## 🛠 Technology Stack

### Frontend
- **⚡ Next.js 15** - React framework with App Router
- **📘 TypeScript 5** - Type-safe development
- **🎨 Tailwind CSS 4** - Modern utility-first styling
- **🧩 shadcn/ui** - Beautiful, accessible components
- **🌈 Framer Motion** - Smooth animations and interactions

### Backend
- **🗄️ Prisma ORM** - Type-safe database operations
- **🔍 SQLite** - Lightweight, reliable database
- **🚀 z-ai-web-dev-sdk** - AI-powered features and validation
- **📊 Analytics Engine** - Comprehensive learning analytics

### Infrastructure
- **📱 PWA Support** - Native app experience
- **🔒 Secure APIs** - Protected backend endpoints
- **📈 Real-time Updates** - Live progress tracking
- **🌐 CDN Ready** - Optimized asset delivery

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Set up the database
bun run db:push

# Seed sample data
bun prisma/seed.js

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to start your ML learning journey!

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # Backend API routes
│   │   ├── missions/      # Mission management
│   │   ├── modules/       # Skill modules
│   │   ├── progress/      # User progress
│   │   └── submissions/   # Code submissions
│   ├── dashboard/         # Learning dashboard
│   ├── mission/           # Mission interface
│   └── page.tsx          # Landing page
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utilities and configurations
│   ├── db.ts            # Database client
│   ├── utils.ts         # Helper functions
│   └── validation.ts    # Code validation engine
├── hooks/               # Custom React hooks
└── prisma/              # Database schema and seeds
```

## 🎮 Mission Types

### 1. 🐛 Model Debug Missions
- Fix broken models with data leakage
- Improve poor performance in production
- Debug training issues and convergence problems

### 2. 📊 Data Quality Missions
- Handle missing values and outliers
- Clean messy real-world datasets
- Balance imbalanced data distributions

### 3. 🧠 Algorithm Selection Missions
- Choose the right algorithm for specific problems
- Compare model performance and trade-offs
- Justify your choices with evidence

### 4. 🧮 Math-in-Code Missions
- Fix gradient descent issues
- Resolve vanishing/exploding gradients
- Implement mathematical concepts in code

### 5. ⚙️ Training & Optimization Missions
- Tune hyperparameters for better performance
- Optimize training speed and efficiency
- Handle convergence and stability issues

### 6. 📈 Evaluation & Metrics Missions
- Choose appropriate evaluation metrics
- Interpret confusion matrices and ROC curves
- Fix misleading accuracy measurements

### 7. 🔐 ML Security & Ethics Missions
- Detect and mitigate model bias
- Handle data privacy concerns
- Identify potential security vulnerabilities

### 8. 🚀 Deployment Missions
- Deploy models as production APIs
- Handle latency and scalability issues
- Monitor model drift and performance

## 🔧 API Endpoints

### Missions
- `GET /api/missions` - List available missions
- `POST /api/missions` - Create new mission
- `GET /api/missions/:id` - Get mission details

### Progress
- `GET /api/progress` - Get user progress
- `POST /api/progress` - Update mission progress

### Submissions
- `POST /api/submissions` - Submit code for validation
- `GET /api/submissions/:id` - Get submission results

### Modules
- `GET /api/modules` - List skill modules
- `POST /api/modules` - Create new module

## 🎯 Learning Path

1. **Data Thinking for ML** - Learn to think like an ML engineer
2. **Python for ML** - Master essential libraries (NumPy, Pandas, Scikit-learn)
3. **Data Cleaning & EDA** - Handle real-world data challenges
4. **Supervised Learning** - Build your first predictive models
5. **Model Evaluation** - Master the art of measuring performance
6. **Feature Engineering** - Create powerful model features
7. **Unsupervised Learning** - Discover patterns in unlabeled data
8. **Deep Learning Basics** - Introduction to neural networks
9. **Advanced Topics** - CNNs, NLP, Reinforcement Learning
10. **MLOps Fundamentals** - Deploy and maintain models
11. **ML Security & Ethics** - Responsible AI development
12. **Career Mode** - Build your professional portfolio

## 🏆 Achievements

- **First Bug Fix** - Successfully debug your first model
- **Data Cleaning Pro** - Complete 5 data quality missions
- **Algorithm Expert** - Master algorithm selection
- **7-Day Streak** - Maintain consistent learning habits
- **Speed Runner** - Complete missions under time pressure
- **Perfect Score** - Achieve 100% on difficult missions

## 📱 Mobile App

Skillytics is built as a Progressive Web App (PWA) and works seamlessly on:

- 📱 **iOS Devices** - Install as a native app from Safari
- 🤖 **Android Devices** - Install from Chrome browser
- 💻 **Desktop** - Full-featured web experience
- 📟 **Tablets** - Optimized for touch interfaces

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Create New Missions** - Add interesting ML challenges
2. **Improve Validation** - Enhance the code validation engine
3. **Fix Bugs** - Report and fix issues
4. **Add Features** - Suggest and implement new learning tools
5. **Documentation** - Improve guides and tutorials

## 📚 Resources

- [Mission Creation Guide](./docs/mission-creation.md)
- [API Documentation](./docs/api.md)
- [Learning Path Overview](./docs/learning-path.md)
- [Contributing Guidelines](./docs/contributing.md)

## 🚀 Why Skillytics Works

Traditional platforms teach theory. We build practitioners.

| Platform | Method | Real Skills | Job Ready |
|----------|--------|-------------|-----------|
| Coursera | Videos | ❌ | ❌ |
| Udemy | Tutorials | ❌ | ❌ |
| Codecademy | Syntax | ❌ | ❌ |
| **Skillytics** | **Real ML Problem-Solving** | ✅ | ✅ |

Stop consuming content. Start building skills that matter.

---

🧠 **Build real ML skills, not fake certificates.**

🚀 **Ready to start your journey?** Visit [localhost:3000](http://localhost:3000) and dive into your first mission!