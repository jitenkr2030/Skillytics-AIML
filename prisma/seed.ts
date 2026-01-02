import { PrismaClient, MissionType, Difficulty } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create skill modules
  const modules = await Promise.all([
    prisma.skillModule.upsert({
      where: { title: 'Data Thinking for ML' },
      update: {},
      create: {
        title: 'Data Thinking for ML',
        description: 'Learn to think like an ML engineer about data',
        order: 1,
        isLocked: false,
        icon: 'Database',
        color: '#3b82f6'
      }
    }),
    prisma.skillModule.upsert({
      where: { title: 'Python for ML' },
      update: {},
      create: {
        title: 'Python for ML',
        description: 'Master NumPy, Pandas, and ML libraries',
        order: 2,
        isLocked: false,
        icon: 'Code',
        color: '#10b981'
      }
    }),
    prisma.skillModule.upsert({
      where: { title: 'Data Cleaning & EDA' },
      update: {},
      create: {
        title: 'Data Cleaning & EDA',
        description: 'Clean messy data and find insights',
        order: 3,
        isLocked: false,
        icon: 'Database',
        color: '#8b5cf6'
      }
    }),
    prisma.skillModule.upsert({
      where: { title: 'Supervised Learning' },
      update: {},
      create: {
        title: 'Supervised Learning',
        description: 'Build your first predictive models',
        order: 4,
        isLocked: true,
        icon: 'Brain',
        color: '#f97316'
      }
    }),
    prisma.skillModule.upsert({
      where: { title: 'Model Evaluation' },
      update: {},
      create: {
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
      type: MissionType.MODEL_DEBUG,
      difficulty: Difficulty.INTERMEDIATE,
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
      type: MissionType.DATA_QUALITY,
      difficulty: Difficulty.BEGINNER,
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
    },
    {
      title: 'Choose the Right Algorithm',
      description: 'Given a problem, select the most appropriate ML algorithm.',
      context: 'A healthcare company wants to predict patient readmission risk. You need to analyze the problem and choose the best algorithm for the job.',
      type: MissionType.ALGORITHM_SELECTION,
      difficulty: Difficulty.INTERMEDIATE,
      points: 120,
      estimatedTime: 40,
      moduleId: modules[3].id,
      objectives: [
        'Analyze the problem requirements',
        'Compare different algorithms',
        'Justify your choice with evidence',
        'Consider interpretability vs performance'
      ],
      constraints: {
        maxTime: 60,
        requireJustification: true
      },
      validationRules: [
        { type: 'algorithm_justification' },
        { type: 'problem_analysis' },
        { type: 'tradeoff_consideration' }
      ],
      hints: [
        {
          level: 1,
          title: "Consider the data characteristics",
          content: "Look at the data size, feature types, and quality. What algorithms work well with this type of data?"
        },
        {
          level: 2,
          title: "Think about the business needs",
          content: "How important is interpretability? How fast does the prediction need to be?"
        }
      ],
      tags: JSON.stringify(['algorithm-selection', 'healthcare', 'classification', 'interpretability']),
      order: 1,
      isPublished: true
    },
    {
      title: 'Fix This Overfitting Model',
      description: 'A neural network performs perfectly on training data but fails on test data.',
      context: 'Your deep learning model achieves 99% accuracy on training data but only 65% on test data. Identify and fix the overfitting issues.',
      type: MissionType.TRAINING_OPTIMIZATION,
      difficulty: Difficulty.ADVANCED,
      points: 180,
      estimatedTime: 60,
      moduleId: modules[3].id,
      objectives: [
        'Identify signs of overfitting',
        'Apply regularization techniques',
        'Optimize hyperparameters',
        'Achieve better generalization'
      ],
      constraints: {
        maxTime: 90,
        maxTrainTestGap: 0.15
      },
      validationRules: [
        { type: 'overfitting_control' },
        { type: 'generalization_test' },
        { type: 'regularization_applied' }
      ],
      hints: [
        {
          level: 1,
          title: "Check the learning curves",
          content: "Plot training and validation performance over epochs. What do you see?"
        },
        {
          level: 2,
          title: "Consider regularization",
          content: "What techniques can prevent the model from memorizing training data?"
        }
      ],
      tags: JSON.stringify(['overfitting', 'neural-networks', 'regularization', 'optimization']),
      order: 2,
      isPublished: true
    },
    {
      title: 'Beyond Accuracy: Better Metrics',
      description: 'Learn why accuracy isn\'t always the best metric.',
      context: 'You\'re evaluating a disease detection model. Accuracy alone doesn\'t tell the whole story. Learn to use and interpret better metrics.',
      type: MissionType.EVALUATION_METRICS,
      difficulty: Difficulty.BEGINNER,
      points: 80,
      estimatedTime: 25,
      moduleId: modules[4].id,
      objectives: [
        'Understand confusion matrix',
        'Calculate precision, recall, and F1',
        'Interpret ROC curves',
        'Choose appropriate metrics'
      ],
      constraints: {
        maxTime: 40,
        requireMultipleMetrics: true
      },
      validationRules: [
        { type: 'confusion_matrix_correct' },
        { type: 'metrics_calculated' },
        { type: 'appropriate_metrics' }
      ],
      hints: [
        {
          level: 1,
          title: "Start with the confusion matrix",
          content: "Understanding true positives, false positives, true negatives, and false negatives is key."
        },
        {
          level: 2,
          title: "Think about the costs",
          content: "What's more expensive: a false positive or a false negative? This should guide your metric choice."
        }
      ],
      tags: JSON.stringify(['metrics', 'evaluation', 'confusion-matrix', 'precision-recall']),
      order: 1,
      isPublished: true
    }
  ]

  for (const mission of missions) {
    await prisma.mission.upsert({
      where: { title: mission.title },
      update: mission,
      create: mission
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
      title: 'Algorithm Expert',
      description: 'Successfully choose algorithms for 10 different problems',
      icon: 'Brain',
      badgeColor: '#8b5cf6',
      criteria: { type: 'mission_type_completed', value: 'ALGORITHM_SELECTION', count: 10 },
      points: 200
    },
    {
      title: '7-Day Streak',
      description: 'Maintain a 7-day learning streak',
      icon: 'Flame',
      badgeColor: '#f97316',
      criteria: { type: 'streak', value: 7 },
      points: 150
    },
    {
      title: 'Quick Learner',
      description: 'Complete a mission in under 20 minutes',
      icon: 'Zap',
      badgeColor: '#eab308',
      criteria: { type: 'speed_run', value: 20 },
      points: 75
    }
  ]

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { title: achievement.title },
      update: achievement,
      create: achievement
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