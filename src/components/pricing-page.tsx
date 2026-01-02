'use client';

import { useState } from 'react';
import { Check, Sparkles, Building2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface PricingPlan {
  id: string;
  name: string;
  tier: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  isPopular?: boolean;
  isEnterprise?: boolean;
}

interface PricingPageProps {
  currentTier?: string;
  onUpgrade?: (planId: string, isAnnual: boolean) => void;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    tier: 'FREE',
    description: 'Get started with the basics of AI/ML',
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      'Access to Module 1: Data Thinking for AI/ML',
      'Access to Module 2: Python for ML',
      '40 free missions',
      'Basic progress tracking',
      'Community forum access',
      'Limited analytics'
    ]
  },
  {
    id: 'pro-monthly',
    name: 'Pro',
    tier: 'PRO',
    description: 'Complete AI/ML mastery with all 320 missions',
    monthlyPrice: 29,
    annualPrice: 249,
    features: [
      '✅ Access to all 320 missions',
      '✅ All 16 modules unlocked',
      '✅ Advanced analytics dashboard',
      '✅ Skill profiling & heatmaps',
      '✅ Downloadable certificates',
      '✅ Priority support',
      '✅ Career portfolio building',
      '✅ Interview preparation guide'
    ],
    isPopular: true
  },
  {
    id: 'enterprise-monthly',
    name: 'Enterprise',
    tier: 'ENTERPRISE',
    description: 'Team training with advanced management features',
    monthlyPrice: 149,
    annualPrice: 1299,
    features: [
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
    ],
    isEnterprise: true
  }
];

export function PricingPage({ currentTier = 'FREE', onUpgrade }: PricingPageProps) {
  const [isAnnual, setIsAnnual] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const { toast } = useToast();

  const handleUpgrade = async (plan: PricingPlan) => {
    if (plan.tier === currentTier) {
      toast({
        title: 'Already Subscribed',
        description: `You are already on the ${plan.name} plan.`,
        variant: 'destructive'
      });
      return;
    }

    setSelectedPlan(plan);
  };

  const confirmUpgrade = async () => {
    if (!selectedPlan) return;

    setIsLoading(selectedPlan.id);
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_checkout',
          planId: selectedPlan.id,
          isAnnual
        })
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start checkout. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(null);
      setSelectedPlan(null);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `$${price}`;
  };

  const getMonthlyEquivalent = (annualPrice: number) => {
    return Math.round(annualPrice / 12);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-1">
            <Sparkles className="w-4 h-4 mr-2" />
            Pricing Plans
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Invest in Your ML Career
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose the plan that fits your learning goals. From free exploration to 
            enterprise team training, we have options for every stage of your AI journey.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className={`text-sm ${!isAnnual ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-7 bg-slate-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span
                className={`absolute left-0.5 top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  isAnnual ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
              Annual
              <Badge variant="secondary" className="ml-2 text-xs">
                Save 30%
              </Badge>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const isCurrentPlan = plan.tier === currentTier;
            const isLocked = plan.tier !== 'FREE' && plan.tier !== currentTier && currentTier !== 'FREE';

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                  plan.isPopular
                    ? 'border-blue-500 scale-105 z-10'
                    : 'border-slate-200'
                } ${isLocked ? 'opacity-75' : ''}`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">
                      <Sparkles className="w-4 h-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {plan.isEnterprise && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-violet-500 text-white px-4 py-1">
                      <Building2 className="w-4 h-4 mr-1" />
                      For Teams
                    </Badge>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-slate-500 mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-8">
                    <span className="text-5xl font-bold text-slate-900">
                      {formatPrice(price)}
                    </span>
                    {price > 0 && (
                      <span className="text-slate-500 ml-2">
                        /{isAnnual ? 'year' : 'month'}
                      </span>
                    )}
                    {isAnnual && price > 0 && (
                      <div className="text-sm text-slate-500 mt-1">
                        ${getMonthlyEquivalent(price)}/month billed annually
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  {isCurrentPlan ? (
                    <Button
                      disabled
                      className="w-full mb-6"
                      variant="outline"
                    >
                      Current Plan
                    </Button>
                  ) : plan.tier === 'FREE' ? (
                    <Button
                      disabled={currentTier !== 'FREE'}
                      className="w-full mb-6"
                      variant="outline"
                    >
                      {currentTier === 'FREE' ? 'Current Plan' : 'Downgrade'}
                    </Button>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => handleUpgrade(plan)}
                          className={`w-full mb-6 ${
                            plan.isPopular
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : 'bg-slate-900 hover:bg-slate-800'
                          }`}
                          disabled={isLoading === plan.id}
                        >
                          {isLoading === plan.id ? (
                            'Processing...'
                          ) : isLocked ? (
                            <>
                              <X className="w-4 h-4 mr-2" />
                              Locked
                            </>
                          ) : (
                            `Upgrade to ${plan.name}`
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Upgrade to {plan.name}</DialogTitle>
                          <DialogDescription>
                            You're about to upgrade to the {plan.name} plan.
                            {isAnnual
                              ? ` You'll be charged $${plan.annualPrice} annually.`
                              : ` You'll be charged $${plan.monthlyPrice} monthly.`}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <h4 className="font-medium mb-2">Plan Features:</h4>
                          <ul className="space-y-2">
                            {plan.features.slice(0, 5).map((feature, i) => (
                              <li key={i} className="flex items-center text-sm">
                                <Check className="w-4 h-4 text-green-500 mr-2" />
                                {feature.replace('✅ ', '')}
                              </li>
                            ))}
                            {plan.features.length > 5 && (
                              <li className="text-sm text-slate-500">
                                +{plan.features.length - 5} more features
                              </li>
                            )}
                          </ul>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setSelectedPlan(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="flex-1"
                            onClick={confirmUpgrade}
                          >
                            Confirm & Pay
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {/* Features List */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-sm text-slate-600">
                        <Check className={`w-5 h-5 mr-2 flex-shrink-0 ${
                          feature.startsWith('✅') ? 'text-green-500' : 'text-slate-300'
                        }`} />
                        <span className={feature.startsWith('✅') ? 'text-slate-900' : ''}>
                          {feature.replace('✅ ', '').replace('❌ ', '')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <FAQItem
              question="Can I cancel my subscription anytime?"
              answer="Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period. No refunds are provided for partial periods."
            />
            <FAQItem
              question="What payment methods do you accept?"
              answer="We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor Stripe. Enterprise customers can also pay via invoice."
            />
            <FAQItem
              question="Can I switch between monthly and annual billing?"
              answer="Yes, you can switch between billing cycles at any time. When switching to annual, you'll be credited for any remaining monthly period."
            />
            <FAQItem
              question="Do you offer refunds?"
              answer="We offer a 30-day money-back guarantee for all new subscriptions. If you're not satisfied, contact our support team within 30 days of purchase."
            />
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-violet-50 to-blue-50 rounded-2xl p-12 max-w-4xl mx-auto">
            <Building2 className="w-12 h-12 text-violet-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Need Custom Solutions for Your Team?
            </h2>
            <p className="text-slate-600 mb-6 max-w-xl mx-auto">
              Get a tailored training program for your organization with custom content, 
              dedicated support, and advanced analytics.
            </p>
            <Button size="lg" variant="outline">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
      >
        <span className="font-medium text-slate-900">{question}</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-slate-50 text-slate-600 border-t border-slate-200">
          {answer}
        </div>
      )}
    </div>
  );
}

export default PricingPage;
