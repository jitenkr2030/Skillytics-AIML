'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Brain, 
  Code, 
  Database, 
  Target, 
  Trophy, 
  Lightbulb, 
  Play, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Zap,
  BookOpen,
  Terminal,
  Table,
  FileText,
  ArrowLeft,
  ArrowRight,
  RotateCcw
} from 'lucide-react'
import Link from 'next/link'

export default function MissionInterface() {
  const [activeTab, setActiveTab] = useState('problem')
  const [code, setCode] = useState(`# Broken Fraud Detection Model
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Load the dataset
data = pd.read_csv('fraud_data.csv')
X = data.drop('is_fraud', axis=1)
y = data['is_fraud']

# Train the model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# Make predictions
y_pred = model.predict(X)

# Calculate accuracy
accuracy = accuracy_score(y, y_pred)
print(f"Model Accuracy: {accuracy:.4f}")`)

  const [showHint, setShowHint] = useState(false)
  const [hintLevel, setHintLevel] = useState(0)
  const [testResults, setTestResults] = useState(null)
  const [isRunning, setIsRunning] = useState(false)

  const mission = {
    id: '1',
    title: 'Why Is This Fraud Model Failing?',
    type: 'MODEL_DEBUG',
    difficulty: 'INTERMEDIATE',
    description: 'A bank fraud detection model shows 99% accuracy but fails in production. Find and fix the issues.',
    context: 'You\'re an ML engineer at a major bank. The fraud detection model you inherited shows amazing accuracy in testing, but when deployed, it\'s missing 80% of actual fraud cases. The business is losing millions and your job is on the line.',
    objectives: [
      'Identify why accuracy is misleading',
      'Fix the data leakage issue',
      'Improve model evaluation metrics',
      'Achieve >85% recall while maintaining reasonable precision'
    ],
    constraints: {
      maxTime: 60,
      minRecall: 0.85,
      minPrecision: 0.3
    },
    dataset: {
      name: 'fraud_data.csv',
      rows: 10000,
      columns: 12,
      fraudRate: '1.2%'
    },
    hints: [
      {
        level: 1,
        title: "Look at the data distribution",
        content: "Check the class distribution in your target variable. What do you notice?"
      },
      {
        level: 2,
        title: "Accuracy isn't everything",
        content: "With imbalanced datasets, accuracy can be misleading. What metrics should you use instead?"
      },
      {
        level: 3,
        title: "Data leakage alert",
        content: "Look carefully at your features. Are any of them giving away the answer?"
      }
    ]
  }

  const runCode = async () => {
    setIsRunning(true)
    // Simulate code execution
    setTimeout(() => {
      setTestResults({
        accuracy: 0.9928,
        precision: 0.0000,
        recall: 0.0000,
        f1_score: 0.0000,
        confusion_matrix: {
          tn: 9872,
          fp: 0,
          fn: 128,
          tp: 0
        },
        issues: [
          "Model has 0% recall - it's not detecting any fraud",
          "Data leakage detected in features",
          "Using wrong evaluation metric for imbalanced dataset"
        ]
      })
      setIsRunning(false)
    }, 2000)
  }

  const getHint = () => {
    if (hintLevel < mission.hints.length) {
      setHintLevel(hintLevel + 1)
      setShowHint(true)
    }
  }

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

  const MissionIcon = getMissionIcon(mission.type)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <MissionIcon className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">{mission.title}</h1>
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${getDifficultyColor(mission.difficulty)}`}>
                    {mission.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {mission.constraints.maxTime} min
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Trophy className="h-3 w-3 mr-1" />
                    100 pts
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Code
            </Button>
            <Button size="sm">
              <Play className="h-4 w-4 mr-2" />
              Run Code
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Problem & Resources */}
          <div className="lg:col-span-1 space-y-6">
            {/* Context */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Context
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {mission.context}
                </p>
              </CardContent>
            </Card>

            {/* Objectives */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Objectives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {mission.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Dataset Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Table className="h-5 w-5" />
                  Dataset
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">File:</span>
                    <span className="font-mono">{mission.dataset.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rows:</span>
                    <span>{mission.dataset.rows.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Columns:</span>
                    <span>{mission.dataset.columns}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fraud Rate:</span>
                    <span className="text-red-600 font-semibold">{mission.dataset.fraudRate}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  <Table className="h-4 w-4 mr-2" />
                  Preview Data
                </Button>
              </CardContent>
            </Card>

            {/* AI Mentor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  AI Mentor
                </CardTitle>
                <CardDescription>
                  Stuck? Get progressive hints to guide your thinking.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Hints used: {hintLevel}/{mission.hints.length}
                    </span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={getHint}
                      disabled={hintLevel >= mission.hints.length}
                    >
                      Get Hint ({hintLevel + 1}/{mission.hints.length})
                    </Button>
                  </div>
                  
                  {showHint && hintLevel > 0 && (
                    <Alert>
                      <Lightbulb className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <p className="font-semibold">
                            {mission.hints[hintLevel - 1].title}
                          </p>
                          <p className="text-sm">
                            {mission.hints[hintLevel - 1].content}
                          </p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Code Editor & Results */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                <CardHeader>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="problem" className="flex items-center gap-2">
                      <Terminal className="h-4 w-4" />
                      Code Editor
                    </TabsTrigger>
                    <TabsTrigger value="results" className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Test Results
                    </TabsTrigger>
                    <TabsTrigger value="solution" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Learn
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                <CardContent className="p-0">
                  <TabsContent value="problem" className="m-0">
                    <div className="border-t">
                      <div className="bg-gray-900 text-gray-100 p-4 font-mono text-sm">
                        <textarea
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          className="w-full h-96 bg-transparent resize-none outline-none"
                          spellCheck={false}
                        />
                      </div>
                      <div className="border-t bg-gray-50 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Button 
                              onClick={runCode}
                              disabled={isRunning}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {isRunning ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                  Running...
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-2" />
                                  Run Code
                                </>
                              )}
                            </Button>
                            <Button variant="outline" size="sm">
                              Submit Solution
                            </Button>
                          </div>
                          <div className="text-sm text-gray-500">
                            Python 3.9 • scikit-learn 1.0.2
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="results" className="m-0">
                    <div className="border-t p-6">
                      {testResults ? (
                        <div className="space-y-6">
                          {/* Metrics */}
                          <div>
                            <h3 className="text-lg font-semibold mb-4">Model Performance</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">
                                  {(testResults.accuracy * 100).toFixed(1)}%
                                </div>
                                <div className="text-sm text-gray-600">Accuracy</div>
                              </div>
                              <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-red-600">
                                  {(testResults.precision * 100).toFixed(1)}%
                                </div>
                                <div className="text-sm text-gray-600">Precision</div>
                              </div>
                              <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-red-600">
                                  {(testResults.recall * 100).toFixed(1)}%
                                </div>
                                <div className="text-sm text-gray-600">Recall</div>
                              </div>
                              <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-red-600">
                                  {(testResults.f1_score * 100).toFixed(1)}%
                                </div>
                                <div className="text-sm text-gray-600">F1 Score</div>
                              </div>
                            </div>
                          </div>

                          {/* Issues */}
                          <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5 text-red-500" />
                              Issues Found
                            </h3>
                            <div className="space-y-2">
                              {testResults.issues.map((issue, index) => (
                                <Alert key={index} variant="destructive">
                                  <AlertTriangle className="h-4 w-4" />
                                  <AlertDescription>{issue}</AlertDescription>
                                </Alert>
                              ))}
                            </div>
                          </div>

                          {/* Confusion Matrix */}
                          <div>
                            <h3 className="text-lg font-semibold mb-4">Confusion Matrix</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="grid grid-cols-3 gap-4 text-center">
                                <div></div>
                                <div className="font-semibold">Pred: No Fraud</div>
                                <div className="font-semibold">Pred: Fraud</div>
                                <div className="font-semibold">Actual: No Fraud</div>
                                <div className="p-4 bg-green-100 rounded">{testResults.confusion_matrix.tn}</div>
                                <div className="p-4 bg-yellow-100 rounded">{testResults.confusion_matrix.fp}</div>
                                <div className="font-semibold">Actual: Fraud</div>
                                <div className="p-4 bg-red-100 rounded">{testResults.confusion_matrix.fn}</div>
                                <div className="p-4 bg-green-100 rounded">{testResults.confusion_matrix.tp}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Run your code to see test results</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="solution" className="m-0">
                    <div className="border-t p-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Key Concepts</h3>
                          <div className="space-y-4">
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-base">Class Imbalance</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-gray-600">
                                  When one class is much rarer than others (like fraud at 1.2%), 
                                  accuracy becomes misleading. A model that always predicts "no fraud" 
                                  will have 98.8% accuracy but be completely useless.
                                </p>
                              </CardContent>
                            </Card>
                            
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-base">Better Metrics for Imbalance</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-gray-600">
                                  For imbalanced problems, focus on:
                                </p>
                                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                                  <li>• <strong>Recall:</strong> How many actual frauds did we catch?</li>
                                  <li>• <strong>Precision:</strong> When we predict fraud, how often are we right?</li>
                                  <li>• <strong>F1 Score:</strong> Balance between precision and recall</li>
                                </ul>
                              </CardContent>
                            </Card>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-4">Common Pitfalls</h3>
                          <div className="space-y-2">
                            <Alert>
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                <strong>Data Leakage:</strong> Using features that contain information about the target variable.
                              </AlertDescription>
                            </Alert>
                            <Alert>
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                <strong>Wrong Train-Test Split:</strong> Testing on the same data you trained on.
                              </AlertDescription>
                            </Alert>
                            <Alert>
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                <strong>Ignoring Business Context:</strong> 99% accuracy means nothing if you miss all the frauds.
                              </AlertDescription>
                            </Alert>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}