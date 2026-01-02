'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Brain, 
  Code, 
  Database, 
  Target, 
  Trophy, 
  Zap,
  Users,
  Activity,
  BookOpen,
  Play,
  Save,
  Upload
} from 'lucide-react'

export default function AdminDashboard() {
  const [modules, setModules] = useState([])
  const [missions, setMissions] = useState([])
  const [selectedModule, setSelectedModule] = useState(null)
  const [editingMission, setEditingMission] = useState(null)
  const [isCreateMissionOpen, setIsCreateMissionOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const [newMission, setNewMission] = useState({
    title: '',
    description: '',
    context: '',
    type: '',
    difficulty: '',
    points: 100,
    estimatedTime: 30,
    moduleId: '',
    objectives: [],
    constraints: {},
    validationRules: [],
    hints: []
  })

  useEffect(() => {
    fetchModules()
    fetchMissions()
  }, [])

  const fetchModules = async () => {
    try {
      const response = await fetch('/api/modules')
      const data = await response.json()
      setModules(data)
    } catch (error) {
      console.error('Error fetching modules:', error)
    }
  }

  const fetchMissions = async () => {
    try {
      const response = await fetch('/api/missions')
      const data = await response.json()
      setMissions(data.missions || [])
    } catch (error) {
      console.error('Error fetching missions:', error)
    } finally {
      setLoading(false)
    }
  }

  const createMission = async () => {
    try {
      const response = await fetch('/api/missions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMission),
      })

      if (response.ok) {
        await fetchMissions()
        setIsCreateMissionOpen(false)
        resetNewMission()
      }
    } catch (error) {
      console.error('Error creating mission:', error)
    }
  }

  const resetNewMission = () => {
    setNewMission({
      title: '',
      description: '',
      context: '',
      type: '',
      difficulty: '',
      points: 100,
      estimatedTime: 30,
      moduleId: '',
      objectives: [],
      constraints: {},
      validationRules: [],
      hints: []
    })
  }

  const getMissionIcon = (type: string) => {
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'bg-green-100 text-green-800'
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800'
      case 'ADVANCED': return 'bg-orange-100 text-orange-800'
      case 'EXPERT': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const bulkCreateMissions = async () => {
    // This would open a file upload dialog or bulk creation interface
    console.log('Bulk mission creation')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
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
            <h1 className="text-2xl font-bold">Mission Management</h1>
            <Badge variant="outline">{missions.length} missions total</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isCreateMissionOpen} onOpenChange={setIsCreateMissionOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Mission
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Mission</DialogTitle>
                  <DialogDescription>
                    Add a new mission to the learning platform
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={newMission.title}
                      onChange={(e) => setNewMission({...newMission, title: e.target.value})}
                      placeholder="Mission title"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={newMission.description}
                      onChange={(e) => setNewMission({...newMission, description: e.target.value})}
                      placeholder="Brief description of the mission"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Context</label>
                    <Textarea
                      value={newMission.context}
                      onChange={(e) => setNewMission({...newMission, context: e.target.value})}
                      placeholder="Real-world scenario and context"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <Select value={newMission.type} onValueChange={(value) => setNewMission({...newMission, type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mission type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MODEL_DEBUG">Model Debug</SelectItem>
                          <SelectItem value="DATA_QUALITY">Data Quality</SelectItem>
                          <SelectItem value="ALGORITHM_SELECTION">Algorithm Selection</SelectItem>
                          <SelectItem value="TRAINING_OPTIMIZATION">Training Optimization</SelectItem>
                          <SelectItem value="EVALUATION_METRICS">Evaluation Metrics</SelectItem>
                          <SelectItem value="FEATURE_ENGINEERING">Feature Engineering</SelectItem>
                          <SelectItem value="ML_SECURITY">ML Security</SelectItem>
                          <SelectItem value="DEPLOYMENT">Deployment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Difficulty</label>
                      <Select value={newMission.difficulty} onValueChange={(value) => setNewMission({...newMission, difficulty: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BEGINNER">Beginner</SelectItem>
                          <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                          <SelectItem value="ADVANCED">Advanced</SelectItem>
                          <SelectItem value="EXPERT">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Module</label>
                      <Select value={newMission.moduleId} onValueChange={(value) => setNewMission({...newMission, moduleId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select module" />
                        </SelectTrigger>
                        <SelectContent>
                          {modules.map((module) => (
                            <SelectItem key={module.id} value={module.id}>
                              {module.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Points</label>
                      <Input
                        type="number"
                        value={newMission.points}
                        onChange={(e) => setNewMission({...newMission, points: parseInt(e.target.value)})}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Time (min)</label>
                      <Input
                        type="number"
                        value={newMission.estimatedTime}
                        onChange={(e) => setNewMission({...newMission, estimatedTime: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateMissionOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createMission}>
                      <Save className="h-4 w-4 mr-2" />
                      Create Mission
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={bulkCreateMissions}>
              <Upload className="h-4 w-4 mr-2" />
              Bulk Import
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="missions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="missions">Missions</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="missions">
            <div className="space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Select>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="MODEL_DEBUG">Model Debug</SelectItem>
                        <SelectItem value="DATA_QUALITY">Data Quality</SelectItem>
                        <SelectItem value="ALGORITHM_SELECTION">Algorithm Selection</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="All Difficulties" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Difficulties</SelectItem>
                        <SelectItem value="BEGINNER">Beginner</SelectItem>
                        <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                        <SelectItem value="ADVANCED">Advanced</SelectItem>
                        <SelectItem value="EXPERT">Expert</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="All Modules" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Modules</SelectItem>
                        {modules.map((module) => (
                          <SelectItem key={module.id} value={module.id}>
                            {module.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Missions List */}
              <div className="grid gap-4">
                {missions.map((mission) => {
                  const Icon = getMissionIcon(mission.type)
                  return (
                    <Card key={mission.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Icon className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">{mission.title}</h3>
                                <Badge className={getDifficultyColor(mission.difficulty)}>
                                  {mission.difficulty}
                                </Badge>
                                <Badge variant="outline">{mission.type}</Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{mission.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>{mission.points} points</span>
                                <span>{mission.estimatedTime} min</span>
                                <span>{mission.module?.title}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="modules">
            <div className="grid gap-6">
              {modules.map((module) => (
                <Card key={module.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-2">{module.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{module._count?.missions || 0} missions</span>
                            <span>Order: {module.order}</span>
                            <span>{module.isLocked ? '🔒 Locked' : '🔓 Unlocked'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{missions.length}</div>
                    <p className="text-sm text-gray-600">Total Missions</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{modules.length}</div>
                    <p className="text-sm text-gray-600">Modules</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-sm text-gray-600">Mission Types</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">4</div>
                    <p className="text-sm text-gray-600">Difficulty Levels</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}