import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { CertificationDashboard } from '@/components/certification-dashboard';

export const metadata: Metadata = {
  title: 'Certifications - Skillytics',
  description: 'Earn certifications to showcase your AI/ML skills',
};

export default async function CertificationsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  // Fetch certifications data
  const certifications = await db.certification.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' }
  });

  const userCertifications = await db.userCertification.findMany({
    where: { userId: session.user.id },
    select: { certificationId: true }
  });

  const earnedCertIds = new Set(userCertifications.map(uc => uc.certificationId));

  // Get user progress data
  const completedProgress = await db.missionProgress.findMany({
    where: {
      userId: session.user.id,
      status: { in: ['COMPLETED', 'MASTERED'] }
    },
    select: { missionId: true, bestScore: true }
  });

  const completedMissionIds = new Set(completedProgress.map(p => p.missionId));

  const userModules = await db.userEnrollment.findMany({
    where: { userId: session.user.id },
    select: { moduleId: true, completedAt: true }
  });

  const completedModuleIds = new Set(userModules.filter(m => m.completedAt).map(m => m.moduleId));

  // Calculate progress for each certification
  const certificationsWithProgress = certifications.map(cert => {
    const isEarned = earnedCertIds.has(cert.id);

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

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Certifications
          </h1>
          <p className="text-slate-600">
            Earn industry-recognized certifications to showcase your AI/ML expertise
          </p>
        </div>

        {/* Certification Dashboard */}
        <CertificationDashboard userId={session.user.id} />
      </div>
    </div>
  );
}
