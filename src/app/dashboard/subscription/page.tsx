import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import Link from 'next/link';
import { 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Download, 
  ExternalLink,
  Calendar,
  TrendingUp,
  Crown,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata: Metadata = {
  title: 'Subscription - Skillytics',
  description: 'Manage your subscription and billing',
};

export default async function SubscriptionPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  // Fetch subscription data
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      subscriptionTier: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      subscriptionStartDate: true,
      subscriptionEndDate: true,
      credits: true,
      totalPoints: true,
      createdAt: true
    }
  });

  if (!user) {
    redirect('/auth/signin');
  }

  // Fetch billing history
  const billingHistory = await db.paymentTransaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  // Fetch plans
  const plans = await db.subscriptionPlan.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' }
  });

  const currentPlan = plans.find(p => p.tier === user.subscriptionTier);
  const isPro = user.subscriptionTier === 'PRO';
  const isEnterprise = user.subscriptionTier === 'ENTERPRISE';
  const isFree = user.subscriptionTier === 'FREE';

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const daysRemaining = user.subscriptionEndDate 
    ? Math.ceil((new Date(user.subscriptionEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Subscription & Billing
          </h1>
          <p className="text-slate-600">
            Manage your subscription plan and view billing history
          </p>
        </div>

        {/* Current Plan */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                  isEnterprise ? 'bg-gradient-to-br from-violet-500 to-purple-600' :
                  isPro ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
                  'bg-gradient-to-br from-slate-400 to-slate-500'
                }`}>
                  {isEnterprise ? (
                    <Building2 className="w-8 h-8 text-white" />
                  ) : isPro ? (
                    <Crown className="w-8 h-8 text-white" />
                  ) : (
                    <CreditCard className="w-8 h-8 text-white" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-slate-900">
                      {currentPlan?.name || 'Free'}
                    </h2>
                    <Badge className={
                      isEnterprise ? 'bg-violet-100 text-violet-700' :
                      isPro ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }>
                      {user.subscriptionTier}
                    </Badge>
                  </div>
                  <p className="text-slate-500 mt-1">{currentPlan?.description}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                {!isFree && user.stripeSubscriptionId && (
                  <>
                    {daysRemaining !== null && daysRemaining > 0 ? (
                      <span className="text-sm text-slate-500">
                        Renews in {daysRemaining} days
                      </span>
                    ) : (
                      <Badge variant="destructive">Subscription ended</Badge>
                    )}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Cancel
                      </Button>
                      <Button size="sm" asChild>
                        <Link href="/pricing">Change Plan</Link>
                      </Button>
                    </div>
                  </>
                )}
                {isFree && (
                  <Button asChild>
                    <Link href="/pricing">Upgrade to Pro</Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Plan Features */}
            {!isFree && currentPlan && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium text-slate-900 mb-3">Plan Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {JSON.parse(currentPlan.features || '[]').slice(0, 6).map((feature: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span>{feature.replace('✅ ', '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Credits Available</p>
                  <p className="text-3xl font-bold text-slate-900">{user.credits}</p>
                </div>
                <CreditCard className="w-10 h-10 text-blue-500" />
              </div>
              <Button variant="outline" size="sm" className="mt-3 w-full">
                Add Credits
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Member Since</p>
                  <p className="text-xl font-bold text-slate-900">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
                <Calendar className="w-10 h-10 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Points</p>
                  <p className="text-3xl font-bold text-slate-900">{user.totalPoints.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
          </CardHeader>
          <CardContent>
            {billingHistory.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No billing history yet</p>
              </div>
            ) : (
              <div className="divide-y">
                {billingHistory.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between py-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.status === 'SUCCEEDED' 
                          ? 'bg-green-100 text-green-600' 
                          : transaction.status === 'FAILED'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {transaction.status === 'SUCCEEDED' ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : transaction.status === 'FAILED' ? (
                          <XCircle className="w-5 h-5" />
                        ) : (
                          <CreditCard className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {transaction.description || transaction.type}
                        </p>
                        <p className="text-sm text-slate-500">
                          {formatDate(transaction.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-slate-900">
                        ${transaction.amount.toFixed(2)}
                      </span>
                      <Badge variant={
                        transaction.status === 'SUCCEEDED' ? 'default' :
                        transaction.status === 'FAILED' ? 'destructive' :
                        'secondary'
                      }>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
