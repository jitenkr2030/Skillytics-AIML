'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  Brain, 
  Code, 
  Database, 
  Target, 
  Trophy, 
  Clock,
  Zap,
  BarChart3,
  PieChart,
  Calendar,
  Award,
  BookOpen,
  Activity
} from 'lucide-react'
import Link from 'next/link'

export default function Analytics() {
  const [analytics, setAnalytics] = useState({
    overview: {
      totalMissions: 0,
      completedMissions: 0,
      averageScore: 0,
      totalTimeSpent: 0,
      currentStreak: 0,
      level: 1,
      totalPoints: 0
    },
    skillBreakdown: [
      { type: 'MODEL_DEBUG', completed: 0, total: 0, avgScore: 0, icon: Code },
      { type: 'DATA_QUALITY', completed: 0, total: 0, avgScore: 0, icon: Database },
      { type: 'ALGORITHM_SELECTION', completed: 0, total: 0, avgScore: 0, icon: Brain },
      { type: 'TRAINING_OPTIMIZATION', completed: 0, total: 0, avgScore: 0, icon: Target },
      { type: 'EVALUATION_METRICS', completed: 0, total: 0, avgScore: 0, icon: Trophy },
      { type: 'ML_SECURITY', completed: 0, total: 0, avgScore: 0, icon: Zap },
      { type: 'DEPLOYMENT', completed: 0, total: 0, avgScore: 0, icon: Activity },
      { type: 'MATH_IN_CODE', completed: 0, total: 0, avgScore: 0, icon: BarChart3 }
    ],
    weeklyActivity: [
      { day: 'Mon', missions: 0, timeSpent: 0 },
      { day: 'Tue', missions: 0, timeSpent: 0 },
      { day: 'Wed', missions: 0, timeSpent: 0 },
      { day: 'Thu', missions: 0, timeSpent: 0 },
      { day: 'Fri', missions: 0, timeSpent: 0 },
      { day: 'Sat', missions: 0, timeSpent: 0 },
      { day: 'Sun', missions: 0, timeSpent: 0 }
    ],
    achievements: [
      { id: '1', title: 'First Bug Fix', description: 'Successfully debug your first model', unlocked: true, icon: 'Bug' },
      { id: '2', title: 'Data Cleaning Pro', description: 'Complete 5 data quality missions', unlocked: false, icon: 'Sparkles' },
      { id: '3', title: 'Algorithm Expert', description: 'Choose algorithms for 10 problems', unlocked: false, icon: 'Brain' },
      { id: '4', title: '7-Day Streak', description: 'Maintain a 7-day learning streak', unlocked: false, icon: 'Flame' }
    ]
  })

  const [timeRange, setTimeRange] = useState('week')

  useEffect(() => {
    // Mock data for demonstration
    setAnalytics({
      overview: {
        totalMissions: 320,
        completedMissions: 12,
        averageScore: 87.5,
        totalTimeSpent: 480,
        currentStreak: 5,
        level: 3,
        totalPoints: 450
      },
      skillBreakdown: [
        { type: 'MODEL_DEBUG', completed: 3, total: 40, avgScore: 92, icon: Code },
        { type: 'DATA_QUALITY', completed: 4, total: 40, avgScore: 88, icon: Database },
        { type: 'ALGORITHM_SELECTION', completed: 2, total: 40, avgScore: 85, icon: Brain },
        { type: 'TRAINING_OPTIMIZATION', completed: 1, total: 40, avgScore: 79, icon: Target },
        { type: 'EVALUATION_METRICS', completed: 2, total: 40, avgScore: 91, icon: Trophy },
        { type: 'ML_SECURITY', completed: 0, total: 40, avgScore: 0, icon: Zap },
        { type: 'DEPLOYMENT', completed: 0, total: 40, avgScore: 0, icon: Activity },
        { type: 'MATH_IN_CODE', completed: 0, total: 40, avgScore: 0, icon: BarChart3 }
      ],
      weeklyActivity: [
        { day: 'Mon', missions: 2, timeSpent: 45 },
        { day: 'Tue', missions: 1, timeSpent: 30 },
        { day: 'Wed', missions: 3, timeSpent: 60 },
        { day: 'Thu', missions: 0, timeSpent: 0 },
        { day: 'Fri', missions: 2, timeSpent: 50 },
        { day: 'Sat', missions: 3, timeSpent: 75 },
        { day: 'Sun', missions: 1, timeSpent: 25 }
      ],
      achievements: [
        { id: '1', title: 'First Bug Fix', description: 'Successfully debug your first model', unlocked: true, icon: 'Bug' },
        { id: '2', title: 'Data Cleaning Pro', description: 'Complete 5 data quality missions', unlocked: true, icon: 'Sparkles' },
        { id: '3', title: 'Algorithm Expert', description: 'Choose algorithms for 10 problems', unlocked: false, icon: 'Brain' },
        { id: '4', title: '7-Day Streak', description: 'Maintain a 7-day learning streak', unlocked: false, icon: 'Flame' }
      ]
    })
  }, [])

  const getMissionTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'MODEL_DEBUG': 'Model Debug',
      'DATA_QUALITY': 'Data Quality',
      'ALGORITHM_SELECTION': 'Algorithm Selection',
      'TRAINING_OPTIMIZATION': 'Training Optimization',
      'EVALUATION_METRICS': 'Evaluation Metrics',
      'ML_SECURITY': 'ML Security',
      'DEPLOYMENT': 'Deployment',
      'MATH_IN_CODE': 'Math in Code'
    }
    return labels[type] || type
  }

  const getSkillColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-indigo-600" />
              <span className="text-xl font-bold">Skillytics</span>
            </Link>
            <span className="text-gray-400">/</span>
            <h1 className="text-xl font-semibold">Analytics</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-sm">
              Level {analytics.overview.level}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {analytics.overview.totalPoints} pts
            </Badge>
            <Badge variant="outline" className="text-sm">
              {analytics.overview.currentStreak} day streak
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Missions Completed</p>
                  <p className="text-2xl font-bold">{analytics.overview.completedMissions}</p>
                  <p className="text-xs text-gray-500">of {analytics.overview.totalMissions} total</p>
                </div>
                <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <Progress 
                value={(analytics.overview.completedMissions / analytics.overview.totalMissions) * 100} 
                className="mt-4 h-2" 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold">{analytics.overview.averageScore}%</p>
                  <p className="text-xs text-green-600">+5.2% this week</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Time Spent</p>
                  <p className="text-2xl font-bold">{analytics.overview.totalTimeSpent}m</p>
                  <p className="text-xs text-gray-500">This week</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Streak</p>
                  <p className="text-2xl font-bold">{analytics.overview.currentStreak}</p>
                  <p className="text-xs text-gray-500">days in a row</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Zap className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Analytics */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Skill Breakdown
                </CardTitle>
                <CardDescription>
                  Your performance across different ML mission types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.skillBreakdown.map((skill, index) => {
                    const Icon = skill.icon
                    const completionRate = skill.total > 0 ? (skill.completed / skill.total) * 100 : 0
                    
                    return (
                      <div key={index} className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm">{getMissionTypeLabel(skill.type)}</h4>
                            <div className="flex items-center gap-2">
                              {skill.avgScore > 0 && (
                                <Badge className={`text-xs ${getSkillColor(skill.avgScore)}`}>
                                  {skill.avgScore}%
                                </Badge>
                              )}
                              <span className="text-sm text-gray-500">
                                {skill.completed}/{skill.total}
                              </span>
                            </div>
                          </div>
                          <Progress value={completionRate} className="h-2" />
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
                  <Calendar className="h-5 w-5" />
                  Weekly Activity
                </CardTitle>
                <CardDescription>
                  Your learning activity over the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-7 gap-2">
                    {analytics.weeklyActivity.map((day, index) => (
                      <div key={index} className="text-center">
                        <div className="text-xs text-gray-500 mb-2">{day.day}</div>
                        <div className="h-20 bg-gray-50 rounded-lg flex flex-col items-center justify-center p-2">
                          <div className="text-lg font-bold text-indigo-600">{day.missions}</div>
                          <div className="text-xs text-gray-500">{day.timeSpent}m</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Total: {analytics.weeklyActivity.reduce((sum, day) => sum + day.missions, 0)} missions</span>
                    <span>{analytics.weeklyActivity.reduce((sum, day) => sum + day.timeSpent, 0)} minutes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements
                </CardTitle>
                <CardDescription>
                  Your unlocked and pending achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.achievements.map((achievement, index) => (
                    <div 
                      key={index} 
                      className={`flex items-start gap-3 p-3 rounded-lg border ${
                        achievement.unlocked 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        achievement.unlocked 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-300 text-gray-500'
                      }`}>
                        <Award className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{achievement.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Learning Path
                </CardTitle>
                <CardDescription>
                  Your progress through the curriculum
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { module: 'Data Thinking for ML', progress: 100, status: 'completed' },
                    { module: 'Python for ML', progress: 75, status: 'in-progress' },
                    { module: 'Data Cleaning & EDA', progress: 30, status: 'in-progress' },
                    { module: 'Supervised Learning', progress: 0, status: 'locked' },
                    { module: 'Model Evaluation', progress: 0, status: 'locked' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.status === 'completed' 
                          ? 'bg-green-500 text-white' 
                          : item.status === 'in-progress'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-300 text-gray-500'
                      }`}>
                        {item.status === 'completed' ? '✓' : index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm truncate">{item.module}</h4>
                          <span className="text-xs text-gray-500">{item.progress}%</span>
                        </div>
                        <Progress value={item.progress} className="h-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}