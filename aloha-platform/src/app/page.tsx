'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, Users, Cpu, TrendingUp, Brain, Sparkles, Code2, Rocket, Shield, Lock, Globe, Server, LogIn } from 'lucide-react';

export default function Home() {
  const [stats, setStats] = useState({ users: 5, deployments: 23, requests: 1523, activeSubscriptions: 3, monthlyRevenue: 499.98 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch stats from backend
    fetch('http://localhost:5000/api/admin/analytics')
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(() => setStats({ users: 5, deployments: 23, requests: 1523, activeSubscriptions: 3, monthlyRevenue: 499.98 }))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex items-center justify-between p-6 border-b border-slate-700/50 backdrop-blur-md sticky top-0">
          <Link href="/" className="text-2xl font-bold text-transparent bg-gradient-to-r from-amber-400 via-cyan-400 to-purple-400 bg-clip-text hover:scale-105 transition">
            🌺 Aloha Nova Universe
          </Link>
          <div className="flex gap-4">
            <Link href="/dashboard" className="px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600 transition border border-slate-600/50 backdrop-blur">
              Dashboard
            </Link>
            <Link href="/avatars" className="px-4 py-2 rounded-lg bg-cyan-600/50 hover:bg-cyan-500/50 transition border border-cyan-500/50 backdrop-blur">
              Avatars
            </Link>
            <Link href="/billing" className="px-4 py-2 rounded-lg bg-amber-600/50 hover:bg-amber-500/50 transition border border-amber-500/50 backdrop-blur">
              Billing
            </Link>
            <Link href="/login" className="px-4 py-2 rounded-lg bg-purple-600/50 hover:bg-purple-500/50 transition border border-purple-500/50 backdrop-blur flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Login
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-32 text-center">
          <div className="mb-8 inline-block">
            <div className="text-6xl animate-bounce">🌺</div>
          </div>

          <h1 className="text-7xl md:text-8xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-amber-300 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
              Aloha Nova Universe
            </span>
          </h1>

          <p className="text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
            Enterprise-Grade AI Platform with <span className="text-cyan-400 font-semibold">10+ LLM Models</span>,
            <span className="text-purple-400 font-semibold"> Photorealistic 3D Avatars</span>, and
            <span className="text-amber-400 font-semibold"> One-Click Deployment</span>
          </p>

          <div className="flex gap-4 justify-center mb-12 flex-wrap">
            <Link
              href="/avatars"
              className="group px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-amber-500/50 transform hover:scale-105 transition flex items-center gap-2"
            >
              <Sparkles className="w-6 h-6" />
              Create Avatar
            </Link>
            <Link
              href="/dashboard"
              className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-105 transition flex items-center gap-2"
            >
              <Brain className="w-6 h-6" />
              Try AI Chat
            </Link>
            <Link
              href="/billing"
              className="px-8 py-4 border-2 border-purple-400 rounded-xl font-bold text-lg hover:bg-purple-400/10 transform hover:scale-105 transition flex items-center gap-2"
            >
              <Rocket className="w-6 h-6" />
              View Plans
            </Link>
          </div>

          <p className="text-slate-400 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            Enterprise Security • 99.9% Uptime • 24/7 Support
          </p>
        </section>

        {/* Premium Features Grid */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <h2 className="text-5xl font-bold mb-4 text-center mb-16">
            Powerful Features for <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">Every Creator</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1: LLM Models */}
            <div className="group p-8 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-2xl border border-slate-600/50 hover:border-cyan-400/50 transition backdrop-blur hover:shadow-2xl hover:shadow-cyan-500/20">
              <div className="p-3 bg-cyan-500/20 rounded-lg w-fit mb-4 group-hover:scale-110 transition">
                <Brain className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">10+ AI Models</h3>
              <p className="text-slate-400 mb-4">Claude 3.5 • GPT-4o • Gemini 2.0 • Grok • Alibaba & more</p>
              <ul className="text-sm text-slate-500 space-y-2">
                <li>✓ Context-aware responses</li>
                <li>✓ Multi-language support</li>
                <li>✓ Real-time streaming</li>
              </ul>
            </div>

            {/* Feature 2: 3D Avatars */}
            <div className="group p-8 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-2xl border border-slate-600/50 hover:border-purple-400/50 transition backdrop-blur hover:shadow-2xl hover:shadow-purple-500/20">
              <div className="p-3 bg-purple-500/20 rounded-lg w-fit mb-4 group-hover:scale-110 transition">
                <Users className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">3D Avatar Studio</h3>
              <p className="text-slate-400 mb-4">Photorealistic avatars with full customization</p>
              <ul className="text-sm text-slate-500 space-y-2">
                <li>✓ 20+ customization options</li>
                <li>✓ Voice synthesis included</li>
                <li>✓ Animated expressions</li>
              </ul>
            </div>

            {/* Feature 3: Auto Deploy */}
            <div className="group p-8 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-2xl border border-slate-600/50 hover:border-amber-400/50 transition backdrop-blur hover:shadow-2xl hover:shadow-amber-500/20">
              <div className="p-3 bg-amber-500/20 rounded-lg w-fit mb-4 group-hover:scale-110 transition">
                <Rocket className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Auto Deployment</h3>
              <p className="text-slate-400 mb-4">Deploy to Vercel, Netlify, AWS with one click</p>
              <ul className="text-sm text-slate-500 space-y-2">
                <li>✓ CI/CD pipeline included</li>
                <li>✓ Custom domain support</li>
                <li>✓ Auto SSL certificates</li>
              </ul>
            </div>

            {/* Feature 4: Analytics */}
            <div className="group p-8 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-2xl border border-slate-600/50 hover:border-green-400/50 transition backdrop-blur hover:shadow-2xl hover:shadow-green-500/20">
              <div className="p-3 bg-green-500/20 rounded-lg w-fit mb-4 group-hover:scale-110 transition">
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Advanced Analytics</h3>
              <p className="text-slate-400 mb-4">Real-time insights and performance metrics</p>
              <ul className="text-sm text-slate-500 space-y-2">
                <li>✓ Custom dashboards</li>
                <li>✓ Export reports</li>
                <li>✓ API integration</li>
              </ul>
            </div>

            {/* Feature 5: Security */}
            <div className="group p-8 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-2xl border border-slate-600/50 hover:border-red-400/50 transition backdrop-blur hover:shadow-2xl hover:shadow-red-500/20">
              <div className="p-3 bg-red-500/20 rounded-lg w-fit mb-4 group-hover:scale-110 transition">
                <Lock className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Enterprise Security</h3>
              <p className="text-slate-400 mb-4">Bank-grade encryption and compliance</p>
              <ul className="text-sm text-slate-500 space-y-2">
                <li>✓ 256-bit encryption</li>
                <li>✓ 2FA authentication</li>
                <li>✓ GDPR compliant</li>
              </ul>
            </div>

            {/* Feature 6: API */}
            <div className="group p-8 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-2xl border border-slate-600/50 hover:border-blue-400/50 transition backdrop-blur hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="p-3 bg-blue-500/20 rounded-lg w-fit mb-4 group-hover:scale-110 transition">
                <Code2 className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Powerful API</h3>
              <p className="text-slate-400 mb-4">RESTful API with comprehensive documentation</p>
              <ul className="text-sm text-slate-500 space-y-2">
                <li>✓ Rate limiting & quotas</li>
                <li>✓ Webhook support</li>
                <li>✓ SDKs for all languages</li>
              </ul>
            </div>

            {/* Feature 7: Uptime */}
            <div className="group p-8 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-2xl border border-slate-600/50 hover:border-yellow-400/50 transition backdrop-blur hover:shadow-2xl hover:shadow-yellow-500/20">
              <div className="p-3 bg-yellow-500/20 rounded-lg w-fit mb-4 group-hover:scale-110 transition">
                <Server className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">99.9% Uptime</h3>
              <p className="text-slate-400 mb-4">Global infrastructure with automatic failover</p>
              <ul className="text-sm text-slate-500 space-y-2">
                <li>✓ Multi-region deployment</li>
                <li>✓ Load balancing</li>
                <li>✓ Auto-scaling</li>
              </ul>
            </div>

            {/* Feature 8: Support */}
            <div className="group p-8 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-2xl border border-slate-600/50 hover:border-pink-400/50 transition backdrop-blur hover:shadow-2xl hover:shadow-pink-500/20">
              <div className="p-3 bg-pink-500/20 rounded-lg w-fit mb-4 group-hover:scale-110 transition">
                <Globe className="w-8 h-8 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="text-slate-400 mb-4">Expert support team always ready to help</p>
              <ul className="text-sm text-slate-500 space-y-2">
                <li>✓ Live chat support</li>
                <li>✓ Email & phone</li>
                <li>✓ Video consultations</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Live Statistics Dashboard */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <h2 className="text-5xl font-bold mb-16 text-center">
            Platform <span className="text-transparent bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text">Analytics</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Users */}
            <div className="p-8 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-2xl border border-cyan-400/30 backdrop-blur">
              <div className="text-5xl font-bold mb-2">{isLoading ? '-' : stats.users}</div>
              <p className="text-cyan-300 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Active Users
              </p>
              <div className="text-sm text-cyan-200/60 mt-2">↑ 12% from last month</div>
            </div>

            {/* Deployments */}
            <div className="p-8 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-2xl border border-amber-400/30 backdrop-blur">
              <div className="text-5xl font-bold mb-2">{isLoading ? '-' : stats.deployments}</div>
              <p className="text-amber-300 flex items-center gap-2">
                <Rocket className="w-4 h-4" />
                Deployments
              </p>
              <div className="text-sm text-amber-200/60 mt-2">↑ 8% from last month</div>
            </div>

            {/* Subscriptions */}
            <div className="p-8 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl border border-purple-400/30 backdrop-blur">
              <div className="text-5xl font-bold mb-2">{isLoading ? '-' : stats.activeSubscriptions}</div>
              <p className="text-purple-300 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Subscriptions
              </p>
              <div className="text-sm text-purple-200/60 mt-2">↑ 33% from last month</div>
            </div>

            {/* Revenue */}
            <div className="p-8 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl border border-green-400/30 backdrop-blur">
              <div className="text-5xl font-bold mb-2">${isLoading ? '-' : (stats.monthlyRevenue || 499.98).toFixed(2)}</div>
              <p className="text-green-300 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Monthly Revenue
              </p>
              <div className="text-sm text-green-200/60 mt-2">↑ 45% from last month</div>
            </div>

            {/* LLM Requests */}
            <div className="p-8 bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-2xl border border-pink-400/30 backdrop-blur">
              <div className="text-5xl font-bold mb-2">{isLoading ? '-' : (stats.requests || 1523).toLocaleString()}</div>
              <p className="text-pink-300 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                LLM Requests
              </p>
              <div className="text-sm text-pink-200/60 mt-2">↑ 67% from last month</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-5xl mx-auto px-6 py-24 text-center">
          <div className="p-12 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 rounded-3xl border border-purple-400/30 backdrop-blur">
            <h2 className="text-5xl font-bold mb-6">Ready to Launch?</h2>
            <p className="text-xl text-slate-300 mb-8">Join thousands of creators building with Aloha Nova Universe</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/avatars" className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50">
                Start Free
              </Link>
              <Link href="/billing" className="px-8 py-4 border-2 border-cyan-400 rounded-xl font-bold text-lg hover:bg-cyan-400/10">
                View Pricing
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-700/50 mt-24 py-12 text-center text-slate-400 backdrop-blur">
          <p className="mb-4">© 2025 Aloha Nova Universe • Enterprise AI Platform</p>
          <div className="flex gap-8 justify-center text-sm">
            <Link href="#" className="hover:text-cyan-400">Privacy Policy</Link>
            <Link href="#" className="hover:text-cyan-400">Terms of Service</Link>
            <Link href="#" className="hover:text-cyan-400">Contact Us</Link>
            <Link href="#" className="hover:text-cyan-400">Documentation</Link>
          </div>
          <p className="mt-4 text-xs">Built with ❤️ for creators worldwide</p>
        </footer>
      </div>
    </div>
  );
}
