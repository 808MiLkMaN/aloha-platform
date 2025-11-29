'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { Settings, Key, Trash2, Plus, Check, AlertCircle, Lock } from 'lucide-react';

export default function SettingsPage() {
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedKeys, setSavedKeys] = useState<any>({});
  const [userEmail] = useState('malcolmlee3@gmail.com');

  // Form state
  const [provider, setProvider] = useState('claude');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  // Load saved API keys on mount
  useEffect(() => {
    fetchSavedKeys();
  }, []);

  const fetchSavedKeys = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/settings/api-keys', {
        headers: {
          'x-user-email': userEmail,
        },
      });
      const data = await response.json();
      if (data.success) {
        setSavedKeys(data.keys || {});
      }
    } catch (error) {
      console.error('Failed to fetch saved keys:', error);
    }
  };

  const handleAddKey = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!apiKey.trim()) {
      setMessage('❌ Please enter an API key');
      setMessageType('error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/settings/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': userEmail,
        },
        body: JSON.stringify({
          email: userEmail,
          provider,
          apiKey,
          model: model || provider.toLowerCase(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${provider} API key saved successfully!`);
        setMessageType('success');
        setApiKey('');
        setModel('');
        setShowForm(false);
        await fetchSavedKeys();
      } else {
        setMessage(`❌ ${data.error || 'Failed to save API key'}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKey = async (providerName: string) => {
    if (!confirm(`Delete ${providerName} API key?`)) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/settings/api-keys/${providerName}`,
        {
          method: 'DELETE',
          headers: {
            'x-user-email': userEmail,
          },
        }
      );

      if (response.ok) {
        setMessage(`✅ ${providerName} API key deleted`);
        setMessageType('success');
        await fetchSavedKeys();
      } else {
        setMessage('❌ Failed to delete API key');
        setMessageType('error');
      }
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setMessageType('error');
    }
  };

  const providers = [
    { id: 'claude', name: 'Claude 3.5 Sonnet', company: 'Anthropic', description: 'Advanced reasoning and analysis' },
    { id: 'gpt-4', name: 'GPT-4o Mini', company: 'OpenAI', description: 'Fast and efficient responses' },
    { id: 'gemini', name: 'Gemini 2.0 Flash', company: 'Google', description: 'Multimodal AI capabilities' },
  ];

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
            <Link href="/settings" className="px-4 py-2 rounded-lg bg-cyan-600/50 hover:bg-cyan-500/50 border border-cyan-500/50">
              Settings
            </Link>
            <Link href="/billing" className="px-4 py-2 rounded-lg bg-amber-600/50 hover:bg-amber-500/50">
              Billing
            </Link>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <Settings className="w-12 h-12 text-cyan-400" />
              <div>
                <h1 className="text-5xl font-bold">Settings</h1>
                <p className="text-slate-400 mt-2">Manage your API keys and AI model integrations</p>
              </div>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl border animate-fadeIn flex items-center gap-3 ${
              messageType === 'success'
                ? 'bg-green-900/20 border-green-600/50 text-green-300'
                : 'bg-red-900/20 border-red-600/50 text-red-300'
            }`}>
              {messageType === 'success' ? (
                <Check className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              {message}
            </div>
          )}

          {/* API Keys Section */}
          <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-2xl border border-slate-700/50 backdrop-blur mb-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <Key className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">API Keys</h2>
                  <p className="text-slate-400 text-sm mt-1">Add custom LLM model API keys</p>
                </div>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 rounded-lg font-bold flex items-center gap-2 transition transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Add New Key
              </button>
            </div>

            {/* Add Key Form */}
            {showForm && (
              <form onSubmit={handleAddKey} className="mb-8 p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Provider Selection */}
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-slate-300">
                      AI Provider
                    </label>
                    <select
                      value={provider}
                      onChange={(e) => setProvider(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700 rounded-lg border border-slate-600 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                    >
                      {providers.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.company})
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-400 mt-2">
                      {providers.find((p) => p.id === provider)?.description}
                    </p>
                  </div>

                  {/* Model (Optional) */}
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-slate-300">
                      Model (Optional)
                    </label>
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="e.g., claude-3-opus, gpt-4-turbo..."
                      className="w-full px-4 py-3 bg-slate-700 rounded-lg border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                    />
                    <p className="text-xs text-slate-400 mt-2">Leave blank for default model</p>
                  </div>
                </div>

                {/* API Key Input */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-3 text-slate-300 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    API Key
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Paste your API key here (will be stored securely)"
                    className="w-full px-4 py-3 bg-slate-700 rounded-lg border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 font-mono"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    Get your API key from {providers.find((p) => p.id === provider)?.company} dashboard
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading || !apiKey.trim()}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-slate-600 disabled:to-slate-600 rounded-lg font-bold transition disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save API Key'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Saved Keys List */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-300 mb-4">Your Saved Keys ({Object.keys(savedKeys).length})</h3>
              {Object.keys(savedKeys).length > 0 ? (
                Object.entries(savedKeys).map(([key, config]: [string, any]) => (
                  <div
                    key={key}
                    className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600/50 transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-cyan-500/20 rounded-lg">
                        <Key className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{config.provider}</p>
                        <p className="text-sm text-slate-400">
                          Model: {config.model} • Added {new Date(config.addedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteKey(key)}
                      className="p-2 hover:bg-red-600/20 rounded-lg text-red-400 hover:text-red-300 transition"
                      title="Delete API key"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700/50 text-center text-slate-400">
                  No API keys saved yet. Add one to start using custom LLM models!
                </div>
              )}
            </div>
          </div>

          {/* How to Get Keys */}
          <div className="p-8 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur">
            <h3 className="text-2xl font-bold mb-6">How to Get Your API Keys</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {providers.map((provider) => (
                <div key={provider.id} className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <h4 className="font-bold text-lg mb-3">{provider.company}</h4>
                  <p className="text-sm text-slate-400 mb-4">{provider.description}</p>
                  <a
                    href={
                      provider.id === 'claude'
                        ? 'https://console.anthropic.com'
                        : provider.id === 'gpt-4'
                        ? 'https://platform.openai.com'
                        : 'https://makersuite.google.com'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 font-semibold text-sm transition"
                  >
                    Get {provider.company} API Key →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
