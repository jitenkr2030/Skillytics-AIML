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
  BookOpen,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Calendar,
  Users,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

export default function Analytics() {
  const [analytics, setAnalytics] = useState({
    overview: {
      totalMissions: 0,
      completedMissions: 0,
      averageScore: 0,
      totalTime: 0,
      currentStreak: 0,
      bestStreak: 0
    },
    skills: {
      bugFixes: 0,
      modelsImproved: 0,
      dataCleaned: 0,
      algorithmsChosen: 0,
      optimizations: 0,
      securityTasks: 0
    },
    missionTypes: [
      { type: 'MODEL_DEBUG', completed: 0, total: 0, avgScore: 0 },
      { type: 'DATA_QUALITY', completed: 0, total: 0, avgScore: 0 },
      { type: 'ALGORITHM_SELECTION', completed: 0, total: 0, avgScore: 0 },
      { type: 'TRAINING_OPTIMIZATION', completed: 0, total: 0, avgScore: 0 },
      { type: 'EVALUATION_METRICS', completed: 0, total: 0, avgScore: 0 },
      { type: 'FEATURE_ENGINEERING', completed: 0, total: 0, avgScore: 0 },
      { type: 'ML_SECURITY', completed: 0, total: 0, avgScore: 0 },
      { type: 'DEPLOYMENT', completed: 0, total: 0, avgScore: 0 }
    ],
    weeklyProgress: [
      { day: 'Mon', missions: 0, points: 0 },
      { day: 'Tue', missions: 0, points: 0 },
      { day: 'Wed', missions: 0, points: 0 },
      { day: 'Thu', missions: 0, points: 0 },
      { day: 'Fri', missions: 0, points: 0 },
      { day: 'Sat', missions: 0, points: 0 },
      { day: 'Sun', missions: 0, points: 0 }
    ],
    achievements: []
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setAnalytics({
        overview: {
          totalMissions: 24,
          completedMissions: 18,
          averageScore: 85.5,
          totalTime: 1240, // minutes
          currentStreak: 7,
          bestStreak: 12
        },
        skills: {
          bugFixes: 8,
          modelsImproved: 12,
          dataCleaned: 6,
          algorithmsChosen: 4,
          optimizations: 5,
          securityTasks: 3
        },
        missionTypes: [
          { type: 'MODEL_DEBUG', completed: 5, total: 8, avgScore: 82 },
          { type: 'DATA_QUALITY', completed: 4, total: 6, avgScore: 88 },
          { type: 'ALGORITHM_SELECTION', completed: 2, total: 4, avgScore: 79 },
          { type: 'TRAINING_OPTIMIZATION', completed: 3, total: 5, avgScore: 86 },
          { type: 'EVALUATION_METRICS', completed: 2, total: 3, avgScore: 91 },
          { type: 'FEATURE_ENGINEERING', completed: 1, total: 2, avgScore: 85 },
          { type: 'ML_SECURITY', completed: 1, total: 2, avgScore: 78 },
          { type: 'DEPLOYMENT', completed: 0, total: 2, avgScore: 0 }
        ],
        weeklyProgress: [
          { day: 'Mon', missions: 2, points: 250 },
          { day: 'Tue', missions: 3, points: 380 },
          { day: 'Wed', missions: 1, points: 120 },
          { day: 'Thu', missions: 4, points: 520 },
          { day: 'Fri', missions: 2, points: 300 },
          { day: 'Sat', missions: 3, points: 450 },
          { day: 'Sun', missions: 3, points: 410 }
        ],
        achievements: [
          { id: '1', title: 'First Bug Fix', description: 'Successfully debug your first model', icon: 'Bug', earnedAt: '2024-01-15' },
          { id: '2', title: 'Data Cleaning Pro', description: 'Complete 5 data quality missions', icon: 'Sparkles', earnedAt: '2024-01-18' },
          { id: '3', title: '7-Day Streak', description: 'Maintain a 7-day learning streak', icon: 'Flame', earnedAt: '2024-01-20' },
          { id: '4', title: 'Algorithm Expert', description: 'Choose correct algorithms 10 times', icon: 'Brain', earnedAt: '2024-01-22' }
        ]
      })
      setLoading(false)
    }, 1000)
  }, [])

  const getMissionTypeIcon = (type: string) => {
    switch (type) {
      case 'MODEL_DEBUG': return Code
      case 'DATA_QUALITY': return Database
      case 'ALGORITHM_SELECTION': return Brain
      case 'TRAINING_OPTIMIZATION': return Target
      case 'EVALUATION_METRICS': return Trophy
      case 'FEATURE_ENGINEERING': return Zap
      case 'ML_SECURITY': return Users
      case 'DEPLOYMENT': return Activity
      default: return Brain
    }
  }

  const getMissionTypeLabel = (type: string) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  const completionRate = analytics.overview.totalMissions > 0 
    ? (analytics.overview.completedMissions / analytics.overview.totalMissions) * 100 
    : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
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
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-xl font-semibold">Analytics Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-sm">
              Level 3 • 1,250 points
            </Badge>
            <Badge variant="outline" className="text-sm">
              🔥 7 day streak
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
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <Progress value={completionRate} className="mt-3" />
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
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Learning Time</p>
                  <p className="text-2xl font-bold">{Math.floor(analytics.overview.totalTime / 60)}h</p>
                  <p className="text-xs text-gray-500">{analytics.overview.totalTime % 60}m total</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Streak</p>
                  <p className="text-2xl font-bold">{analytics.overview.currentStreak} days</p>
                  <p className="text-xs text-gray-500">Best: {analytics.overview.bestStreak} days</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="skills">Skills Breakdown</TabsTrigger>
            <TabsTrigger value="missions">Mission Types</TabsTrigger>
            <TabsTrigger value="progress">Weekly Progress</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Skills Breakdown */}
          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  ML Skills Development
                </CardTitle>
                <CardDescription>
                  Track your proficiency across different ML engineering skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">🐛 Bug Fixes</span>
                      <span className="text-sm text-gray-600">{analytics.skills.bugFixes} missions</span>
                    </div>
                    <Progress value={(analytics.skills.bugFixes / 10) * 100} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">🚀 Models Improved</span>
                      <span className="text-sm text-gray-600">{analytics.skills.modelsImproved} missions</span>
                    </div>
                    <Progress value={(analytics.skills.modelsImproved / 15) * 100} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">🧹 Data Cleaning</span>
                      <span className="text-sm text-gray-600">{analytics.skills.dataCleaned} missions</span>
                    </div>
                    <Progress value={(analytics.skills.dataCleaned / 8) * 100} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">🧠 Algorithm Selection</span>
                      <span className="text-sm text-gray-600">{analytics.skills.algorithmsChosen} missions</span>
                    </div>
                    <Progress value={(analytics.skills.algorithmsChosen / 12) * 100} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">⚡ Optimizations</span>
                      <span className="text-sm text-gray-600">{analytics.skills.optimizations} missions</span>
                    </div>
                    <Progress value={(analytics.skills.optimizations / 10) * 100} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">🔒 Security Tasks</span>
                      <span className="text-sm text-gray-600">{analytics.skills.securityTasks} missions</span>
                    </div>
                    <Progress value={(analytics.skills.securityTasks / 6) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mission Types */}
          <TabsContent value="missions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Performance by Mission Type
                </CardTitle>
                <CardDescription>
                  See how you perform across different types of ML challenges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.missionTypes.map((missionType) => {
                    const Icon = getMissionTypeIcon(missionType.type)
                    const completionRate = missionType.total > 0 
                      ? (missionType.completed / missionType.total) * 100 
                      : 0

                    return (
                      <div key={missionType.type} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">{getMissionTypeLabel(missionType.type)}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {missionType.completed}/{missionType.total}
                              </Badge>
                              {missionType.avgScore > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  {missionType.avgScore}% avg
                                </Badge>
                              )}
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
          </TabsContent>

          {/* Weekly Progress */}
          <TabsContent value="progress">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Weekly Activity
                  </CardTitle>
                  <CardDescription>
                    Missions completed and points earned this week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.weeklyProgress.map((day) => (
                      <div key={day.day} className="flex items-center gap-4">
                        <div className="w-12 text-sm font-medium">{day.day}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">{day.missions} missions</span>
                            <span className="text-sm text-gray-600">{day.points} pts</span>
                          </div>
                          <Progress value={(day.missions / 5) * 100} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Learning Trends
                  </CardTitle>
                  <CardDescription>
                    Your learning patterns and improvement areas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Most Productive Day</span>
                      <span className="text-sm font-semibold text-green-600">Thursday</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium">Preferred Mission Type</span>
                      <span className="text-sm font-semibold text-blue-600">Model Debug</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium">Best Performance</span>
                      <span className="text-sm font-semibold text-purple-600">Evaluation Metrics</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span className="text-sm font-medium">Improvement Area</span>
                      <span className="text-sm font-semibold text-orange-600">ML Security</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements */}
          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Recent Achievements
                </CardTitle>
                <CardDescription>
                  Badges and milestones you've unlocked on your learning journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analytics.achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Trophy className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-sm text-gray-600 mb-1">{achievement.description}</p>
                        <p className="text-xs text-gray-500">Earned {achievement.earnedAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}