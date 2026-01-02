'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  BarChart3, 
  Settings, 
  Plus, 
  Mail,
  MoreVertical,
  Crown,
  Shield,
  User,
  TrendingUp,
  Clock,
  Trophy,
  Target,
  ChevronRight,
  Link as LinkIcon,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface Organization {
  id: string;
  name: string;
  domain?: string;
  logo?: string;
  maxSeats: number;
  ssoEnabled: boolean;
  ssoProvider?: string;
}

interface TeamMember {
  id: string;
  name?: string;
  email: string;
  avatar?: string;
  totalPoints: number;
  streak: number;
  lastActiveAt: string;
  organizationRole: string;
  completedMissions: number;
}

interface TeamAnalytics {
  totalMembers: number;
  activeMembers: number;
  totalMissionsCompleted: number;
  averageScore: number;
  skillBreakdown: {
    bugFixes?: number;
    modelsImproved?: number;
    dataCleaned?: number;
    algorithmsChosen?: number;
  };
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  expiresAt: string;
}

interface EnterpriseDashboardProps {
  userId: string;
}

const roleIcons: Record<string, React.ElementType> = {
  OWNER: Crown,
  ADMIN: Shield,
  MEMBER: User
};

const roleColors: Record<string, string> = {
  OWNER: 'bg-yellow-100 text-yellow-700',
  ADMIN: 'bg-purple-100 text-purple-700',
  MEMBER: 'bg-slate-100 text-slate-700'
};

export function EnterpriseDashboard({ userId }: EnterpriseDashboardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasEnterprise, setHasEnterprise] = useState(false);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [analytics, setAnalytics] = useState<TeamAnalytics | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('MEMBER');
  const [isInviting, setIsInviting] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    checkEnterpriseAccess();
  }, [userId]);

  const checkEnterpriseAccess = async () => {
    try {
      const response = await fetch('/api/enterprise?action=check');
      const data = await response.json();
      setHasEnterprise(data.hasEnterprise);

      if (data.hasEnterprise) {
        fetchOrganizationData();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to check enterprise access',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrganizationData = async () => {
    try {
      const [orgRes, membersRes, analyticsRes, invitesRes] = await Promise.all([
        fetch('/api/enterprise?action=organization'),
        fetch('/api/enterprise?action=team'),
        fetch('/api/enterprise?action=analytics'),
        fetch('/api/enterprise?action=invitations')
      ]);

      const [orgData, membersData, analyticsData, invitesData] = await Promise.all([
        orgRes.json(),
        membersRes.json(),
        analyticsRes.json(),
        invitesRes.json()
      ]);

      setOrganization(orgData.organization);
      setMembers(membersData.members);
      setAnalytics(analyticsData.overview);
      setInvitations(invitesData.invitations || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load organization data',
        variant: 'destructive'
      });
    }
  };

  const handleCreateOrganization = async () => {
    const name = prompt('Enter organization name:');
    if (!name) return;

    try {
      const response = await fetch('/api/enterprise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_organization',
          name
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Organization Created',
          description: `Welcome to ${data.organization.name}!`,
          variant: 'default'
        });
        fetchOrganizationData();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create organization',
        variant: 'destructive'
      });
    }
  };

  const handleInviteMember = async () => {
    if (!inviteEmail) {
      toast({
        title: 'Error',
        description: 'Please enter an email address',
        variant: 'destructive'
      });
      return;
    }

    setIsInviting(true);
    try {
      const response = await fetch('/api/enterprise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'invite_member',
          email: inviteEmail,
          role: inviteRole
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Invitation Sent',
          description: `Invitation sent to ${inviteEmail}`,
          variant: 'default'
        });
        setShowInviteDialog(false);
        setInviteEmail('');
        fetchOrganizationData();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send invitation',
        variant: 'destructive'
      });
    } finally {
      setIsInviting(false);
    }
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasEnterprise) {
    return <EnterpriseUpgradeCTA />;
  }

  return (
    <div className="space-y-8">
      {/* Organization Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{organization?.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  {organization?.domain && (
                    <Badge variant="outline">{organization.domain}</Badge>
                  )}
                  {organization?.ssoEnabled && (
                    <Badge className="bg-green-100 text-green-700">
                      <Lock className="w-3 h-3 mr-1" />
                      SSO Enabled
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setShowInviteDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Invite Member
              </Button>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Team Members</p>
                <p className="text-3xl font-bold text-slate-900">
                  {analytics?.totalMembers || 0}
                  <span className="text-sm font-normal text-slate-500 ml-2">
                    / {organization?.maxSeats || '∞'}
                  </span>
                </p>
              </div>
              <Users className="w-10 h-10 text-blue-500" />
            </div>
            <div className="mt-2 text-sm text-green-600">
              {analytics?.activeMembers || 0} active this week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Missions Completed</p>
                <p className="text-3xl font-bold text-slate-900">
                  {analytics?.totalMissionsCompleted || 0}
                </p>
              </div>
              <Trophy className="w-10 h-10 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Average Score</p>
                <p className="text-3xl font-bold text-slate-900">
                  {analytics ? `${Math.round(analytics.averageScore)}%` : '0%'}
                </p>
              </div>
              <Target className="w-10 h-10 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Top Skill</p>
                <p className="text-lg font-bold text-slate-900">
                  {getTopSkill(analytics?.skillBreakdown)}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="members">
            <Users className="w-4 h-4 mr-2" />
            Members
          </TabsTrigger>
          <TabsTrigger value="learning-paths">
            <Target className="w-4 h-4 mr-2" />
            Learning Paths
          </TabsTrigger>
          <TabsTrigger value="invitations">
            <Mail className="w-4 h-4 mr-2" />
            Invitations
            {invitations.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {invitations.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Team Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Team Leaderboard</span>
                <Button variant="ghost" size="sm">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.slice(0, 5).map((member, index) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-slate-200 text-slate-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                      {member.name?.charAt(0) || member.email.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">
                          {member.name || 'Team Member'}
                        </span>
                        {member.organizationRole !== 'MEMBER' && (
                          <Badge className={`text-xs ${roleColors[member.organizationRole]}`}>
                            {member.organizationRole}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-500">{member.completedMissions} missions</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{member.totalPoints.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skill Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Team Skill Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SkillMetric
                  label="Bug Fixes"
                  value={analytics?.skillBreakdown?.bugFixes || 0}
                  color="bg-red-500"
                />
                <SkillMetric
                  label="Models Improved"
                  value={analytics?.skillBreakdown?.modelsImproved || 0}
                  color="bg-blue-500"
                />
                <SkillMetric
                  label="Data Cleaned"
                  value={analytics?.skillBreakdown?.dataCleaned || 0}
                  color="bg-green-500"
                />
                <SkillMetric
                  label="Algorithms"
                  value={analytics?.skillBreakdown?.algorithmsChosen || 0}
                  color="bg-purple-500"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              All Members ({members.length})
            </h3>
            <Button onClick={() => setShowInviteDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                        {member.name?.charAt(0) || member.email.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900">
                            {member.name || 'Team Member'}
                          </span>
                          <Badge className={`text-xs ${roleColors[member.organizationRole]}`}>
                            {member.organizationRole}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-right">
                      <div>
                        <p className="font-medium text-slate-900">{member.totalPoints.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">points</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{member.completedMissions}</p>
                        <p className="text-xs text-slate-500">missions</p>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{formatLastActive(member.lastActiveAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning-paths" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Learning Paths</h3>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Path
            </Button>
          </div>

          <Card>
            <CardContent className="py-12 text-center">
              <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h4 className="font-medium text-slate-900 mb-2">No Learning Paths Yet</h4>
              <p className="text-slate-500 mb-4">
                Create learning paths to guide your team through specific skill sets
              </p>
              <Button>Create Your First Path</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations" className="space-y-4">
          <h3 className="text-lg font-medium">Pending Invitations ({invitations.length})</h3>

          {invitations.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h4 className="font-medium text-slate-900 mb-2">No Pending Invitations</h4>
                <p className="text-slate-500">
                  Send invitations to add team members to your organization
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {invitations.map((invite) => (
                    <div
                      key={invite.id}
                      className="flex items-center justify-between p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{invite.email}</p>
                          <p className="text-sm text-slate-500">
                            Invited {new Date(invite.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary">{invite.role}</Badge>
                        <p className="text-sm text-slate-500">
                          Expires {new Date(invite.expiresAt).toLocaleDateString()}
                        </p>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your organization
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Role
              </label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEMBER">Member</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleInviteMember} disabled={isInviting}>
              {isInviting ? 'Sending...' : 'Send Invitation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EnterpriseUpgradeCTA() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="max-w-md w-full mx-4">
        <CardContent className="pt-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Upgrade to Enterprise
          </h2>
          <p className="text-slate-600 mb-6">
            Get team management features, SSO integration, custom learning paths, 
            and advanced analytics for your organization.
          </p>
          
          <div className="space-y-3 text-left mb-6">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-green-500" />
              <span className="text-sm text-slate-700">Team management dashboard</span>
            </div>
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-green-500" />
              <span className="text-sm text-slate-700">SSO integration (Okta, Azure AD)</span>
            </div>
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-green-500" />
              <span className="text-sm text-slate-700">Custom learning paths</span>
            </div>
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-green-500" />
              <span className="text-sm text-slate-700">Advanced team analytics</span>
            </div>
          </div>

          <Button size="lg" className="w-full" asChild>
            <a href="/pricing">Upgrade Now</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function SkillMetric({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-slate-50 rounded-lg p-4">
      <div className={`w-3 h-3 rounded-full ${color} mb-2`} />
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

function getTopSkill(skills?: { bugFixes?: number; modelsImproved?: number; dataCleaned?: number; algorithmsChosen?: number }): string {
  if (!skills) return 'N/A';
  
  const entries = Object.entries(skills).filter(([_, v]) => (v || 0) > 0);
  if (entries.length === 0) return 'N/A';
  
  const sorted = entries.sort((a, b) => (b[1] || 0) - (a[1] || 0));
  const labels: Record<string, string> = {
    bugFixes: 'Bug Fixes',
    modelsImproved: 'Models',
    dataCleaned: 'Data',
    algorithmsChosen: 'Algorithms'
  };
  
  return labels[sorted[0][0]] || 'N/A';
}

export default EnterpriseDashboard;
