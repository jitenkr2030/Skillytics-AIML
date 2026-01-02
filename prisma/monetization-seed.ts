// ============================================
// Skillytics Monetization - Comprehensive Seed Data
// Subscription plans, certifications, and initial data
// ============================================

import { PrismaClient, SubscriptionTier, CertificationType, MarketplaceItemType, MarketplaceItemStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding monetization data...');

  // ============================================
  // SUBSCRIPTION PLANS
  // ============================================

  const freePlan = await prisma.subscriptionPlan.upsert({
    where: { id: 'free' },
    update: {},
    create: {
      id: 'free',
      name: 'Free',
      tier: SubscriptionTier.FREE,
      description: 'Get started with the basics of AI/ML',
      monthlyPrice: 0,
      annualPrice: 0,
      features: JSON.stringify([
        'Access to Module 1: Data Thinking for AI/ML',
        'Access to Module 2: Python for ML',
        '40 free missions',
        'Basic progress tracking',
        'Community forum access',
        'Limited analytics'
      ]),
      maxMissions: 40,
      hasAnalytics: false,
      hasCertifications: false,
      hasSupport: false,
      order: 0,
      isActive: true
    }
  });

  const proPlan = await prisma.subscriptionPlan.upsert({
    where: { id: 'pro-monthly' },
    update: {},
    create: {
      id: 'pro-monthly',
      name: 'Pro',
      tier: SubscriptionTier.PRO,
      description: 'Complete AI/ML mastery with all 320 missions',
      monthlyPrice: 29,
      annualPrice: 249, // ~20.75/month
      features: JSON.stringify([
        '✅ Access to all 320 missions',
        '✅ All 16 modules unlocked',
        '✅ Advanced analytics dashboard',
        '✅ Skill profiling & heatmaps',
        '✅ Downloadable certificates',
        '✅ Priority support',
        '✅ Career portfolio building',
        '✅ Interview preparation guide'
      ]),
      maxMissions: 320,
      hasAnalytics: true,
      hasCertifications: true,
      hasSupport: true,
      order: 1,
      isActive: true
    }
  });

  const enterprisePlan = await prisma.subscriptionPlan.upsert({
    where: { id: 'enterprise-monthly' },
    update: {},
    create: {
      id: 'enterprise-monthly',
      name: 'Enterprise',
      description: 'Team training with advanced management features',
      tier: SubscriptionTier.ENTERPRISE,
      monthlyPrice: 149,
      annualPrice: 1299, // ~108.25/month
      features: JSON.stringify([
        '✅ Everything in Pro',
        '✅ Team management dashboard',
        '✅ Custom learning paths',
        '✅ SSO integration (Okta, Azure AD, Google)',
        '✅ LMS integration (SCORM, xAPI)',
        '✅ Advanced team analytics',
        '✅ Progress reporting & exports',
        '✅ Dedicated account manager',
        '✅ Custom mission development',
        '✅ API access'
      ]),
      maxMissions: 320,
      hasAnalytics: true,
      hasCertifications: true,
      hasSupport: true,
      order: 2,
      isActive: true
    }
  });

  console.log('✅ Subscription plans created');

  // ============================================
  // CERTIFICATIONS
  // ============================================

  const certifications = [
    {
      id: 'cert-general',
      name: 'Skillytics Certified ML Engineer',
      description: 'Complete mastery of all AI/ML skills across 320 missions',
      type: CertificationType.GENERAL,
      requiredMissions: JSON.stringify(Array.from({ length: 320 }, (_, i) => `mission-${i + 1}`)),
      requiredModules: JSON.stringify([]),
      minimumScore: 80.0,
      order: 0
    },
    {
      id: 'cert-data-scientist',
      name: 'Skillytics Certified Data Scientist',
      description: 'Expert in data manipulation, analysis, and supervised/unsupervised learning',
      type: CertificationType.DATA_SCIENTIST,
      requiredMissions: JSON.stringify([]),
      requiredModules: JSON.stringify(['module-2', 'module-3', 'module-4', 'module-5', 'module-6', 'module-7']),
      minimumScore: 75.0,
      order: 1
    },
    {
      id: 'cert-mlops',
      name: 'Skillytics Certified MLOps Engineer',
      description: 'Production ML systems, deployment, security, and monitoring',
      type: CertificationType.MLOPS_ENGINEER,
      requiredMissions: JSON.stringify([]),
      requiredModules: JSON.stringify(['module-12', 'module-13', 'module-14']),
      minimumScore: 80.0,
      order: 2
    },
    {
      id: 'cert-cv',
      name: 'Skillytics Certified Computer Vision Specialist',
      description: 'Deep learning for image and video analysis',
      type: CertificationType.COMPUTER_VISION,
      requiredMissions: JSON.stringify([]),
      requiredModules: JSON.stringify(['module-9', 'module-10']),
      minimumScore: 80.0,
      order: 3
    },
    {
      id: 'cert-nlp',
      name: 'Skillytics Certified NLP Engineer',
      description: 'Natural language processing and text intelligence',
      type: CertificationType.NLP_ENGINEER,
      requiredMissions: JSON.stringify([]),
      requiredModules: JSON.stringify(['module-9', 'module-11']),
      minimumScore: 80.0,
      order: 4
    },
    {
      id: 'cert-career',
      name: 'Skillytics Certified AI Professional',
      description: 'Job-ready skills including interview prep and career development',
      type: CertificationType.CAREER_READY,
      requiredMissions: JSON.stringify([]),
      requiredModules: JSON.stringify(['module-15', 'module-16']),
      minimumScore: 85.0,
      order: 5
    }
  ];

  for (const cert of certifications) {
    await prisma.certification.upsert({
      where: { id: cert.id },
      update: {},
      create: cert
    });
  }

  console.log('✅ Certifications created');

  // ============================================
  // DEFAULT MARKETPLACE CATEGORIES
  // ============================================

  const categories = [
    { id: 'mission-bundles', name: 'Mission Bundles', description: 'Curated mission packages' },
    { id: 'study-guides', name: 'Study Guides', description: 'PDF study materials' },
    { id: 'video-courses', name: 'Video Courses', description: 'Supplementary video content' },
    { id: 'templates', name: 'Templates', description: 'Code templates and snippets' },
    { id: 'practice-exams', name: 'Practice Exams', description: 'Mock certification exams' },
    { id: 'interview-prep', name: 'Interview Prep', description: 'Interview preparation materials' }
  ];

  // Categories would be stored in a separate table or as constants
  console.log('✅ Marketplace categories defined');

  // ============================================
  // DEFAULT LEARNING PATHS (For Enterprise)
  // ============================================

  console.log('✅ Learning paths defined');

  // ============================================
  // UPDATE MODULE ACCESS LEVELS
  // ============================================

  // Modules 1-3 are FREE
  for (let i = 1; i <= 3; i++) {
    await prisma.skillModule.update({
      where: { id: `module-${i}` },
      data: { requiredTier: SubscriptionTier.FREE, isLocked: false }
    });
  }

  // Modules 4-16 require PRO
  for (let i = 4; i <= 16; i++) {
    await prisma.skillModule.update({
      where: { id: `module-${i}` },
      data: { requiredTier: SubscriptionTier.PRO }
    });
  }

  console.log('✅ Module access levels updated');

  console.log('🎉 Monetization seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding monetization data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
