'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CreditCard, Check, X, Zap, Star, TrendingUp } from 'lucide-react';

export default function BillingPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isAnnual, setIsAnnual] = useState(false);

  useEffect(() => {
    // Fetch billing plans from backend
    fetch('http://localhost:5000/api/billing/plans')
      .then(r => r.json())
      .then(data => {
        setPlans(data.plans || []);
      })
      .catch(err => {
        console.error('Failed to fetch plans:', err);
        // Fallback plans
        setPlans([
          {
            tier: 'free',
            price: 0,
            features: { deployments: 3, domains: 0, llmRequests: 50 },
          },
          {
            tier: 'starter',
            price: 2999,
            features: { deployments: 20, domains: 3, llmRequests: 1000 },
          },
          {
            tier: 'pro',
            price: 9999,
            features: { deployments: 100, domains: 10, llmRequests: 10000 },
          },
          {
            tier: 'enterprise',
            price: 49999,
            features: { deployments: Infinity, domains: Infinity, llmRequests: Infinity },
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async (tier: string) => {
    setSelectedTier(tier);
    try {
      const res = await fetch('http://localhost:5000/api/billing/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, email: 'user@example.com' }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Subscription processing. Contact admin@aloha.ai for enterprise plans.');
      }
    } catch (err) {
      console.error('Failed to subscribe:', err);
      alert('Failed to start subscription');
    } finally {
      setSelectedTier(null);
    }
  };

  const allFeatures = [
    { name: 'AI Models', key: 'models' },
    { name: 'LLM Requests/month', key: 'llmRequests' },
    { name: 'Deployments', key: 'deployments' },
    { name: 'Custom Domains', key: 'domains' },
    { name: 'Storage', key: 'storage' },
    { name: 'Team Members', key: 'teamMembers' },
    { name: 'API Access', key: 'api' },
    { name: '3D Avatar Creator', key: 'avatars' },
    { name: 'Voice Synthesis', key: 'voice' },
    { name: 'Priority Support', key: 'support' },
    { name: 'Custom Branding', key: 'branding' },
    { name: 'SLA Guarantee', key: 'sla' },
  ];

  const featureMatrix = {
    free: {
      models: '2',
      llmRequests: 50,
      deployments: 3,
      domains: 0,
      storage: '1GB',
      teamMembers: 1,
      api: false,
      avatars: false,
      voice: false,
      support: false,
      branding: false,
      sla: false,
    },
    starter: {
      models: '5',
      llmRequests: 1000,
      deployments: 20,
      domains: 3,
      storage: '10GB',
      teamMembers: 3,
      api: true,
      avatars: true,
      voice: false,
      support: false,
      branding: false,
      sla: false,
    },
    pro: {
      models: '10+',
      llmRequests: 10000,
      deployments: 100,
      domains: 10,
      storage: '100GB',
      teamMembers: 10,
      api: true,
      avatars: true,
      voice: true,
      support: true,
      branding: true,
      sla: false,
    },
    enterprise: {
      models: 'All',
      llmRequests: 'Unlimited',
      deployments: 'Unlimited',
      domains: 'Unlimited',
      storage: 'Unlimited',
      teamMembers: 'Unlimited',
      api: true,
      avatars: true,
      voice: true,
      support: true,
      branding: true,
      sla: true,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex items-center justify-between p-6 border-b border-slate-700/50 backdrop-blur-md sticky top-0">
          <Link href="/" className="text-2xl font-bold text-transparent bg-gradient-to-r from-amber-400 via-cyan-400 to-purple-400 bg-clip-text">
            🌺 Aloha Nova
          </Link>
          <div className="flex gap-4">
            <Link href="/dashboard" className="px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600">
              Dashboard
            </Link>
            <Link href="/avatars" className="px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600">
              Avatars
            </Link>
            <Link href="/billing" className="px-4 py-2 rounded-lg bg-amber-600/50 hover:bg-amber-500/50 border border-amber-500/50">
              Billing
            </Link>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="p-3 bg-amber-500/20 rounded-lg">
                <CreditCard className="w-10 h-10 text-amber-400" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4">Pricing Plans</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
              Choose the perfect plan for your AI platform. Upgrade or downgrade anytime.
            </p>

            {/* Annual Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={isAnnual ? 'text-slate-400' : 'text-white font-semibold'}>Monthly</span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                  isAnnual ? 'bg-cyan-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                    isAnnual ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={!isAnnual ? 'text-slate-400' : 'text-white font-semibold'}>Annual</span>
              <span className="ml-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                Save 20%
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          {loading ? (
            <div className="text-center py-12">
              <div className="text-slate-400">Loading plans...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {plans.map((plan: any) => {
                const price = isAnnual ? Math.floor((plan.price / 100) * 12 * 0.8) : plan.price / 100;
                const isPopular = plan.tier === 'pro';
                const tierKey = plan.tier as 'free' | 'starter' | 'pro' | 'enterprise';

                return (
                  <div
                    key={plan.tier}
                    className={`relative rounded-2xl transition transform hover:scale-105 ${
                      isPopular
                        ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/20 border-2 border-amber-400 shadow-2xl shadow-amber-500/20'
                        : 'bg-gradient-to-br from-slate-800/50 to-slate-700/50 border border-slate-700/50'
                    }`}
                  >
                    {/* Popular Badge */}
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        POPULAR
                      </div>
                    )}

                    <div className="p-8">
                      {/* Tier Name */}
                      <h2 className="text-2xl font-bold capitalize mb-2">{plan.tier}</h2>
                      <p className="text-slate-400 text-sm mb-6">
                        {plan.tier === 'free' && 'Perfect for getting started'}
                        {plan.tier === 'starter' && 'Great for small projects'}
                        {plan.tier === 'pro' && 'Best for growing teams'}
                        {plan.tier === 'enterprise' && 'For large-scale operations'}
                      </p>

                      {/* Price */}
                      <div className="mb-8">
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-5xl font-bold">${price}</span>
                          {plan.price > 0 && (
                            <span className="text-slate-400">/month</span>
                          )}
                        </div>
                        {plan.price === 0 && (
                          <span className="text-slate-400 text-sm">Forever Free</span>
                        )}
                        {isAnnual && plan.price > 0 && (
                          <p className="text-xs text-green-400 mt-2">Billed ${price * 12} annually</p>
                        )}
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={() => handleSubscribe(plan.tier)}
                        disabled={selectedTier === plan.tier}
                        className={`w-full px-4 py-3 rounded-lg font-bold text-lg mb-8 transition transform hover:scale-105 ${
                          plan.tier === 'free'
                            ? 'bg-slate-700 text-white hover:bg-slate-600'
                            : plan.tier === 'pro'
                            ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-500 hover:to-amber-400'
                            : 'bg-slate-700 text-white hover:bg-slate-600'
                        } disabled:opacity-50`}
                      >
                        {plan.tier === 'free' ? 'Get Started' : 'Subscribe Now'}
                      </button>

                      {/* Key Features */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-sm">
                            {featureMatrix[tierKey]?.models} AI Models
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-sm">
                            {featureMatrix[tierKey]?.llmRequests === Infinity
                              ? 'Unlimited'
                              : featureMatrix[tierKey]?.llmRequests.toLocaleString()}{' '}
                            LLM Requests
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-sm">
                            {featureMatrix[tierKey]?.deployments === Infinity
                              ? 'Unlimited'
                              : featureMatrix[tierKey]?.deployments}{' '}
                            Deployments
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Comparison Table */}
          <div className="mb-12 p-8 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-2xl border border-slate-700/50 backdrop-blur overflow-x-auto">
            <h2 className="text-3xl font-bold mb-8">Detailed Comparison</h2>

            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-4 px-4 font-semibold text-slate-300">Feature</th>
                  {plans.map((plan) => (
                    <th key={plan.tier} className="text-center py-4 px-4 font-semibold capitalize text-slate-300">
                      {plan.tier}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((feature) => (
                  <tr key={feature.key} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition">
                    <td className="text-left py-4 px-4 text-slate-300 font-semibold">{feature.name}</td>
                    {plans.map((plan: any) => {
                      const tierKey = plan.tier as 'free' | 'starter' | 'pro' | 'enterprise';
                      const value = (featureMatrix[tierKey] as any)[feature.key];
                      const hasFeature =
                        typeof value === 'string' && value !== 'false'
                          ? true
                          : typeof value === 'number'
                          ? value > 0
                          : value === true;

                      return (
                        <td key={`${plan.tier}-${feature.key}`} className="text-center py-4 px-4">
                          {typeof value === 'boolean' ? (
                            hasFeature ? (
                              <Check className="w-5 h-5 text-green-400 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-slate-500 mx-auto" />
                            )
                          ) : (
                            <span className="text-sm text-slate-300">{value}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-8 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-400/30 backdrop-blur">
              <div className="p-3 bg-cyan-500/20 rounded-lg w-fit mb-4">
                <Zap className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
              <p className="text-slate-400">All plans include our ultra-fast global infrastructure with 99.9% uptime guarantee</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-400/30 backdrop-blur">
              <div className="p-3 bg-purple-500/20 rounded-lg w-fit mb-4">
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Scale Easily</h3>
              <p className="text-slate-400">Upgrade anytime as your needs grow. No long-term contracts required</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl border border-amber-400/30 backdrop-blur">
              <div className="p-3 bg-amber-500/20 rounded-lg w-fit mb-4">
                <Check className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Money Back</h3>
              <p className="text-slate-400">30-day money-back guarantee on all paid plans. Zero risk!</p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-2xl border border-slate-700/50 backdrop-blur">
            <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <div className="border-b border-slate-700 pb-6">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  Can I upgrade or downgrade my plan?
                </h3>
                <p className="text-slate-400">Yes! You can change your plan anytime. Changes take effect immediately or on your next billing cycle, depending on your preference.</p>
              </div>

              <div className="border-b border-slate-700 pb-6">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  What payment methods do you accept?
                </h3>
                <p className="text-slate-400">We accept all major credit cards (Visa, MasterCard, American Express) via Stripe. Enterprise customers can arrange custom payment terms.</p>
              </div>

              <div className="border-b border-slate-700 pb-6">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  Is there a free trial?
                </h3>
                <p className="text-slate-400">Our Free plan is forever free with all essential features. Paid plans include a 30-day money-back guarantee!</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  Do you offer discounts for annual billing?
                </h3>
                <p className="text-slate-400">Yes! Annual plans are discounted 20% compared to monthly billing. Enterprise plans have custom pricing.</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 p-12 bg-gradient-to-br from-cyan-600/20 to-purple-600/20 rounded-3xl border border-cyan-400/30 text-center backdrop-blur">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-slate-300 mb-8">Join thousands of creators building amazing things with Aloha Nova</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => handleSubscribe('free')}
                className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-cyan-500/50"
              >
                Start Free
              </button>
              <Link
                href="/dashboard"
                className="px-8 py-4 border-2 border-cyan-400 rounded-xl font-bold text-lg hover:bg-cyan-400/10"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
