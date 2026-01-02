'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Brain, Code, Database, Lightbulb, Rocket, Target, Zap, BookOpen, Users, Trophy, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Skillytics
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="#features">Features</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="#missions">Missions</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="#about">About</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">Start Learning</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
            <Zap className="w-3 h-3 mr-1" />
            AI/ML Mission-Based Learning
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            No Videos. No Lectures.
            <br />
            Only Missions.
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Master AI/ML by fixing, building, training, debugging, and deploying models in real scenarios. 
            Learn by doing, not by watching.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" asChild>
              <Link href="/dashboard">
                Start Your First Mission
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#missions">Explore Missions</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Core Philosophy */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The Learning Philosophy</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Traditional platforms teach theory. We build practitioners.
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">Problem</span>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">Data</span>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
              <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full">Model</span>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">Mistake</span>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">Fix</span>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">Insight</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Types */}
      <section id="missions" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">8 Mission Types</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every mission mimics what ML engineers actually do in the real world.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {missionTypes.map((mission, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <mission.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{mission.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {mission.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Skillytics Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Built different, because real ML skills are built differently.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The Difference Is Clear</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stop consuming content. Start building skills.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Platform</th>
                    <th className="text-left p-4">Method</th>
                    <th className="text-left p-4">Real Skills</th>
                    <th className="text-left p-4">Job Ready</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">Coursera</td>
                    <td className="p-4 text-gray-600">Videos</td>
                    <td className="p-4">❌</td>
                    <td className="p-4">❌</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">Udemy</td>
                    <td className="p-4 text-gray-600">Tutorials</td>
                    <td className="p-4">❌</td>
                    <td className="p-4">❌</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">Codecademy</td>
                    <td className="p-4 text-gray-600">Syntax</td>
                    <td className="p-4">❌</td>
                    <td className="p-4">❌</td>
                  </tr>
                  <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
                    <td className="p-4 font-bold text-indigo-600">Skillytics</td>
                    <td className="p-4 font-medium text-indigo-600">Real ML Problem-Solving</td>
                    <td className="p-4">✅</td>
                    <td className="p-4">✅</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Build Real ML Skills?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are skipping the theory and diving straight into 
            real-world ML problem solving.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/dashboard">
              Start Your First Mission Now
              <Rocket className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-6 w-6 text-indigo-400" />
                <span className="text-xl font-bold">Skillytics</span>
              </div>
              <p className="text-gray-400">
                Learn AI/ML by doing real missions, not watching videos.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
                <li><Link href="/missions" className="hover:text-white">Missions</Link></li>
                <li><Link href="/analytics" className="hover:text-white">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Learning</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/skill-tree" className="hover:text-white">Skill Tree</Link></li>
                <li><Link href="/career" className="hover:text-white">Career Mode</Link></li>
                <li><Link href="/portfolio" className="hover:text-white">Portfolio</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Skillytics. Build real skills, not fake certificates.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

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