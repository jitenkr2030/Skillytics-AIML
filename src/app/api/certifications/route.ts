// ============================================
// Skillytics Certification API Routes
// Handles certification management, issuance, and verification
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { CertificationType } from '@prisma/client';

// GET /api/certifications - Get available certifications and user progress
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Certifications are visible to everyone, but progress requires auth
    const { searchParams } = new URL(request.url);
    const certificationId = searchParams.get('id');
    const verifyHash = searchParams.get('verify');

    // Public verification endpoint
    if (verifyHash) {
      const userCert = await db.userCertification.findUnique({
        where: { certificateHash: verifyHash },
        include: {
          user: { select: { name: true, avatar: true } },
          certification: true
        }
      });

      if (!userCert) {
        return NextResponse.json({ valid: false, error: 'Certificate not found' }, { status: 404 });
      }

      // Check if expired
      if (userCert.expiryDate && new Date(userCert.expiryDate) < new Date()) {
        return NextResponse.json({ 
          valid: false, 
          expired: true,
          message: 'This certificate has expired',
          certification: {
            name: userCert.certification.name,
            type: userCert.certification.type
          },
          holder: {
            name: userCert.user.name
          }
        }, { status: 200 });
      }

      return NextResponse.json({
        valid: true,
        certification: {
          id: userCert.certification.id,
          name: userCert.certification.name,
          type: userCert.certification.type,
          description: userCert.certification.description
        },
        holder: {
          name: userCert.user.name,
          avatar: userCert.user.avatar
        },
        issuedAt: userCert.issueDate,
        expiryDate: userCert.expiryDate,
        score: userCert.score,
        verificationUrl: userCert.verificationUrl
      });
    }

    // Get all certifications
    if (!session?.user?.id) {
      const certifications = await db.certification.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
        select: {
          id: true,
          name: true,
          description: true,
          type: true,
          image: true,
          requiredMissions: true,
          requiredModules: true,
          minimumScore: true,
          order: true
        }
      });

      return NextResponse.json({ certifications });
    }

    // Get certifications with user progress
    const userId = session.user.id;

    // Get user's completed missions and modules
    const completedProgress = await db.missionProgress.findMany({
      where: { 
        userId,
        status: { in: ['COMPLETED', 'MASTERED'] }
      },
      select: { missionId: true, bestScore: true }
    });

    const completedMissionIds = new Set(completedProgress.map(p => p.missionId));
    const userModules = await db.userEnrollment.findMany({
      where: { userId },
      select: { moduleId: true, completedAt: true }
    });
    const completedModuleIds = new Set(userModules.filter(m => m.completedAt).map(m => m.moduleId));

    // Get all certifications
    const certifications = await db.certification.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    // Get user's certifications
    const userCertifications = await db.userCertification.findMany({
      where: { userId },
      include: { certification: true }
    });

    const earnedCertIds = new Set(userCertifications.map(uc => uc.certificationId));

    // Calculate progress for each certification
    const certificationsWithProgress = certifications.map(cert => {
      const isEarned = earnedCertIds.has(cert.id);
      
      // Parse requirements
      const requiredMissions: string[] = JSON.parse(cert.requiredMissions);
      const requiredModules: string[] = JSON.parse(cert.requiredModules);

      let progress = 0;
      let totalRequirements = 0;

      if (requiredMissions.length > 0) {
        totalRequirements += requiredMissions.length;
        const completedMissions = requiredMissions.filter(m => completedMissionIds.has(m)).length;
        progress += completedMissions;
      }

      if (requiredModules.length > 0) {
        totalRequirements += requiredModules.length;
        const completedModules = requiredModules.filter(m => completedModuleIds.has(m)).length;
        progress += completedModules;
      }

      const percentage = totalRequirements > 0 ? Math.round((progress / totalRequirements) * 100) : 0;

      // Find user's score for this certification
      const userCert = userCertifications.find(uc => uc.certificationId === cert.id);

      return {
        id: cert.id,
        name: cert.name,
        description: cert.description,
        type: cert.type,
        image: cert.image,
        minimumScore: cert.minimumScore,
        isEarned,
        earnedAt: userCert?.issueDate,
        score: userCert?.score,
        certificateHash: userCert?.certificateHash,
        progress: {
          percentage,
          completed: progress,
          total: totalRequirements
        },
        canClaim: percentage >= 100 && !isEarned
      };
    });

    return NextResponse.json({
      certifications: certificationsWithProgress,
      earnedCount: userCertifications.length,
      totalPoints: user.totalPoints
    });
  } catch (error) {
    console.error('Certification API error:', error);
    return NextResponse.json({ error: 'Failed to fetch certifications' }, { status: 500 });
  }
}

// POST /api/certifications - Claim certification
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { certificationId } = body;

    if (!certificationId) {
      return NextResponse.json({ error: 'Certification ID required' }, { status: 400 });
    }

    const userId = session.user.id;

    // Get certification details
    const certification = await db.certification.findUnique({
      where: { id: certificationId }
    });

    if (!certification) {
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
    }

    // Check if already earned
    const existingCert = await db.userCertification.findUnique({
      where: {
        userId_certificationId: {
          userId,
          certificationId
        }
      }
    });

    if (existingCert) {
      return NextResponse.json({ error: 'Already earned this certification' }, { status: 400 });
    }

    // Verify requirements are met
    const requiredMissions: string[] = JSON.parse(certification.requiredMissions);
    const requiredModules: string[] = JSON.parse(certification.requiredModules);

    // Check mission requirements
    if (requiredMissions.length > 0) {
      const completedProgress = await db.missionProgress.findMany({
        where: {
          userId,
          missionId: { in: requiredMissions },
          status: { in: ['COMPLETED', 'MASTERED'] }
        }
      });

      if (completedProgress.length < requiredMissions.length) {
        return NextResponse.json({ 
          error: 'Requirements not met',
          message: `You need to complete ${requiredMissions.length - completedProgress.length} more missions`
        }, { status: 400 });
      }

      // Check minimum score
      const scores = completedProgress.map(p => p.bestScore || 0);
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      
      if (avgScore < certification.minimumScore) {
        return NextResponse.json({ 
          error: 'Minimum score not met',
          message: `Average score of ${Math.round(avgScore)}% is below the required ${certification.minimumScore}%`
        }, { status: 400 });
      }
    }

    // Check module requirements
    if (requiredModules.length > 0) {
      const completedModules = await db.userEnrollment.findMany({
        where: {
          userId,
          moduleId: { in: requiredModules },
          completedAt: { not: null }
        }
      });

      if (completedModules.length < requiredModules.length) {
        return NextResponse.json({ 
          error: 'Requirements not met',
          message: `You need to complete ${requiredModules.length - completedModules.length} more modules`
        }, { status: 400 });
      }
    }

    // Generate certificate
    const certificateHash = uuidv4();
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify/${certificateHash}`;

    // Calculate expiry (2 years from now for most certifications)
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 2);

    // Create certification record
    const userCertification = await db.userCertification.create({
      data: {
        userId,
        certificationId,
        certificateHash,
        verificationUrl,
        expiryDate,
        score: 0 // Will be calculated from best scores
      }
    });

    // Award points for certification
    const pointsEarned = 500; // Base points for certification
    await db.user.update({
      where: { id: userId },
      data: { totalPoints: { increment: pointsEarned } }
    });

    // Create achievement if exists
    const achievement = await db.achievement.findFirst({
      where: {
        criteria: JSON.stringify({ type: 'certification_earned' })
      }
    });

    if (achievement) {
      await db.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: `Congratulations! You've earned the ${certification.name} certification!`,
      certification: {
        id: certification.id,
        name: certification.name,
        type: certification.type,
        certificateHash,
        verificationUrl,
        pointsEarned
      }
    });
  } catch (error) {
    console.error('Certification claim error:', error);
    return NextResponse.json({ error: 'Failed to claim certification' }, { status: 500 });
  }
}
