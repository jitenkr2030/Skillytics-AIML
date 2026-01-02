'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  Code, 
  Database, 
  Target, 
  Trophy, 
  Zap, 
  BookOpen, 
  TrendingUp,
  Clock,
  Star,
  Lock,
  Play,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const [userStats, setUserStats] = useState({
    level: 1,
    totalPoints: 0,
    streak: 0,
    missionsCompleted: 0,
    currentModule: 'Data Thinking for ML',
    completionRate: 0
  })

  const [recentMissions, setRecentMissions] = useState([
    {
      id: '1',
      title: 'Why Is This Fraud Model Failing?',
      type: 'MODEL_DEBUG',
      difficulty: 'INTERMEDIATE',
      status: 'COMPLETED',
      score: 92,
      timeSpent: 45,
      completedAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Clean This Customer Dataset',
      type: 'DATA_QUALITY',
      difficulty: 'BEGINNER',
      status: 'IN_PROGRESS',
      score: 0,
      timeSpent: 20,
      completedAt: null
    }
  ])

  const [skillModules] = useState([
    {
      id: '1',
      title: 'Data Thinking for ML',
      description: 'Learn to think like an ML engineer about data',
      icon: Database,
      color: 'bg-blue-500',
      progress: 100,
      isLocked: false,
      missionsCount: 8,
      completedMissions: 8
    },
    {
      id: '2',
      title: 'Python for ML',
      description: 'Master NumPy, Pandas, and ML libraries',
      icon: Code,
      color: 'bg-green-500',
      progress: 75,
      isLocked: false,
      missionsCount: 12,
      completedMissions: 9
    },
    {
      id: '3',
      title: 'Data Cleaning & EDA',
      description: 'Clean messy data and find insights',
      icon: Database,
      color: 'bg-purple-500',
      progress: 30,
      isLocked: false,
      missionsCount: 10,
      completedMissions: 3
    },
    {
      id: '4',
      title: 'Supervised Learning',
      description: 'Build your first predictive models',
      icon: Brain,
      color: 'bg-orange-500',
      progress: 0,
      isLocked: true,
      missionsCount: 15,
      completedMissions: 0
    },
    {
      id: '5',
      title: 'Model Evaluation',
      description: 'Learn to measure model performance',
      icon: Trophy,
      color: 'bg-red-500',
      progress: 0,
      isLocked: true,
      missionsCount: 8,
      completedMissions: 0
    }
  ])

  const [upcomingMissions] = useState([
    {
      id: '3',
      title: 'Fix This Overfitting Neural Network',
      type: 'MODEL_DEBUG',
      difficulty: 'ADVANCED',
      estimatedTime: 60,
      points: 150,
      moduleId: '4'
    },
    {
      id: '4',
      title: 'Balance This Imbalanced Dataset',
      type: 'DATA_QUALITY',
      difficulty: 'INTERMEDIATE',
      estimatedTime: 45,
      points: 120,
      moduleId: '3'
    }
  ])

  const getMissionIcon = (type: string) => {
    switch (type) {
      case 'MODEL_DEBUG': return Code
      case 'DATA_QUALITY': return Database
      case 'ALGORITHM_SELECTION': return Brain
      case 'TRAINING_OPTIMIZATION': return Target
      case 'EVALUATION_METRICS': return Trophy
      default: return Brain
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'bg-green-100 text-green-800'
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800'
      case 'ADVANCED': return 'bg-orange-100 text-orange-800'
      case 'EXPERT': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-indigo-600" />
              <span className="text-xl font-bold">Skillytics</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Trophy className="h-4 w-4 mr-2" />
              {userStats.totalPoints} pts
            </Button>
            <Button variant="ghost" size="sm">
              <Zap className="h-4 w-4 mr-2" />
              {userStats.streak} day streak
            </Button>
            <Button variant="outline" size="sm">
              Profile
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Learner!</h1>
          <p className="text-gray-600">
            Ready to continue your journey to becoming an ML engineer?
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Level</p>
                  <p className="text-2xl font-bold">{userStats.level}</p>
                </div>
                <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Points</p>
                  <p className="text-2xl font-bold">{userStats.totalPoints}</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Streak</p>
                  <p className="text-2xl font-bold">{userStats.streak} days</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Missions</p>
                  <p className="text-2xl font-bold">{userStats.missionsCompleted}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Skill Tree */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Your Learning Path
                </CardTitle>
                <CardDescription>
                  Follow the skill tree to master ML engineering
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skillModules.map((module, index) => {
                    const Icon = module.icon
                    return (
                      <div key={module.id} className="flex items-center gap-4 p-4 rounded-lg border bg-white">
                        <div className={`h-12 w-12 ${module.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          {module.isLocked ? (
                            <Lock className="h-6 w-6 text-white" />
                          ) : (
                            <Icon className="h-6 w-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{module.title}</h3>
                            {module.isLocked && (
                              <Badge variant="secondary" className="text-xs">
                                <Lock className="h-3 w-3 mr-1" />
                                Locked
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                            <span>{module.completedMissions}/{module.missionsCount} missions</span>
                            <span>{module.progress}% complete</span>
                          </div>
                          <Progress value={module.progress} className="h-2" />
                        </div>
                        <Button 
                          size="sm" 
                          disabled={module.isLocked}
                          className="flex-shrink-0"
                        >
                          {module.isLocked ? (
                            'Locked'
                          ) : module.progress === 100 ? (
                            'Review'
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-1" />
                              Continue
                            </>
                          )}
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMissions.map((mission) => {
                    const Icon = getMissionIcon(mission.type)
                    return (
                      <div key={mission.id} className="flex items-start gap-3">
                        <div className="h-8 w-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <Icon className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{mission.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`text-xs ${getDifficultyColor(mission.difficulty)}`}>
                              {mission.difficulty}
                            </Badge>
                            {mission.status === 'COMPLETED' ? (
                              <Badge variant="outline" className="text-xs text-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {mission.score}%
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {mission.timeSpent}m
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Recommended Next
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingMissions.map((mission) => {
                    const Icon = getMissionIcon(mission.type)
                    return (
                      <div key={mission.id} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                            <Icon className="h-4 w-4 text-orange-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm mb-1">{mission.title}</h4>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={`text-xs ${getDifficultyColor(mission.difficulty)}`}>
                                {mission.difficulty}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                <Clock className="h-3 w-3 inline mr-1" />
                                {mission.estimatedTime}m
                              </span>
                              <span className="text-xs text-gray-500">
                                <Trophy className="h-3 w-3 inline mr-1" />
                                {mission.points} pts
                              </span>
                            </div>
                            <Button size="sm" className="w-full">
                              Start Mission
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}