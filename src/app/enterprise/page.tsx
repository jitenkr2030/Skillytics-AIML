import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { EnterpriseDashboard } from '@/components/enterprise-dashboard';

export const metadata: Metadata = {
  title: 'Enterprise Dashboard - Skillytics',
  description: 'Manage your team and organization',
};

export default async function EnterprisePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EnterpriseDashboard userId={session.user.id} />
      </div>
    </div>
  );
}
