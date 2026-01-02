'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Brain, 
  Code, 
  Database, 
  Target, 
  Trophy, 
  Zap, 
  BookOpen, 
  Lock,
  Play,
  CheckCircle,
  Star,
  Clock,
  ArrowRight,
  Filter,
  Search
} from 'lucide-react'
import Link from 'next/link'

export default function MissionMap() {
  const [selectedModule, setSelectedModule] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  // Comprehensive 16-module curriculum
  const [modules] = useState([
    {
      id: 1,
      title: 'Data Thinking for AI/ML',
      description: 'Think like an ML engineer before coding',
      icon: Brain,
      color: 'bg-blue-500',
      totalMissions: 20,
      completedMissions: 20,
      isLocked: false,
      missions: [
        { id: 1, title: 'Identify ML vs Rule-based problem', type: 'ALGORITHM_SELECTION', difficulty: 'BEGINNER', completed: true },
        { id: 2, title: 'Define target variable correctly', type: 'DATA_QUALITY', difficulty: 'BEGINNER', completed: true },
        { id: 3, title: 'Detect hidden labels in data', type: 'DATA_QUALITY', difficulty: 'INTERMEDIATE', completed: true },
        { id: 4, title: 'Spot data leakage scenario', type: 'MODEL_DEBUG', difficulty: 'INTERMEDIATE', completed: true },
        { id: 5, title: 'Identify wrong problem framing', type: 'ALGORITHM_SELECTION', difficulty: 'INTERMEDIATE', completed: true },
        { id: 6, title: 'Convert business problem → ML problem', type: 'ALGORITHM_SELECTION', difficulty: 'INTERMEDIATE', completed: true },
        { id: 7, title: 'Detect biased data collection', type: 'ML_SECURITY', difficulty: 'ADVANCED', completed: true },
        { id: 8, title: 'Decide supervised vs unsupervised', type: 'ALGORITHM_SELECTION', difficulty: 'BEGINNER', completed: true },
        { id: 9, title: 'Decide batch vs real-time ML', type: 'DEPLOYMENT', difficulty: 'ADVANCED', completed: true },
        { id: 10, title: 'Identify features vs noise', type: 'DATA_QUALITY', difficulty: 'INTERMEDIATE', completed: true },
        { id: 11, title: 'Define success metrics', type: 'EVALUATION_METRICS', difficulty: 'INTERMEDIATE', completed: true },
        { id: 12, title: 'Identify training vs inference gap', type: 'MODEL_DEBUG', difficulty: 'ADVANCED', completed: true },
        { id: 13, title: 'Detect proxy variables', type: 'DATA_QUALITY', difficulty: 'ADVANCED', completed: true },
        { id: 14, title: 'Identify missing data risks', type: 'DATA_QUALITY', difficulty: 'INTERMEDIATE', completed: true },
        { id: 15, title: 'Understand dataset shift scenario', type: 'MODEL_DEBUG', difficulty: 'ADVANCED', completed: true },
        { id: 16, title: 'Choose evaluation strategy', type: 'EVALUATION_METRICS', difficulty: 'INTERMEDIATE', completed: true },
        { id: 17, title: 'Identify overfitting early signals', type: 'MODEL_DEBUG', difficulty: 'INTERMEDIATE', completed: true },
        { id: 18, title: 'Identify underfitting causes', type: 'MODEL_DEBUG', difficulty: 'INTERMEDIATE', completed: true },
        { id: 19, title: 'Ethics risk detection', type: 'ML_SECURITY', difficulty: 'ADVANCED', completed: true },
        { id: 20, title: 'Mini-case: ML feasibility decision', type: 'ALGORITHM_SELECTION', difficulty: 'EXPERT', completed: true }
      ]
    },
    {
      id: 2,
      title: 'Python for ML (NumPy, Pandas)',
      description: 'Manipulate data like a pro',
      icon: Code,
      color: 'bg-green-500',
      totalMissions: 20,
      completedMissions: 15,
      isLocked: false,
      missions: [
        { id: 21, title: 'Fix broken NumPy operations', type: 'MATH_IN_CODE', difficulty: 'BEGINNER', completed: true },
        { id: 22, title: 'Optimize slow loops with vectorization', type: 'TRAINING_OPTIMIZATION', difficulty: 'INTERMEDIATE', completed: true },
        { id: 23, title: 'Clean messy CSV dataset', type: 'DATA_QUALITY', difficulty: 'BEGINNER', completed: true },
        { id: 24, title: 'Fix incorrect dataframe joins', type: 'DATA_QUALITY', difficulty: 'INTERMEDIATE', completed: true },
        { id: 25, title: 'Handle missing values properly', type: 'DATA_QUALITY', difficulty: 'INTERMEDIATE', completed: true },
        { id: 26, title: 'Convert categorical features', type: 'DATA_QUALITY', difficulty: 'BEGINNER', completed: true },
        { id: 27, title: 'Normalize numerical columns', type: 'DATA_QUALITY', difficulty: 'BEGINNER', completed: true },
        { id: 28, title: 'Fix wrong datetime parsing', type: 'DATA_QUALITY', difficulty: 'INTERMEDIATE', completed: true },
        { id: 29, title: 'Detect duplicated rows', type: 'DATA_QUALITY', difficulty: 'BEGINNER', completed: true },
        { id: 30, title: 'Aggregate data correctly', type: 'DATA_QUALITY', difficulty: 'INTERMEDIATE', completed: true },
        { id: 31, title: 'Fix incorrect groupby logic', type: 'DATA_QUALITY', difficulty: 'INTERMEDIATE', completed: true },
        { id: 32, title: 'Handle large datasets efficiently', type: 'TRAINING_OPTIMIZATION', difficulty: 'ADVANCED', completed: false },
        { id: 33, title: 'Memory optimization task', type: 'TRAINING_OPTIMIZATION', difficulty: 'ADVANCED', completed: false },
        { id: 34, title: 'Fix chained assignment bug', type: 'MODEL_DEBUG', difficulty: 'INTERMEDIATE', completed: false },
        { id: 35, title: 'Feature extraction from text column', type: 'DATA_QUALITY', difficulty: 'ADVANCED', completed: false },
        { id: 36, title: 'Window-based calculations', type: 'DATA_QUALITY', difficulty: 'ADVANCED', completed: false },
        { id: 37, title: 'Incorrect index usage fix', type: 'MODEL_DEBUG', difficulty: 'INTERMEDIATE', completed: false },
        { id: 38, title: 'Data validation checks', type: 'DATA_QUALITY', difficulty: 'INTERMEDIATE', completed: false },
        { id: 39, title: 'Export ML-ready dataset', type: 'DATA_QUALITY', difficulty: 'BEGINNER', completed: false },
        { id: 40, title: 'Data prep mini-mission', type: 'DATA_QUALITY', difficulty: 'INTERMEDIATE', completed: false }
      ]
    },
    {
      id: 3,
      title: 'Data Cleaning & EDA',
      description: 'Make data usable for ML',
      icon: Database,
      color: 'bg-purple-500',
      totalMissions: 20,
      completedMissions: 6,
      isLocked: false,
      missions: [
        { id: 41, title: 'Detect outliers', type: 'DATA_QUALITY', difficulty: 'INTERMEDIATE', completed: true },
        { id: 42, title: 'Fix skewed distributions', type: 'DATA_QUALITY', difficulty: 'INTERMEDIATE', completed: true },
        { id: 43, title: 'Handle imbalanced classes', type: 'DATA_QUALITY', difficulty: 'ADVANCED', completed: true },
        { id: 44, title: 'Remove data leakage columns', type: 'MODEL_DEBUG', difficulty: 'ADVANCED', completed: true },
        { id: 45, title: 'Correlation analysis mission', type: 'DATA_QUALITY', difficulty: 'INTERMEDIATE', completed: true },
        { id: 46, title: 'Feature importance inspection', type: 'EVALUATION_METRICS', difficulty: 'INTERMEDIATE', completed: true },
        { id: 47, title: 'Fix incorrect scaling', type: 'DATA_QUALITY', difficulty: 'BEGINNER', completed: false },
        { id: 48, title: 'Handle categorical explosion', type: 'DATA_QUALITY', difficulty: 'ADVANCED', completed: false },
        { id: 49, title: 'Missing value strategy comparison', type: 'DATA_QUALITY', difficulty: 'ADVANCED', completed: false },
        { id: 50, title: 'Detect noisy labels', type: 'DATA_QUALITY', difficulty: 'ADVANCED', completed: false }
      ]
    },
    {
      id: 4,
      title: 'Supervised Learning (Core ML)',
      description: 'Build correct models',
      icon: Brain,
      color: 'bg-orange-500',
      totalMissions: 20,
      completedMissions: 0,
      isLocked: true,
      missions: []
    },
    {
      id: 5,
      title: 'Model Evaluation & Metrics',
      description: 'Stop misleading results',
      icon: Trophy,
      color: 'bg-red-500',
      totalMissions: 20,
      completedMissions: 0,
      isLocked: true,
      missions: []
    },
    {
      id: 6,
      title: 'Feature Engineering',
      description: 'Create signal, not noise',
      icon: Target,
      color: 'bg-yellow-500',
      totalMissions: 20,
      completedMissions: 0,
      isLocked: true,
      missions: []
    },
    {
      id: 7,
      title: 'Unsupervised Learning',
      description: 'Discover patterns without labels',
      icon: Brain,
      color: 'bg-indigo-500',
      totalMissions: 20,
      completedMissions: 0,
      isLocked: true,
      missions: []
    },
    {
      id: 8,
      title: 'Model Optimization',
      description: 'Improve performance systematically',
      icon: Zap,
      color: 'bg-pink-500',
      totalMissions: 20,
      completedMissions: 0,
      isLocked: true,
      missions: []
    },
    {
      id: 9,
      title: 'Deep Learning Basics',
      description: 'Understand neural networks practically',
      icon: Brain,
      color: 'bg-cyan-500',
      totalMissions: 20,
      completedMissions: 0,
      isLocked: true,
      missions: []
    },
    {
      id: 10,
      title: 'Computer Vision (CNN)',
      description: 'Image ML skills',
      icon: Target,
      color: 'bg-teal-500',
      totalMissions: 20,
      completedMissions: 0,
      isLocked: true,
      missions: []
    },
    {
      id: 11,
      title: 'NLP Models',
      description: 'Text intelligence',
      icon: BookOpen,
      color: 'bg-lime-500',
      totalMissions: 20,
      completedMissions: 0,
      isLocked: true,
      missions: []
    },
    {
      id: 12,
      title: 'ML Security & Ethics',
      description: 'Build safe AI',
      icon: Zap,
      color: 'bg-rose-500',
      totalMissions: 20,
      completedMissions: 0,
      isLocked: true,
      missions: []
    },
    {
      id: 13,
      title: 'MLOps Fundamentals',
      description: 'ML in production',
      icon: Code,
      color: 'bg-sky-500',
      totalMissions: 20,
      completedMissions: 0,
      isLocked: true,
      missions: []
    },
    {
      id: 14,
      title: 'Testing & Validation',
      description: 'Trustworthy ML',
      icon: Trophy,
      color: 'bg-emerald-500',
      totalMissions: 20,
      completedMissions: 0,
      isLocked: true,
      missions: []
    },
    {
      id: 15,
      title: 'Real-World AI Projects',
      description: 'End-to-end mastery',
      icon: Star,
      color: 'bg-violet-500',
      totalMissions: 20,
      completedMissions: 0,
      isLocked: true,
      missions: []
    },
    {
      id: 16,
      title: 'AI Career Mode',
      description: 'Job-ready ML engineer',
      icon: Trophy,
      color: 'bg-amber-500',
      totalMissions: 20,
      completedMissions: 0,
      isLocked: true,
      missions: []
    }
  ])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'bg-green-100 text-green-800'
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800'
      case 'ADVANCED': return 'bg-orange-100 text-orange-800'
      case 'EXPERT': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMissionIcon = (type: string) => {
    switch (type) {
      case 'MODEL_DEBUG': return Code
      case 'DATA_QUALITY': return Database
      case 'ALGORITHM_SELECTION': return Brain
      case 'TRAINING_OPTIMIZATION': return Zap
      case 'EVALUATION_METRICS': return Trophy
      case 'ML_SECURITY': return Zap
      case 'DEPLOYMENT': return Code
      case 'MATH_IN_CODE': return Target
      default: return Brain
    }
  }

  const filteredMissions = selectedModule !== null 
    ? modules[selectedModule].missions.filter(mission => {
        const matchesSearch = mission.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = filterType === 'all' || mission.type === filterType
        return matchesSearch && matchesFilter
      })
    : []

  const totalProgress = Math.round(
    modules.reduce((sum, module) => sum + (module.completedMissions / module.totalMissions) * 100, 0) / modules.length
  )

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
            <h1 className="text-xl font-semibold">Mission Map</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-sm">
              {modules.reduce((sum, m) => sum + m.completedMissions, 0)} / 320 Missions
            </Badge>
            <Badge variant="outline" className="text-sm">
              {totalProgress}% Complete
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Overall Progress */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Your Learning Journey</h2>
                <p className="text-gray-600">
                  Master AI/ML through 320 hands-on missions across 16 comprehensive modules
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-indigo-600">{totalProgress}%</div>
                <div className="text-sm text-gray-500">Overall Progress</div>
              </div>
            </div>
            <Progress value={totalProgress} className="h-3" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {modules.filter(m => m.completedMissions === m.totalMissions).length}
                </div>
                <div className="text-sm text-gray-600">Modules Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {modules.filter(m => m.completedMissions > 0 && m.completedMissions < m.totalMissions).length}
                </div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {modules.reduce((sum, m) => sum + m.completedMissions, 0)}
                </div>
                <div className="text-sm text-gray-600">Missions Done</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {320 - modules.reduce((sum, m) => sum + m.completedMissions, 0)}
                </div>
                <div className="text-sm text-gray-600">To Go</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Module Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {modules.map((module, index) => {
                const Icon = module.icon
                const progress = Math.round((module.completedMissions / module.totalMissions) * 100)
                
                return (
                  <Card 
                    key={module.id} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedModule === index ? 'ring-2 ring-indigo-500' : ''
                    } ${module.isLocked ? 'opacity-75' : ''}`}
                    onClick={() => !module.isLocked && setSelectedModule(index)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`h-12 w-12 ${module.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          {module.isLocked ? (
                            <Lock className="h-6 w-6 text-white" />
                          ) : (
                            <Icon className="h-6 w-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <CardDescription className="text-sm">
                            {module.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{module.completedMissions}/{module.totalMissions} missions</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex items-center justify-between">
                          <Badge variant={module.isLocked ? 'secondary' : 'outline'} className="text-xs">
                            {module.isLocked ? 'Locked' : progress === 100 ? 'Completed' : 'In Progress'}
                          </Badge>
                          {module.completedMissions > 0 && (
                            <Button size="sm" variant="ghost">
                              <Play className="h-4 w-4 mr-1" />
                              Continue
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Mission Details */}
          <div className="space-y-6">
            {selectedModule !== null && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {modules[selectedModule].title}
                  </CardTitle>
                  <CardDescription>
                    {modules[selectedModule].totalMissions} missions available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Search and Filter */}
                  <div className="space-y-4 mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search missions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={filterType === 'all' ? 'default' : 'outline'}
                        onClick={() => setFilterType('all')}
                      >
                        All
                      </Button>
                      <Button
                        size="sm"
                        variant={filterType === 'MODEL_DEBUG' ? 'default' : 'outline'}
                        onClick={() => setFilterType('MODEL_DEBUG')}
                      >
                        Debug
                      </Button>
                      <Button
                        size="sm"
                        variant={filterType === 'DATA_QUALITY' ? 'default' : 'outline'}
                        onClick={() => setFilterType('DATA_QUALITY')}
                      >
                        Data
                      </Button>
                      <Button
                        size="sm"
                        variant={filterType === 'ALGORITHM_SELECTION' ? 'default' : 'outline'}
                        onClick={() => setFilterType('ALGORITHM_SELECTION')}
                      >
                        Algorithm
                      </Button>
                    </div>
                  </div>

                  {/* Mission List */}
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {filteredMissions.map((mission) => {
                        const MissionIcon = getMissionIcon(mission.type)
                        
                        return (
                          <div
                            key={mission.id}
                            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
                          >
                            <div className="h-8 w-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <MissionIcon className="h-4 w-4 text-indigo-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">{mission.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={`text-xs ${getDifficultyColor(mission.difficulty)}`}>
                                  {mission.difficulty}
                                </Badge>
                                {mission.completed && (
                                  <Badge variant="outline" className="text-xs text-green-600">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Completed
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Button size="sm" variant="ghost">
                              {mission.completed ? (
                                'Review'
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-1" />
                                  Start
                                </>
                              )}
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Missions</span>
                    <span className="font-semibold">320</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Completed</span>
                    <span className="font-semibold text-green-600">
                      {modules.reduce((sum, m) => sum + m.completedMissions, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">In Progress</span>
                    <span className="font-semibold text-blue-600">
                      {modules.filter(m => m.completedMissions > 0 && m.completedMissions < m.totalMissions).length} modules
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Estimated Time</span>
                    <span className="font-semibold">160-200 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}