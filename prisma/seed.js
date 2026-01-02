const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create skill modules
  const modules = await Promise.all([
    prisma.skillModule.upsert({
      where: { id: 'module-1' },
      update: {
        title: 'Data Thinking for ML',
        description: 'Learn to think like an ML engineer about data',
        order: 1,
        isLocked: false,
        icon: 'Database',
        color: '#3b82f6'
      },
      create: {
        id: 'module-1',
        title: 'Data Thinking for ML',
        description: 'Learn to think like an ML engineer about data',
        order: 1,
        isLocked: false,
        icon: 'Database',
        color: '#3b82f6'
      }
    }),
    prisma.skillModule.upsert({
      where: { id: 'module-2' },
      update: {
        title: 'Python for ML',
        description: 'Master NumPy, Pandas, and ML libraries',
        order: 2,
        isLocked: false,
        icon: 'Code',
        color: '#10b981'
      },
      create: {
        id: 'module-2',
        title: 'Python for ML',
        description: 'Master NumPy, Pandas, and ML libraries',
        order: 2,
        isLocked: false,
        icon: 'Code',
        color: '#10b981'
      }
    }),
    prisma.skillModule.upsert({
      where: { id: 'module-3' },
      update: {
        title: 'Data Cleaning & EDA',
        description: 'Clean messy data and find insights',
        order: 3,
        isLocked: false,
        icon: 'Database',
        color: '#8b5cf6'
      },
      create: {
        id: 'module-3',
        title: 'Data Cleaning & EDA',
        description: 'Clean messy data and find insights',
        order: 3,
        isLocked: false,
        icon: 'Database',
        color: '#8b5cf6'
      }
    }),
    prisma.skillModule.upsert({
      where: { id: 'module-4' },
      update: {
        title: 'Supervised Learning',
        description: 'Build your first predictive models',
        order: 4,
        isLocked: true,
        icon: 'Brain',
        color: '#f97316'
      },
      create: {
        id: 'module-4',
        title: 'Supervised Learning',
        description: 'Build your first predictive models',
        order: 4,
        isLocked: true,
        icon: 'Brain',
        color: '#f97316'
      }
    }),
    prisma.skillModule.upsert({
      where: { id: 'module-5' },
      update: {
        title: 'Model Evaluation',
        description: 'Learn to measure model performance',
        order: 5,
        isLocked: true,
        icon: 'Trophy',
        color: '#ef4444'
      },
      create: {
        id: 'module-5',
        title: 'Model Evaluation',
        description: 'Learn to measure model performance',
        order: 5,
        isLocked: true,
        icon: 'Trophy',
        color: '#ef4444'
      }
    })
  ])

  console.log('✅ Created skill modules')

  // Create sample missions
  const missions = [
    {
      title: 'Why Is This Fraud Model Failing?',
      description: 'A bank fraud detection model shows 99% accuracy but fails in production. Find and fix the issues.',
      context: 'You\'re an ML engineer at a major bank. The fraud detection model you inherited shows amazing accuracy in testing, but when deployed, it\'s missing 80% of actual fraud cases. The business is losing millions and your job is on the line.',
      type: 'MODEL_DEBUG',
      difficulty: 'INTERMEDIATE',
      points: 150,
      estimatedTime: 45,
      moduleId: modules[0].id,
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
      validationRules: [
        { type: 'min_recall', expected: 0.85 },
        { type: 'min_precision', expected: 0.3 },
        { type: 'no_data_leakage' },
        { type: 'correct_metrics' }
      ],
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
      ],
      tags: JSON.stringify(['fraud', 'imbalanced', 'classification', 'debugging']),
      order: 1,
      isPublished: true
    },
    {
      title: 'Clean This Customer Dataset',
      description: 'A messy customer dataset needs cleaning before model training.',
      context: 'You\'re working on a customer churn prediction model. The dataset is full of missing values, outliers, and inconsistencies. Clean it up to make it ready for ML.',
      type: 'DATA_QUALITY',
      difficulty: 'BEGINNER',
      points: 100,
      estimatedTime: 30,
      moduleId: modules[2].id,
      objectives: [
        'Handle missing values appropriately',
        'Remove or correct outliers',
        'Standardize data formats',
        'Document your cleaning process'
      ],
      constraints: {
        maxTime: 45,
        minDataRetention: 0.8
      },
      validationRules: [
        { type: 'no_missing_values' },
        { type: 'data_retention', expected: 0.8 },
        { type: 'proper_types' }
      ],
      hints: [
        {
          level: 1,
          title: "Start with missing values",
          content: "Identify which columns have missing values and decide on the best strategy for each."
        },
        {
          level: 2,
          title: "Consider the business context",
          content: "Some missing values might be meaningful. Think about what 'missing' means in each case."
        }
      ],
      tags: JSON.stringify(['cleaning', 'missing-values', 'outliers', 'preprocessing']),
      order: 1,
      isPublished: true
    }
  ]

  for (const mission of missions) {
    await prisma.mission.upsert({
      where: { id: mission.title.toLowerCase().replace(/\s+/g, '-') },
      update: mission,
      create: {
        ...mission,
        id: mission.title.toLowerCase().replace(/\s+/g, '-')
      }
    })
  }

  console.log('✅ Created missions')

  // Create achievements
  const achievements = [
    {
      title: 'First Bug Fix',
      description: 'Successfully debug your first model',
      icon: 'Bug',
      badgeColor: '#10b981',
      criteria: { type: 'mission_type_completed', value: 'MODEL_DEBUG', count: 1 },
      points: 50
    },
    {
      title: 'Data Cleaning Pro',
      description: 'Complete 5 data quality missions',
      icon: 'Sparkles',
      badgeColor: '#3b82f6',
      criteria: { type: 'mission_type_completed', value: 'DATA_QUALITY', count: 5 },
      points: 100
    },
    {
      title: '7-Day Streak',
      description: 'Maintain a 7-day learning streak',
      icon: 'Flame',
      badgeColor: '#f97316',
      criteria: { type: 'streak', value: 7 },
      points: 150
    }
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

  console.log('✅ Created achievements')

  // Create sample user
  const user = await prisma.user.upsert({
    where: { email: 'learner@skillytics.com' },
    update: {},
    create: {
      email: 'learner@skillytics.com',
      name: 'Demo Learner',
      level: 3,
      totalPoints: 450,
      streak: 5
    }
  })

  console.log('✅ Created sample user')
  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })