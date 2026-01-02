import { Metadata } from 'next';
import { PricingPage } from '@/components/pricing-page';

export const metadata: Metadata = {
  title: 'Pricing - Skillytics',
  description: 'Choose the perfect plan for your AI/ML learning journey',
};

export default function Pricing() {
  return <PricingPage />;
}
