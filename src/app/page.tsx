'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  Brain, 
  Code, 
  Database, 
  Lightbulb, 
  Rocket, 
  Target, 
  Zap, 
  BookOpen, 
  Users, 
  Trophy, 
  CheckCircle,
  Menu,
  X
} from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 md:h-8 md:w-8 text-indigo-600" />
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Skillytics
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/mission-map">Curriculum</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="#features">Features</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="#missions">Missions</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/analytics">Analytics</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/dashboard">Start Learning</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              <Button variant="ghost" asChild onClick={() => setMobileMenuOpen(false)}>
                <Link href="/mission-map">Curriculum</Link>
              </Button>
              <Button variant="ghost" asChild onClick={() => setMobileMenuOpen(false)}>
                <Link href="#features">Features</Link>
              </Button>
              <Button variant="ghost" asChild onClick={() => setMobileMenuOpen(false)}>
                <Link href="#missions">Missions</Link>
              </Button>
              <Button variant="ghost" asChild onClick={() => setMobileMenuOpen(false)}>
                <Link href="/analytics">Analytics</Link>
              </Button>
              <Button asChild onClick={() => setMobileMenuOpen(false)}>
                <Link href="/dashboard">Start Learning</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="py-12 md:py-16 lg:py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-indigo-100 text-indigo-800 hover:bg-indigo-200 text-xs md:text-sm">
            <Zap className="w-3 h-3 mr-1" />
            AI/ML Mission-Based Learning
          </Badge>
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
            No Videos. No Lectures.
            <br className="hidden md:block" />
            <span className="md:hidden"> </span>
            320 Hands-On Missions.
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
            Master AI/ML through our comprehensive curriculum of 320 missions across 16 modules. 
            Fix, build, train, debug, and deploy models in real scenarios. Learn by doing, not by watching.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 w-full sm:w-auto" asChild>
              <Link href="/dashboard">
                Start Your First Mission
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="#missions">Explore Missions</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Core Philosophy */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">The Learning Philosophy</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              Traditional platforms teach theory. We build practitioners.
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6 lg:gap-8 px-2">
            {philosophyItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className={`text-xs md:text-sm font-semibold px-2 md:px-3 py-1 rounded-full ${item.color}`}>
                  {item.text}
                </span>
                {index < philosophyItems.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-gray-400 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Overview */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Complete AI/ML Curriculum</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              16 comprehensive modules • 320 hands-on missions • Zero fluff
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 md:gap-4 mb-6 md:mb-8 px-2">
            {[
              { name: 'Data Thinking', missions: '20 missions' },
              { name: 'Python ML', missions: '20 missions' },
              { name: 'Data Cleaning', missions: '20 missions' },
              { name: 'Supervised Learning', missions: '20 missions' },
              { name: 'Evaluation', missions: '20 missions' },
              { name: 'Feature Eng', missions: '20 missions' },
              { name: 'Unsupervised', missions: '20 missions' },
              { name: 'Optimization', missions: '20 missions' },
              { name: 'Deep Learning', missions: '20 missions' },
              { name: 'Computer Vision', missions: '20 missions' },
              { name: 'NLP', missions: '20 missions' },
              { name: 'Security & Ethics', missions: '20 missions' },
              { name: 'MLOps', missions: '20 missions' },
              { name: 'Testing', missions: '20 missions' },
              { name: 'Real Projects', missions: '20 missions' },
              { name: 'Career Mode', missions: '20 missions' },
            ].map((module, index) => (
              <div key={index} className="text-center p-2 md:p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-1 md:mb-2">
                  <span className="text-white text-xs md:text-sm font-bold">{index + 1}</span>
                </div>
                <div className="text-xs font-medium text-gray-700 leading-tight">{module.name}</div>
                <div className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">{module.missions}</div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Button size="lg" asChild>
              <Link href="/mission-map">
                Explore Full Curriculum
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Types */}
      <section id="missions" className="py-12 md:py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">8 Mission Types</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              Every mission mimics what ML engineers actually do in the real world.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {missionTypes.map((mission, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 md:pb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                    <mission.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  <CardTitle className="text-base md:text-lg">{mission.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs md:text-sm">
                    {mission.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12 md:py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Why Skillytics Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              Built different, because real ML skills are built differently.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center px-2">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <feature.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <h3 className="text-base md:text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm md:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">The Difference Is Clear</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              Stop consuming content. Start building skills.
            </p>
          </div>
          <div className="max-w-4xl mx-auto px-2">
            <div className="overflow-x-auto -mx-2 md:mx-0">
              <table className="w-full border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 md:p-4 text-sm md:text-base font-semibold">Platform</th>
                    <th className="text-left p-3 md:p-4 text-sm md:text-base font-semibold">Method</th>
                    <th className="text-left p-3 md:p-4 text-sm md:text-base font-semibold">Real Skills</th>
                    <th className="text-left p-3 md:p-4 text-sm md:text-base font-semibold">Job Ready</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr key={index} className={`border-b ${row.highlight ? 'bg-gradient-to-r from-indigo-50 to-purple-50' : 'hover:bg-gray-50'}`}>
                      <td className="p-3 md:p-4 font-medium text-sm md:text-base">{row.platform}</td>
                      <td className="p-3 md:p-4 text-gray-600 text-sm md:text-base">{row.method}</td>
                      <td className="p-3 md:p-4 text-sm md:text-base">{row.realSkills}</td>
                      <td className="p-3 md:p-4 text-sm md:text-base">{row.jobReady}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 lg:py-20 px-4 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">
            Ready to Build Real ML Skills?
          </h2>
          <p className="text-sm md:text-lg text-indigo-100 mb-6 md:mb-8 max-w-2xl mx-auto px-2">
            Join thousands of learners who are skipping the theory and diving straight into 
            real-world ML problem solving.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/dashboard">
              Start Your First Mission Now
              <Rocket className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 md:py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <Brain className="h-5 w-5 md:h-6 md:w-6 text-indigo-400" />
                <span className="text-lg md:text-xl font-bold">Skillytics</span>
              </div>
              <p className="text-gray-400 text-sm">
                Learn AI/ML by doing real missions, not watching videos.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Platform</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/missions" className="hover:text-white transition-colors">Missions</Link></li>
                <li><Link href="/analytics" className="hover:text-white transition-colors">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Learning</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/skill-tree" className="hover:text-white transition-colors">Skill Tree</Link></li>
                <li><Link href="/career" className="hover:text-white transition-colors">Career Mode</Link></li>
                <li><Link href="/portfolio" className="hover:text-white transition-colors">Portfolio</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 md:pt-8 text-center text-gray-400 text-xs md:text-sm">
            <p>&copy; 2024 Skillytics. Build real skills, not fake certificates.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const philosophyItems = [
  { text: 'Problem', color: 'bg-indigo-100 text-indigo-800' },
  { text: 'Data', color: 'bg-purple-100 text-purple-800' },
  { text: 'Model', color: 'bg-pink-100 text-pink-800' },
  { text: 'Mistake', color: 'bg-red-100 text-red-800' },
  { text: 'Fix', color: 'bg-orange-100 text-orange-800' },
  { text: 'Insight', color: 'bg-green-100 text-green-800' },
]

const missionTypes = [
  {
    icon: Code,
    title: "Model Debug",
    description: "Fix broken models, patch data leaks, and improve performance"
  },
  {
    icon: Database,
    title: "Data Quality",
    description: "Clean messy data, handle outliers, and balance datasets"
  },
  {
    icon: Brain,
    title: "Algorithm Selection",
    description: "Choose the right algorithm for the right problem"
  },
  {
    icon: Target,
    title: "Training & Optimization",
    description: "Tune hyperparameters and optimize model performance"
  },
  {
    icon: Lightbulb,
    title: "Math-in-Code",
    description: "Learn ML math through practical code implementation"
  },
  {
    icon: Trophy,
    title: "Evaluation Metrics",
    description: "Master the art of measuring model performance"
  },
  {
    icon: Users,
    title: "ML Security & Ethics",
    description: "Handle bias, privacy, and security in real ML systems"
  },
  {
    icon: Rocket,
    title: "Deployment",
    description: "Deploy models to production and handle real-world issues"
  }
]

const features = [
  {
    icon: Target,
    title: "Real-World Missions",
    description: "Every mission is based on actual ML engineering challenges, not textbook examples."
  },
  {
    icon: Lightbulb,
    title: "AI Mentor System",
    description: "Get contextual hints that guide you to solutions without giving away answers."
  },
  {
    icon: CheckCircle,
    title: "Validation Engine",
    description: "Know immediately if your solution works with comprehensive automated testing."
  },
  {
    icon: BookOpen,
    title: "Skill Tree Progression",
    description: "Follow a structured path from beginner to advanced ML engineer."
  },
  {
    icon: Trophy,
    title: "Career Mode",
    description: "Build a portfolio of real projects that impress employers."
  },
  {
    icon: Users,
    title: "Industry Ready",
    description: "Graduate with the exact skills companies are hiring for right now."
  }
]

const comparisonData = [
  { platform: 'Coursera', method: 'Videos', realSkills: '❌', jobReady: '❌', highlight: false },
  { platform: 'Udemy', method: 'Tutorials', realSkills: '❌', jobReady: '❌', highlight: false },
  { platform: 'Codecademy', method: 'Syntax', realSkills: '❌', jobReady: '❌', highlight: false },
  { platform: 'Skillytics', method: 'Real ML Problem-Solving', realSkills: '✅', jobReady: '✅', highlight: true },
]
