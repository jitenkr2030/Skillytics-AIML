// ============================================
// Skillytics Enterprise API Routes
// Handles enterprise features: teams, SSO, analytics, and learning paths
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// GET /api/enterprise - Get enterprise data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Get user's organization and role
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        organizationId: true,
        organizationRole: true,
        subscriptionTier: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check enterprise access
    if (user.subscriptionTier !== 'ENTERPRISE' && action !== 'check') {
      return NextResponse.json({ error: 'Enterprise subscription required' }, { status: 403 });
    }

    switch (action) {
      case 'check':
        return NextResponse.json({
          hasEnterprise: user.subscriptionTier === 'ENTERPRISE',
          organizationId: user.organizationId,
          role: user.organizationRole
        });

      case 'organization':
        if (!user.organizationId) {
          return NextResponse.json({ organization: null });
        }

        const organization = await db.organization.findUnique({
          where: { id: user.organizationId },
          include: {
            members: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                totalPoints: true,
                lastActiveAt: true,
                organizationRole: true
              }
            },
            _count: {
              select: { members: true, learningPaths: true }
            }
          }
        });

        return NextResponse.json({ organization });

      case 'team':
        if (!user.organizationId) {
          return NextResponse.json({ error: 'No organization' }, { status: 404 });
        }

        const members = await db.user.findMany({
          where: { organizationId: user.organizationId },
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            totalPoints: true,
            streak: true,
            lastActiveAt: true,
            organizationRole: true,
            _count: {
              select: {
                progress: true,
                achievements: true
              }
            }
          },
          orderBy: { lastActiveAt: 'desc' }
        });

        // Get completion stats for each member
        const membersWithStats = await Promise.all(members.map(async (member) => {
          const completedMissions = await db.missionProgress.count({
            where: {
              userId: member.id,
              status: { in: ['COMPLETED', 'MASTERED'] }
            }
          });

          return {
            ...member,
            completedMissions
          };
        }));

        return NextResponse.json({ members: membersWithStats });

      case 'analytics':
        if (!user.organizationId) {
          return NextResponse.json({ error: 'No organization' }, { status: 404 });
        }

        // Get team analytics
        const teamAnalytics = await db.teamAnalytics.findFirst({
          where: { organizationId: user.organizationId },
          orderBy: { date: 'desc' }
        });

        // Get overall stats
        const [totalMembers, activeMembers, totalMissions, avgProgress] = await Promise.all([
          db.user.count({ where: { organizationId: user.organizationId } }),
          db.user.count({ 
            where: { 
              organizationId: user.organizationId,
              lastActiveAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            }
          }),
          db.missionProgress.count({
            where: {
              user: { organizationId: user.organizationId },
              status: { in: ['COMPLETED', 'MASTERED'] }
            }
          }),
          db.missionProgress.aggregate({
            where: {
              user: { organizationId: user.organizationId },
              status: { in: ['COMPLETED', 'MASTERED'] }
            },
            _avg: { bestScore: true }
          })
        ]);

        // Get skill breakdown
        const skillBreakdown = await db.userAnalytics.aggregate({
          where: {
            user: { organizationId: user.organizationId }
          },
          _sum: {
            bugFixes: true,
            modelsImproved: true,
            dataCleaned: true,
            algorithmsChosen: true
          }
        });

        return NextResponse.json({
          overview: {
            totalMembers,
            activeMembers,
            totalMissionsCompleted: totalMissions,
            averageScore: avgProgress._avg.bestScore || 0,
            skillBreakdown: skillBreakdown._sum
          },
          recentAnalytics: teamAnalytics
        });

      case 'learning-paths':
        if (!user.organizationId) {
          return NextResponse.json({ error: 'No organization' }, { status: 404 });
        }

        const learningPaths = await db.learningPath.findMany({
          where: { organizationId: user.organizationId, isActive: true },
          include: {
            _count: { select: { teamAnalytics: true } }
          }
        });

        return NextResponse.json({ learningPaths });

      case 'invitations':
        const invitations = await db.organizationInvitation.findMany({
          where: { 
            organizationId: user.organizationId,
            acceptedAt: null,
            expiresAt: { gte: new Date() }
          },
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            expiresAt: true
          }
        });

        return NextResponse.json({ invitations });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Enterprise API error:', error);
    return NextResponse.json({ error: 'Failed to fetch enterprise data' }, { status: 500 });
  }
}

// POST /api/enterprise - Create and manage enterprise features
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { action } = body;

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionTier: true,
        organizationId: true,
        organizationRole: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    switch (action) {
      case 'create_organization': {
        // Must be upgrading to enterprise
        if (user.subscriptionTier !== 'ENTERPRISE') {
          return NextResponse.json({ 
            error: 'Enterprise subscription required to create organization',
            upgradeRequired: true
          }, { status: 403 });
        }

        const { name, domain } = body;

        if (!name) {
          return NextResponse.json({ error: 'Organization name required' }, { status: 400 });
        }

        // Check domain availability
        if (domain) {
          const existingDomain = await db.organization.findUnique({
            where: { domain }
          });
          if (existingDomain) {
            return NextResponse.json({ error: 'Domain already taken' }, { status: 400 });
          }
        }

        const organization = await db.organization.create({
          data: {
            name,
            domain,
            members: {
              connect: { id: userId }
            }
          }
        });

        // Update user role
        await db.user.update({
          where: { id: userId },
          data: {
            organizationId: organization.id,
            organizationRole: 'OWNER'
          }
        });

        return NextResponse.json({
          success: true,
          organization: {
            id: organization.id,
            name: organization.name,
            domain: organization.domain
          }
        });
      }

      case 'invite_member': {
        if (!user.organizationId || !['OWNER', 'ADMIN'].includes(user.organizationRole || '')) {
          return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
        }

        const { email, role } = body;

        if (!email) {
          return NextResponse.json({ error: 'Email required' }, { status: 400 });
        }

        // Check if already a member
        const existingUser = await db.user.findUnique({
          where: { email }
        });

        if (existingUser?.organizationId === user.organizationId) {
          return NextResponse.json({ error: 'User is already a member' }, { status: 400 });
        }

        // Check for existing invitation
        const existingInvitation = await db.organizationInvitation.findFirst({
          where: {
            email,
            organizationId: user.organizationId,
            acceptedAt: null,
            expiresAt: { gte: new Date() }
          }
        });

        if (existingInvitation) {
          return NextResponse.json({ error: 'Invitation already sent' }, { status: 400 });
        }

        // Generate invitation token
        const token = uuidv4();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days to accept

        const invitation = await db.organizationInvitation.create({
          data: {
            organizationId: user.organizationId,
            email,
            role: role || 'MEMBER',
            token,
            expiresAt
          }
        });

        // TODO: Send invitation email
        const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/join/${token}`;

        return NextResponse.json({
          success: true,
          invitation: {
            id: invitation.id,
            email: invitation.email,
            role: invitation.role,
            expiresAt: invitation.expiresAt,
            inviteLink
          }
        });
      }

      case 'accept_invitation': {
        const { token } = body;

        if (!token) {
          return NextResponse.json({ error: 'Token required' }, { status: 400 });
        }

        const invitation = await db.organizationInvitation.findUnique({
          where: { token },
          include: { organization: true }
        });

        if (!invitation) {
          return NextResponse.json({ error: 'Invalid invitation' }, { status: 400 });
        }

        if (invitation.acceptedAt) {
          return NextResponse.json({ error: 'Invitation already accepted' }, { status: 400 });
        }

        if (invitation.expiresAt < new Date()) {
          return NextResponse.json({ error: 'Invitation expired' }, { status: 400 });
        }

        // Accept invitation
        await db.$transaction([
          db.organizationInvitation.update({
            where: { id: invitation.id },
            data: { acceptedAt: new Date() }
          }),
          db.user.update({
            where: { id: userId },
            data: {
              organizationId: invitation.organizationId,
              organizationRole: invitation.role
            }
          })
        ]);

        return NextResponse.json({
          success: true,
          message: `Welcome to ${invitation.organization.name}!`,
          organization: {
            id: invitation.organization.id,
            name: invitation.organization.name
          }
        });
      }

      case 'create_learning_path': {
        if (!user.organizationId || !['OWNER', 'ADMIN'].includes(user.organizationRole || '')) {
          return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
        }

        const { title, description, moduleIds, targetDeadline } = body;

        if (!title || !moduleIds || !Array.isArray(moduleIds)) {
          return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const learningPath = await db.learningPath.create({
          data: {
            organizationId: user.organizationId,
            title,
            description: description || '',
            moduleIds: JSON.stringify(moduleIds),
            targetDeadline: targetDeadline ? new Date(targetDeadline) : null
          }
        });

        return NextResponse.json({
          success: true,
          learningPath: {
            id: learningPath.id,
            title: learningPath.title
          }
        });
      }

      case 'update_sso': {
        if (user.organizationRole !== 'OWNER') {
          return NextResponse.json({ error: 'Only owner can configure SSO' }, { status: 403 });
        }

        const { ssoProvider, config } = body;

        if (!ssoProvider) {
          return NextResponse.json({ error: 'SSO provider required' }, { status: 400 });
        }

        // Validate and encrypt SSO config
        const encryptedConfig = encryptSSOConfig(config);

        const organization = await db.organization.update({
          where: { id: user.organizationId! },
          data: {
            ssoProvider,
            ssoConfig: encryptedConfig,
            ssoEnabled: true
          }
        });

        return NextResponse.json({
          success: true,
          message: 'SSO configured successfully',
          provider: ssoProvider
        });
      }

      case 'remove_member': {
        if (user.organizationRole !== 'OWNER') {
          return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
        }

        const { memberId } = body;

        if (!memberId) {
          return NextResponse.json({ error: 'Member ID required' }, { status: 400 });
        }

        // Cannot remove owner
        const targetUser = await db.user.findUnique({
          where: { id: memberId }
        });

        if (targetUser?.organizationRole === 'OWNER') {
          return NextResponse.json({ error: 'Cannot remove organization owner' }, { status: 400 });
        }

        await db.user.update({
          where: { id: memberId },
          data: {
            organizationId: null,
            organizationRole: null
          }
        });

        return NextResponse.json({ success: true, message: 'Member removed' });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Enterprise API error:', error);
    return NextResponse.json({ error: 'Enterprise operation failed' }, { status: 500 });
  }
}

// Helper function to encrypt SSO config
function encryptSSOConfig(config: any): string {
  const secret = process.env.SSO_ENCRYPTION_KEY || 'default-secret-change-in-production';
  const iv = crypto.randomBytes(16);
  const key = crypto.scryptSync(secret, 'salt', 32);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(config), 'utf8'),
    cipher.final()
  ]);
  
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}
