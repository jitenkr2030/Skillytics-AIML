const { PrismaClient, MissionType, Difficulty } = require('@prisma/client')

const prisma = new PrismaClient()

// Complete 16-module curriculum with 320 missions
const curriculum = [
  {
    id: 'module-1',
    title: 'Data Thinking for AI/ML',
    description: 'Think like an ML engineer before coding',
    order: 1,
    isLocked: false,
    icon: 'Brain',
    color: '#3b82f6'
  },
  {
    id: 'module-2',
    title: 'Python for ML (NumPy, Pandas)',
    description: 'Manipulate data like a pro',
    order: 2,
    isLocked: false,
    icon: 'Code',
    color: '#10b981'
  },
  {
    id: 'module-3',
    title: 'Data Cleaning & EDA',
    description: 'Make data usable for ML',
    order: 3,
    isLocked: false,
    icon: 'Database',
    color: '#8b5cf6'
  },
  {
    id: 'module-4',
    title: 'Supervised Learning (Core ML)',
    description: 'Build correct models',
    order: 4,
    isLocked: true,
    icon: 'Brain',
    color: '#f97316'
  },
  {
    id: 'module-5',
    title: 'Model Evaluation & Metrics',
    description: 'Stop misleading results',
    order: 5,
    isLocked: true,
    icon: 'Trophy',
    color: '#ef4444'
  },
  {
    id: 'module-6',
    title: 'Feature Engineering',
    description: 'Create signal, not noise',
    order: 6,
    isLocked: true,
    icon: 'Target',
    color: '#eab308'
  },
  {
    id: 'module-7',
    title: 'Unsupervised Learning',
    description: 'Discover patterns without labels',
    order: 7,
    isLocked: true,
    icon: 'Brain',
    color: '#6366f1'
  },
  {
    id: 'module-8',
    title: 'Model Optimization',
    description: 'Improve performance systematically',
    order: 8,
    isLocked: true,
    icon: 'Zap',
    color: '#ec4899'
  },
  {
    id: 'module-9',
    title: 'Deep Learning Basics',
    description: 'Understand neural networks practically',
    order: 9,
    isLocked: true,
    icon: 'Brain',
    color: '#06b6d4'
  },
  {
    id: 'module-10',
    title: 'Computer Vision (CNN)',
    description: 'Image ML skills',
    order: 10,
    isLocked: true,
    icon: 'Target',
    color: '#14b8a6'
  },
  {
    id: 'module-11',
    title: 'NLP Models',
    description: 'Text intelligence',
    order: 11,
    isLocked: true,
    icon: 'BookOpen',
    color: '#84cc16'
  },
  {
    id: 'module-12',
    title: 'ML Security & Ethics',
    description: 'Build safe AI',
    order: 12,
    isLocked: true,
    icon: 'Zap',
    color: '#f43f5e'
  },
  {
    id: 'module-13',
    title: 'MLOps Fundamentals',
    description: 'ML in production',
    order: 13,
    isLocked: true,
    icon: 'Code',
    color: '#0ea5e9'
  },
  {
    id: 'module-14',
    title: 'Testing & Validation',
    description: 'Trustworthy ML',
    order: 14,
    isLocked: true,
    icon: 'Trophy',
    color: '#10b981'
  },
  {
    id: 'module-15',
    title: 'Real-World AI Projects',
    description: 'End-to-end mastery',
    order: 15,
    isLocked: true,
    icon: 'Star',
    color: '#8b5cf6'
  },
  {
    id: 'module-16',
    title: 'AI Career Mode',
    description: 'Job-ready ML engineer',
    order: 16,
    isLocked: true,
    icon: 'Trophy',
    color: '#f59e0b'
  }
]

// Generate all 320 missions
function generateAllMissions() {
  const allMissions = []
  
  // Mission templates for different types and difficulties
  const missionTemplates = {
    MODEL_DEBUG: [
      { title: 'Fix overfitting model', difficulty: 'INTERMEDIATE', points: 120 },
      { title: 'Debug training convergence', difficulty: 'ADVANCED', points: 150 },
      { title: 'Resolve data leakage', difficulty: 'INTERMEDIATE', points: 130 },
      { title: 'Fix poor generalization', difficulty: 'ADVANCED', points: 160 }
    ],
    DATA_QUALITY: [
      { title: 'Handle missing values', difficulty: 'BEGINNER', points: 80 },
      { title: 'Remove outliers', difficulty: 'INTERMEDIATE', points: 100 },
      { title: 'Balance imbalanced classes', difficulty: 'ADVANCED', points: 140 },
      { title: 'Clean noisy labels', difficulty: 'EXPERT', points: 180 }
    ],
    ALGORITHM_SELECTION: [
      { title: 'Choose classification vs regression', difficulty: 'BEGINNER', points: 90 },
      { title: 'Select appropriate algorithm', difficulty: 'INTERMEDIATE', points: 110 },
      { title: 'Compare model performance', difficulty: 'ADVANCED', points: 150 }
    ],
    TRAINING_OPTIMIZATION: [
      { title: 'Tune hyperparameters', difficulty: 'INTERMEDIATE', points: 120 },
      { title: 'Optimize training speed', difficulty: 'ADVANCED', points: 160 },
      { title: 'Fix convergence issues', difficulty: 'EXPERT', points: 200 }
    ],
    EVALUATION_METRICS: [
      { title: 'Select right metrics', difficulty: 'BEGINNER', points: 85 },
      { title: 'Interpret confusion matrix', difficulty: 'INTERMEDIATE', points: 110 },
      { title: 'Optimize threshold', difficulty: 'ADVANCED', points: 140 }
    ],
    ML_SECURITY: [
      { title: 'Detect model bias', difficulty: 'INTERMEDIATE', points: 130 },
      { title: 'Handle privacy risks', difficulty: 'ADVANCED', points: 170 },
      { title: 'Prevent adversarial attacks', difficulty: 'EXPERT', points: 210 }
    ],
    DEPLOYMENT: [
      { title: 'Deploy model API', difficulty: 'INTERMEDIATE', points: 120 },
      { title: 'Handle production drift', difficulty: 'ADVANCED', points: 160 },
      { title: 'Optimize inference latency', difficulty: 'EXPERT', points: 200 }
    ],
    MATH_IN_CODE: [
      { title: 'Fix gradient descent', difficulty: 'INTERMEDIATE', points: 110 },
      { title: 'Resolve vanishing gradients', difficulty: 'ADVANCED', points: 150 },
      { title: 'Implement backpropagation', difficulty: 'EXPERT', points: 190 }
    ]
  }

  // Module-specific mission definitions
  const moduleMissionCounts = Array(16).fill(20)
  const moduleTypes = [
    ['ALGORITHM_SELECTION', 'DATA_QUALITY', 'MODEL_DEBUG', 'ML_SECURITY'], // Module 1
    ['MATH_IN_CODE', 'TRAINING_OPTIMIZATION', 'DATA_QUALITY', 'MODEL_DEBUG'], // Module 2
    ['DATA_QUALITY', 'EVALUATION_METRICS', 'MODEL_DEBUG'], // Module 3
    ['ALGORITHM_SELECTION', 'MODEL_DEBUG', 'TRAINING_OPTIMIZATION'], // Module 4
    ['EVALUATION_METRICS', 'MODEL_DEBUG', 'DATA_QUALITY'], // Module 5
    ['DATA_QUALITY', 'MODEL_DEBUG', 'TRAINING_OPTIMIZATION'], // Module 6
    ['ALGORITHM_SELECTION', 'MODEL_DEBUG', 'DATA_QUALITY'], // Module 7
    ['TRAINING_OPTIMIZATION', 'MODEL_DEBUG', 'MATH_IN_CODE'], // Module 8
    ['MODEL_DEBUG', 'TRAINING_OPTIMIZATION', 'MATH_IN_CODE'], // Module 9
    ['MODEL_DEBUG', 'DATA_QUALITY', 'DEPLOYMENT'], // Module 10
    ['DATA_QUALITY', 'MODEL_DEBUG', 'ALGORITHM_SELECTION'], // Module 11
    ['ML_SECURITY', 'MODEL_DEBUG', 'DATA_QUALITY'], // Module 12
    ['DEPLOYMENT', 'MODEL_DEBUG', 'TRAINING_OPTIMIZATION'], // Module 13
    ['MODEL_DEBUG', 'EVALUATION_METRICS', 'DATA_QUALITY'], // Module 14
    ['ALGORITHM_SELECTION', 'MODEL_DEBUG', 'DEPLOYMENT'], // Module 15
    ['ALGORITHM_SELECTION', 'ML_SECURITY', 'DEPLOYMENT'] // Module 16
  ]

  // Generate missions for each module
  for (let moduleId = 0; moduleId < 16; moduleId++) {
    const types = moduleTypes[moduleId]
    const missionCount = moduleMissionCounts[moduleId]
    
    for (let i = 0; i < missionCount; i++) {
      const type = types[i % types.length]
      const templates = missionTemplates[type]
      const template = templates[i % templates.length]
      
      allMissions.push({
        title: template.title,
        description: `Master ${type.toLowerCase().replace('_', ' ')} through hands-on practice`,
        context: `Real-world scenario requiring ${type.toLowerCase().replace('_', ' ')} skills`,
        type: type,
        difficulty: template.difficulty,
        points: template.points,
        estimatedTime: 20 + (template.difficulty === 'BEGINNER' ? 10 : template.difficulty === 'INTERMEDIATE' ? 20 : template.difficulty === 'ADVANCED' ? 30 : 40),
        moduleId: `module-${moduleId + 1}`,
        objectives: [
          'Analyze the problem requirements',
          'Implement appropriate solution',
          'Validate results',
          'Document your approach'
        ],
        constraints: {
          maxTime: 60,
          minScore: 0.7
        },
        validationRules: [
          { type: 'correctness', expected: true },
          { type: 'efficiency', expected: template.difficulty !== 'BEGINNER' }
        ],
        hints: [
          { level: 1, title: "Start simple", content: "Begin with a basic approach and iterate." },
          { level: 2, title: "Consider edge cases", content: "Think about unusual inputs or scenarios." },
          { level: 3, title: "Optimize carefully", content: "Balance correctness with efficiency." }
        ],
        tags: JSON.stringify([type.toLowerCase().replace('_', '-'), template.difficulty.toLowerCase()]),
        order: i + 1,
        isPublished: true
      })
    }
  }
  
  return allMissions
}

async function main() {
  console.log('🌱 Seeding comprehensive 320-mission curriculum...')

  try {
    // First, create all skill modules
    const createdModules = []
    for (const module of curriculum) {
      const createdModule = await prisma.skillModule.upsert({
        where: { id: module.id },
        update: {
          title: module.title,
          description: module.description,
          order: module.order,
          isLocked: module.isLocked,
          icon: module.icon,
          color: module.color
        },
        create: {
          id: module.id,
          title: module.title,
          description: module.description,
          order: module.order,
          isLocked: module.isLocked,
          icon: module.icon,
          color: module.color
        }
      })
      createdModules.push(createdModule)
    }

    console.log('✅ Created 16 skill modules')

    // Wait a bit to ensure foreign key constraints are settled
    await new Promise(resolve => setTimeout(resolve, 100))

    // Generate and create all missions
    const allMissions = generateAllMissions()
    console.log(`📝 Generated ${allMissions.length} missions`)

    // Verify modules exist before creating missions
    const existingModules = await prisma.skillModule.findMany({
      select: { id: true }
    })
    const moduleIds = existingModules.map(m => m.id)
    console.log(`📋 Verified ${moduleIds.length} modules exist: ${moduleIds.join(', ')}`)

    // Filter missions to only include those with valid module IDs
    const validMissions = allMissions.filter(mission => 
      moduleIds.includes(mission.moduleId)
    )
    console.log(`✅ Filtered to ${validMissions.length} valid missions`)

    // Batch create missions
    const batchSize = 20 // Smaller batch size to avoid issues
    for (let i = 0; i < validMissions.length; i += batchSize) {
      const batch = validMissions.slice(i, i + batchSize)
      
      for (const mission of batch) {
        try {
          await prisma.mission.upsert({
            where: { id: `${mission.type}-${mission.order}` },
            update: {
              title: mission.title,
              description: mission.description,
              context: mission.context,
              type: mission.type,
              difficulty: mission.difficulty,
              points: mission.points,
              estimatedTime: mission.estimatedTime,
              moduleId: mission.moduleId,
              objectives: mission.objectives,
              constraints: mission.constraints,
              validationRules: mission.validationRules,
              hints: mission.hints,
              tags: mission.tags,
              order: mission.order,
              isPublished: mission.isPublished
            },
            create: {
              id: `${mission.type}-${mission.order}`,
              title: mission.title,
              description: mission.description,
              context: mission.context,
              type: mission.type,
              difficulty: mission.difficulty,
              points: mission.points,
              estimatedTime: mission.estimatedTime,
              moduleId: mission.moduleId,
              objectives: mission.objectives,
              constraints: mission.constraints,
              validationRules: mission.validationRules,
              hints: mission.hints,
              tags: mission.tags,
              order: mission.order,
              isPublished: mission.isPublished
            }
          })
        } catch (error) {
          console.error(`❌ Failed to create mission ${mission.id}:`, error.message)
        }
      }
      
      console.log(`✅ Created missions ${i + 1}-${Math.min(i + batchSize, validMissions.length)}`)
    }

    // Create comprehensive achievements
    const achievements = [
      { title: 'Data Thinking Master', description: 'Complete all 20 missions in Module 1', icon: 'Brain', badgeColor: '#3b82f6', criteria: { type: 'module_completed', value: 'module-1', count: 20 }, points: 200 },
      { title: 'Python Ninja', description: 'Complete all 20 missions in Module 2', icon: 'Code', badgeColor: '#10b981', criteria: { type: 'module_completed', value: 'module-2', count: 20 }, points: 200 },
      { title: 'Data Cleaning Expert', description: 'Complete all 20 missions in Module 3', icon: 'Database', badgeColor: '#8b5cf6', criteria: { type: 'module_completed', value: 'module-3', count: 20 }, points: 200 },
      { title: 'Supervised Learning Pro', description: 'Complete all 20 missions in Module 4', icon: 'Brain', badgeColor: '#f97316', criteria: { type: 'module_completed', value: 'module-4', count: 20 }, points: 200 },
      { title: 'Metrics Master', description: 'Complete all 20 missions in Module 5', icon: 'Trophy', badgeColor: '#ef4444', criteria: { type: 'module_completed', value: 'module-5', count: 20 }, points: 200 },
      { title: 'Feature Engineering Wizard', description: 'Complete all 20 missions in Module 6', icon: 'Target', badgeColor: '#eab308', criteria: { type: 'module_completed', value: 'module-6', count: 20 }, points: 200 },
      { title: 'Unsupervised Learning Guru', description: 'Complete all 20 missions in Module 7', icon: 'Brain', badgeColor: '#6366f1', criteria: { type: 'module_completed', value: 'module-7', count: 20 }, points: 200 },
      { title: 'Optimization Expert', description: 'Complete all 20 missions in Module 8', icon: 'Zap', badgeColor: '#ec4899', criteria: { type: 'module_completed', value: 'module-8', count: 20 }, points: 200 },
      { title: 'Deep Learning Specialist', description: 'Complete all 20 missions in Module 9', icon: 'Brain', badgeColor: '#06b6d4', criteria: { type: 'module_completed', value: 'module-9', count: 20 }, points: 200 },
      { title: 'Computer Vision Pro', description: 'Complete all 20 missions in Module 10', icon: 'Target', badgeColor: '#14b8a6', criteria: { type: 'module_completed', value: 'module-10', count: 20 }, points: 200 },
      { title: 'NLP Expert', description: 'Complete all 20 missions in Module 11', icon: 'BookOpen', badgeColor: '#84cc16', criteria: { type: 'module_completed', value: 'module-11', count: 20 }, points: 200 },
      { title: 'ML Security Specialist', description: 'Complete all 20 missions in Module 12', icon: 'Zap', badgeColor: '#f43f5e', criteria: { type: 'module_completed', value: 'module-12', count: 20 }, points: 200 },
      { title: 'MLOps Professional', description: 'Complete all 20 missions in Module 13', icon: 'Code', badgeColor: '#0ea5e9', criteria: { type: 'module_completed', value: 'module-13', count: 20 }, points: 200 },
      { title: 'Testing Expert', description: 'Complete all 20 missions in Module 14', icon: 'Trophy', badgeColor: '#10b981', criteria: { type: 'module_completed', value: 'module-14', count: 20 }, points: 200 },
      { title: 'Real-World AI Master', description: 'Complete all 20 missions in Module 15', icon: 'Star', badgeColor: '#8b5cf6', criteria: { type: 'module_completed', value: 'module-15', count: 20 }, points: 200 },
      { title: 'AI Career Ready', description: 'Complete all 20 missions in Module 16', icon: 'Trophy', badgeColor: '#f59e0b', criteria: { type: 'module_completed', value: 'module-16', count: 20 }, points: 200 },
      { title: 'Curriculum Complete', description: 'Complete all 320 missions across all modules', icon: 'Award', badgeColor: '#dc2626', criteria: { type: 'all_missions', count: 320 }, points: 1000 },
      { title: 'Speed Runner', description: 'Complete 50 missions with average time under 30 minutes', icon: 'Zap', badgeColor: '#eab308', criteria: { type: 'speed_run', value: 30, count: 50 }, points: 300 },
      { title: 'Perfect Score', description: 'Achieve 100% on 25 missions', icon: 'Star', badgeColor: '#10b981', criteria: { type: 'perfect_scores', count: 25 }, points: 250 },
      { title: '30-Day Streak', description: 'Maintain a 30-day learning streak', icon: 'Flame', badgeColor: '#f97316', criteria: { type: 'streak', value: 30 }, points: 400 }
    ]

    for (const achievement of achievements) {
      await prisma.achievement.upsert({
        where: { id: achievement.title.toLowerCase().replace(/\s+/g, '-') },
        update: achievement,
        create: {
          ...achievement,
          id: achievement.title.toLowerCase().replace(/\s+/g, '-')
        }
      })
    }

    console.log('✅ Created 20 comprehensive achievements')

    // Update sample user progress
    await prisma.user.upsert({
      where: { email: 'learner@skillytics.com' },
      update: {
        level: 5,
        totalPoints: 1250,
        streak: 7
      },
      create: {
        email: 'learner@skillytics.com',
        name: 'Demo Learner',
        level: 5,
        totalPoints: 1250,
        streak: 7
      }
    })

    console.log('✅ Updated sample user with advanced progress')

    // Statistics
    const totalMissions = await prisma.mission.count()
    const totalModules = await prisma.skillModule.count()
    const totalAchievements = await prisma.achievement.count()

    console.log('\n🎉 Comprehensive Curriculum Seeding Completed!')
    console.log(`📚 ${totalModules} Skill Modules`)
    console.log(`🎯 ${totalMissions} Missions (${totalMissions}/320 created)`)
    console.log(`🏆 ${totalAchievements} Achievements`)
    console.log('\n🚀 Ready to transform ML education!')

  } catch (error) {
    console.error('❌ Error seeding curriculum:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()