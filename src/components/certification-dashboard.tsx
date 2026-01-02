'use client';

import { useState, useEffect } from 'react';
import { 
  Trophy, 
  Award, 
  Clock, 
  Download, 
  ExternalLink, 
  CheckCircle2,
  Lock,
  ChevronRight,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface Certification {
  id: string;
  name: string;
  description: string;
  type: string;
  image?: string;
  minimumScore: number;
  isEarned: boolean;
  earnedAt?: string;
  score?: number;
  certificateHash?: string;
  progress: {
    percentage: number;
    completed: number;
    total: number;
  };
  canClaim: boolean;
}

interface CertificationDashboardProps {
  userId: string;
}

const certificationTypeLabels: Record<string, string> = {
  GENERAL: 'Complete Mastery',
  DATA_SCIENTIST: 'Data Science',
  MLOPS_ENGINEER: 'MLOps',
  COMPUTER_VISION: 'Computer Vision',
  NLP_ENGINEER: 'NLP',
  CAREER_READY: 'Career'
};

const certificationTypeColors: Record<string, string> = {
  GENERAL: 'bg-gradient-to-r from-yellow-400 to-orange-500',
  DATA_SCIENTIST: 'bg-gradient-to-r from-blue-400 to-cyan-500',
  MLOPS_ENGINEER: 'bg-gradient-to-r from-purple-400 to-pink-500',
  COMPUTER_VISION: 'bg-gradient-to-r from-green-400 to-emerald-500',
  NLP_ENGINEER: 'bg-gradient-to-r from-red-400 to-rose-500',
  CAREER_READY: 'bg-gradient-to-r from-indigo-400 to-violet-500'
};

export function CertificationDashboard({ userId }: CertificationDashboardProps) {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCertifications();
  }, [userId]);

  const fetchCertifications = async () => {
    try {
      const response = await fetch('/api/certifications');
      const data = await response.json();
      setCertifications(data.certifications || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load certifications',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimCertification = async (cert: Certification) => {
    setIsClaiming(true);
    try {
      const response = await fetch('/api/certifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificationId: cert.id })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: '🎉 Certification Earned!',
          description: data.message,
          variant: 'default'
        });
        fetchCertifications();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to claim certification',
        variant: 'destructive'
      });
    } finally {
      setIsClaiming(false);
    }
  };

  const handleDownloadCertificate = async (cert: Certification) => {
    if (!cert.certificateHash) return;

    window.open(`/api/certifications/download?hash=${cert.certificateHash}`, '_blank');
  };

  const handleVerifyCertificate = (cert: Certification) => {
    if (cert.certificateHash) {
      window.open(`/verify/${cert.certificateHash}`, '_blank');
    }
  };

  const earnedCerts = certifications.filter(c => c.isEarned);
  const inProgressCerts = certifications.filter(c => !c.isEarned && c.progress.percentage > 0);
  const lockedCerts = certifications.filter(c => c.progress.percentage === 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Certifications</p>
                <p className="text-3xl font-bold text-slate-900">{earnedCerts.length}</p>
              </div>
              <Trophy className="w-10 h-10 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">In Progress</p>
                <p className="text-3xl font-bold text-slate-900">{inProgressCerts.length}</p>
              </div>
              <Clock className="w-10 h-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Certificates Earned</p>
                <p className="text-3xl font-bold text-slate-900">{earnedCerts.reduce((sum, c) => sum + (c.score || 0), 0)}</p>
              </div>
              <Award className="w-10 h-10 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Available</p>
                <p className="text-3xl font-bold text-slate-900">{certifications.length - earnedCerts.length}</p>
              </div>
              <Star className="w-10 h-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certifications Grid */}
      <Tabs defaultValue="earned" className="space-y-6">
        <TabsList>
          <TabsTrigger value="earned">
            <Award className="w-4 h-4 mr-2" />
            Earned ({earnedCerts.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            <Clock className="w-4 h-4 mr-2" />
            In Progress ({inProgressCerts.length})
          </TabsTrigger>
          <TabsTrigger value="locked">
            <Lock className="w-4 h-4 mr-2" />
            Locked ({lockedCerts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="earned" className="space-y-4">
          {earnedCerts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  No Certifications Yet
                </h3>
                <p className="text-slate-500">
                  Complete missions to earn your first certification!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {earnedCerts.map((cert) => (
                <CertificationCard
                  key={cert.id}
                  certification={cert}
                  onDownload={handleDownloadCertificate}
                  onVerify={handleVerifyCertificate}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          {inProgressCerts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  No Certifications In Progress
                </h3>
                <p className="text-slate-500">
                  Start working on missions to begin earning certifications!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inProgressCerts.map((cert) => (
                <CertificationCard
                  key={cert.id}
                  certification={cert}
                  onClaim={() => handleClaimCertification(cert)}
                  isClaiming={isClaiming}
                  progress={cert.progress}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="locked" className="space-y-4">
          {lockedCerts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  All Certifications Unlocked!
                </h3>
                <p className="text-slate-500">
                  Complete more missions to unlock all certifications.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lockedCerts.map((cert) => (
                <CertificationCard
                  key={cert.id}
                  certification={cert}
                  isLocked
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Certification Detail Modal */}
      {selectedCert && (
        <CertificationDetailModal
          certification={selectedCert}
          onClose={() => setSelectedCert(null)}
          onClaim={() => handleClaimCertification(selectedCert)}
          onDownload={() => handleDownloadCertificate(selectedCert)}
          onVerify={() => handleVerifyCertificate(selectedCert)}
          isClaiming={isClaiming}
        />
      )}
    </div>
  );
}

interface CertificationCardProps {
  certification: Certification;
  onClaim?: () => void;
  onDownload?: () => void;
  onVerify?: () => void;
  isClaiming?: boolean;
  progress?: {
    percentage: number;
    completed: number;
    total: number;
  };
  isLocked?: boolean;
}

function CertificationCard({
  certification,
  onClaim,
  onDownload,
  onVerify,
  isClaiming,
  progress,
  isLocked
}: CertificationCardProps) {
  const [showDetail, setShowDetail] = useState(false);

  const badgeColor = certificationTypeColors[certification.type] || 'bg-slate-500';

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
      certification.isEarned ? 'border-green-200 bg-gradient-to-br from-green-50 to-white' : ''
    }`}>
      {/* Header with Badge */}
      <div className={`h-24 ${badgeColor} flex items-center justify-center relative`}>
        {certification.isEarned ? (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
            <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center">
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        ) : isLocked ? (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
            <div className="w-16 h-16 bg-slate-100 rounded-full shadow-lg flex items-center justify-center">
              <Lock className="w-8 h-8 text-slate-400" />
            </div>
          </div>
        ) : null}
      </div>

      <CardContent className="pt-10 pb-6">
        <div className="text-center mb-4">
          <Badge variant="secondary" className="mb-2">
            {certificationTypeLabels[certification.type]}
          </Badge>
          <h3 className="font-bold text-lg text-slate-900">{certification.name}</h3>
          <p className="text-sm text-slate-500 mt-1">{certification.description}</p>
        </div>

        {/* Progress Bar */}
        {progress && !certification.isEarned && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-500">Progress</span>
              <span className="font-medium text-slate-700">{progress.percentage}%</span>
            </div>
            <Progress value={progress.percentage} className="h-2" />
            <p className="text-xs text-slate-400 mt-1">
              {progress.completed}/{progress.total} requirements completed
            </p>
          </div>
        )}

        {/* Score Display */}
        {certification.isEarned && certification.score !== undefined && (
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              <Star className="w-4 h-4 fill-current" />
              Score: {Math.round(certification.score)}%
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {certification.isEarned ? (
            <>
              <Button variant="outline" size="sm" onClick={onDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="ghost" size="sm" onClick={onVerify}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Verify
              </Button>
            </>
          ) : certification.canClaim ? (
            <Button 
              size="sm" 
              onClick={onClaim}
              disabled={isClaiming}
              className="w-full"
            >
              {isClaiming ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Claiming...
                </>
              ) : (
                <>
                  <Award className="w-4 h-4 mr-2" />
                  Claim Certification
                </>
              )}
            </Button>
          ) : isLocked ? (
            <Button variant="outline" size="sm" disabled className="w-full">
              <Lock className="w-4 h-4 mr-2" />
              Complete Previous Modules
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

interface CertificationDetailModalProps {
  certification: Certification;
  onClose: () => void;
  onClaim?: () => void;
  onDownload?: () => void;
  onVerify?: () => void;
  isClaiming?: boolean;
}

function CertificationDetailModal({
  certification,
  onClose,
  onClaim,
  onDownload,
  onVerify,
  isClaiming
}: CertificationDetailModalProps) {
  const badgeColor = certificationTypeColors[certification.type] || 'bg-slate-500';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className={`h-32 ${badgeColor} relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <div className="px-8 pb-8">
          <div className="relative -mt-12 mb-6">
            <div className={`w-24 h-24 ${certification.isEarned ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-slate-200'} rounded-xl flex items-center justify-center shadow-lg`}>
              {certification.isEarned ? (
                <Trophy className="w-12 h-12 text-white" />
              ) : (
                <Award className="w-12 h-12 text-slate-400" />
              )}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {certification.name}
          </h2>
          
          <Badge variant="secondary" className="mb-4">
            {certificationTypeLabels[certification.type]}
          </Badge>

          <p className="text-slate-600 mb-6">
            {certification.description}
          </p>

          {certification.isEarned ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-500">Earned On</p>
                  <p className="font-medium text-slate-900">
                    {certification.earnedAt ? new Date(certification.earnedAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-500">Score</p>
                  <p className="font-medium text-slate-900">
                    {certification.score ? `${Math.round(certification.score)}%` : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={onDownload} className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download Certificate
                </Button>
                <Button variant="outline" onClick={onVerify}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Verify
                </Button>
              </div>
            </div>
          ) : certification.canClaim ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Requirements Met!</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  You've completed all requirements for this certification.
                </p>
              </div>

              <Button 
                onClick={onClaim} 
                disabled={isClaiming}
                className="w-full"
                size="lg"
              >
                {isClaiming ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Generating Certificate...
                  </>
                ) : (
                  <>
                    <Award className="w-5 h-5 mr-2" />
                    Claim Certification
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-500 mb-2">Requirements Progress</p>
                <Progress value={certification.progress.percentage} className="h-3" />
                <p className="text-sm text-slate-500 mt-2">
                  {certification.progress.completed} of {certification.progress.total} requirements completed
                </p>
              </div>

              <Button asChild className="w-full" size="lg">
                <a href="/mission-map">
                  Continue Learning
                  <ChevronRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CertificationDashboard;
