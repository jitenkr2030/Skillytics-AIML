import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { Marketplace } from '@/components/marketplace';

export const metadata: Metadata = {
  title: 'Marketplace - Skillytics',
  description: 'Enhance your learning with premium study materials and resources',
};

export default async function MarketplacePage() {
  const session = await getServerSession(authOptions);

  // Marketplace is accessible to all users (some items may require purchase)
  return (
    <Marketplace userId={session?.user?.id} />
  );
}
