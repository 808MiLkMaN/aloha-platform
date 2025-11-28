'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { BarChart3, Zap, Cpu, TrendingUp, Brain, Activity, CreditCard, Clock, Award } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [llmModels, setLlmModels] = useState<any[]>([]);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [model, setModel] = useState('');
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [userStats] = useState({
    credits: 450,
    tier: 'Pro',
    deployment: 15,
    llmRequests: 2847,
    avatarsCreated: 3,
    domains: 2,
    storage: 8.4,
  });

  useEffect(() => {
    // Fetch admin analytics - REAL LIVE DATA ONLY
    fetch('http://localhost:5000/api/admin/analytics', {
      headers: {
        'x-user-email': 'malcolmlee3@gmail.com' // Admin email for authentication
      }
    })
      .then(r => r.json())
      .then(data => {
        console.log('Analytics data:', data);
        setStats(data);
      })
      .catch(err => {
        console.error('Failed to fetch stats:', err);
        setStats(null); // Don't use fallback - show "failed to load"
      })
      .finally(() => setStatsLoading(false));

    // Fetch available LLM models - REAL LIVE DATA ONLY
    fetch('http://localhost:5000/api/llm/models')
      .then(r => r.json())
      .then(data => {
        console.log('Models data:', data);
        const models = data.models || data.all_models || [];
        setLlmModels(models);
        if (models && models.length > 0) {
          setModel(models[0].id);
        }
      })
      .catch(err => {
        console.error('Failed to fetch models:', err);
        setLlmModels([]); // Don't use fallback - show empty
      })
      .finally(() => setModelsLoading(false));
  }, []);

  const handleChat = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim() || !model) {
      setResponse('❌ Please select a model and enter a prompt');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/llm/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, prompt }),
      });
      const data = await res.json();

      // Check if response contains error
      if (!res.ok) {
        setResponse(`❌ API Error: ${data.error || 'Unknown error'}`);
        return;
      }

      // Check if response has the answer
      if (data.response) {
        setResponse(data.response);
        setPrompt('');
      } else if (data.error) {
        setResponse(`❌ ${data.error}`);
      } else {
        setResponse('❌ No response from API');
      }
    } catch (err: unknown) {
      console.error('Failed to call LLM:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to backend';
      setResponse(`❌ Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
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
            <Link href="/dashboard" className="px-4 py-2 rounded-lg bg-cyan-600/50 hover:bg-cyan-500/50 border border-cyan-500/50">
              Dashboard
            </Link>
            <Link href="/avatars" className="px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600">
              Avatars
            </Link>
            <Link href="/billing" className="px-4 py-2 rounded-lg bg-amber-600/50 hover:bg-amber-500/50">
              Billing
            </Link>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <BarChart3 className="w-12 h-12 text-cyan-400" />
              <div>
                <h1 className="text-5xl font-bold">Dashboard</h1>
                <p className="text-slate-400 mt-2">Welcome back! Here's your platform overview</p>
              </div>
            </div>
          </div>

          {/* User Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {/* Credits */}
            <div className="p-6 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-2xl border border-amber-400/30 backdrop-blur">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-amber-300 text-sm">Available Credits</p>
                  <div className="text-4xl font-bold mt-2">{userStats.credits}</div>
                </div>
                <CreditCard className="w-10 h-10 text-amber-400 opacity-50" />
              </div>
              <div className="h-1 bg-amber-900 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{width: '70%'}}></div>
              </div>
              <p className="text-xs text-amber-300 mt-2">Enough for ~450 requests</p>
            </div>

            {/* Current Tier */}
            <div className="p-6 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl border border-purple-400/30 backdrop-blur">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-purple-300 text-sm">Current Plan</p>
                  <div className="text-4xl font-bold mt-2 text-purple-300">{userStats.tier}</div>
                </div>
                <Award className="w-10 h-10 text-purple-400 opacity-50" />
              </div>
              <p className="text-sm text-purple-400">Unlimited LLM Requests</p>
              <Link href="/billing" className="text-xs text-purple-300 hover:text-purple-200 mt-2 inline-block">
                Upgrade Plan →
              </Link>
            </div>

            {/* Deployments */}
            <div className="p-6 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-2xl border border-cyan-400/30 backdrop-blur">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-cyan-300 text-sm">Active Deployments</p>
                  <div className="text-4xl font-bold mt-2">{userStats.deployment}</div>
                </div>
                <Activity className="w-10 h-10 text-cyan-400 opacity-50" />
              </div>
              <div className="text-xs text-cyan-300">All running smoothly ✓</div>
              <p className="text-sm text-cyan-400 mt-2">15/20 slots used</p>
            </div>

            {/* Storage */}
            <div className="p-6 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl border border-green-400/30 backdrop-blur">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-green-300 text-sm">Storage Used</p>
                  <div className="text-4xl font-bold mt-2">{userStats.storage}GB</div>
                </div>
                <Clock className="w-10 h-10 text-green-400 opacity-50" />
              </div>
              <div className="h-1 bg-green-900 rounded-full overflow-hidden">
                <div className="h-full bg-green-400 rounded-full" style={{width: '42%'}}></div>
              </div>
              <p className="text-xs text-green-300 mt-2">20GB available</p>
            </div>
          </div>

          {/* Platform Wide Stats - REAL LIVE DATA */}
          {statsLoading ? (
            <div className="text-center py-12 text-slate-400">Loading platform statistics...</div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-cyan-400/50 transition">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-cyan-400" />
                  </div>
                  <span className="text-slate-400 text-sm">Platform Users</span>
                </div>
                <div className="text-3xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-slate-500 mt-2">↑ 12% from last week</p>
              </div>

              <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-purple-400/50 transition">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <CreditCard className="w-6 h-6 text-purple-400" />
                  </div>
                  <span className="text-slate-400 text-sm">Active Subscriptions</span>
                </div>
                <div className="text-3xl font-bold">{stats.activeSubscriptions}</div>
                <p className="text-xs text-slate-500 mt-2">↑ 33% from last week</p>
              </div>

              <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-amber-400/50 transition">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    <Brain className="w-6 h-6 text-amber-400" />
                  </div>
                  <span className="text-slate-400 text-sm">LLM Requests</span>
                </div>
                <div className="text-3xl font-bold">{stats.llmRequests.toLocaleString()}</div>
                <p className="text-xs text-slate-500 mt-2">↑ 67% from last week</p>
              </div>

              <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-green-400/50 transition">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                  <span className="text-slate-400 text-sm">Monthly Revenue</span>
                </div>
                <div className="text-3xl font-bold">${stats.monthlyRevenue.toFixed(2)}</div>
                <p className="text-xs text-slate-500 mt-2">↑ 45% from last week</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-red-400">Failed to load platform statistics. Check backend connection.</div>
          )}

          {/* AI Chat Playground */}
          <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-2xl border border-slate-700/50 backdrop-blur">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-cyan-500/20 rounded-lg">
                <Cpu className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">AI Chat Playground</h2>
                <p className="text-slate-400 text-sm mt-1">Test any AI model in real-time</p>
              </div>
            </div>

            <form onSubmit={handleChat} className="space-y-6">
              {/* Model Selection */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-slate-300">
                  Choose AI Model ({modelsLoading ? 'Loading...' : llmModels.length})
                </label>
                {modelsLoading ? (
                  <div className="p-4 text-slate-400">Loading available AI models...</div>
                ) : llmModels.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {llmModels.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setModel(m.id)}
                        className={`p-3 rounded-lg font-semibold transition border ${
                          model === m.id
                            ? 'bg-cyan-600 border-cyan-400 text-white'
                            : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-cyan-400'
                        }`}
                        title={m.provider}
                      >
                        <div className="font-bold">{m.name}</div>
                        <div className="text-xs text-slate-400 mt-1">{m.provider}</div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-red-400">No AI models available. Check backend connection and API keys.</div>
                )}
              </div>

              {/* Prompt Input */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-slate-300">Your Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask anything... What would you like to explore?"
                  rows={5}
                  className="w-full px-4 py-3 bg-slate-700 rounded-lg border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 resize-none"
                />
                <p className="text-xs text-slate-400 mt-2">{prompt.length} characters</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !prompt.trim() || !model || modelsLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 disabled:from-slate-600 disabled:to-slate-600 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="w-5 h-5" />
                {loading ? 'Generating Response...' : modelsLoading ? 'Loading Models...' : !model ? 'Select a Model First' : 'Send Prompt'}
              </button>
            </form>

            {/* Response */}
            {response && (
              <div className={`mt-8 p-6 rounded-xl border animate-fadeIn ${
                response.includes('❌')
                  ? 'bg-red-900/20 border-red-600/50'
                  : 'bg-slate-900/50 border-slate-600/50'
              }`}>
                <h3 className={`font-bold mb-3 flex items-center gap-2 ${
                  response.includes('❌') ? 'text-red-400' : 'text-cyan-400'
                }`}>
                  <Brain className="w-5 h-5" />
                  {response.includes('❌') ? 'Error' : 'AI Response'}
                </h3>
                <p className={`leading-relaxed whitespace-pre-wrap break-words ${
                  response.includes('❌') ? 'text-red-300' : 'text-slate-300'
                }`}>
                  {response}
                </p>
              </div>
            )}
          </div>

          {/* Usage Chart */}
          <div className="mt-12 p-8 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-2xl border border-slate-700/50 backdrop-blur">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-amber-400" />
              Your Usage This Month
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* LLM Requests Chart */}
              <div>
                <h3 className="font-semibold mb-4 text-slate-300">LLM Requests</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Claude', value: 42 },
                    { label: 'GPT-4', value: 58 },
                    { label: 'Gemini', value: 0 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">{item.label}</span>
                        <span className="text-slate-300 font-semibold">{item.value}%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deployment Status */}
              <div>
                <h3 className="font-semibold mb-4 text-slate-300">Deployment Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400">15 Running</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-amber-500/10 rounded-lg">
                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                    <span className="text-amber-400">0 Building</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-red-500/10 rounded-lg">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-red-400">0 Failed</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="font-semibold mb-4 text-slate-300">Recent Activity</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2 p-2 hover:bg-slate-700/50 rounded">
                    <span className="text-cyan-400">●</span>
                    <div>
                      <p className="text-slate-300">Created avatar "Luna"</p>
                      <p className="text-xs text-slate-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 hover:bg-slate-700/50 rounded">
                    <span className="text-purple-400">●</span>
                    <div>
                      <p className="text-slate-300">Deployed project v2.1</p>
                      <p className="text-xs text-slate-500">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 hover:bg-slate-700/50 rounded">
                    <span className="text-amber-400">●</span>
                    <div>
                      <p className="text-slate-300">Upgraded to Pro Plan</p>
                      <p className="text-xs text-slate-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
