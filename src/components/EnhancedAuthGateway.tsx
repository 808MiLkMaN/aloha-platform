/**
 * ENHANCED AUTHENTICATION GATEWAY
 * Features: Password Toggle, Dark/Light Theme, Graphics Toggle, Forgot Password, SSO
 * Creator: 808_KiNg_MiLkMaN (Malcolm Lee)
 * Email: malcolmlee3@gmail.com
 */

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Moon, Sun, Zap, ZapOff, Mail, Lock, ArrowLeft, Github, Globe } from 'lucide-react';

interface AuthGatewayProps {
  onLogin: (userData: any) => void;
  onThemeChange?: (theme: 'dark' | 'light') => void;
  onGraphicsToggle?: (enabled: boolean) => void;
}

interface AuthState {
  mode: 'login' | 'signup' | 'forgotPassword';
  email: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  rememberMe: boolean;
  loading: boolean;
  error: string | null;
  theme: 'dark' | 'light';
  graphicsEnabled: boolean;
}

const CREATOR_EMAIL = 'malcolmlee3@gmail.com';
const CREATOR_HANDLE = '808_KiNg_MiLkMaN';

export const EnhancedAuthGateway: React.FC<AuthGatewayProps> = ({
  onLogin,
  onThemeChange,
  onGraphicsToggle
}) => {
  const [state, setState] = useState<AuthState>({
    mode: 'login',
    email: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    rememberMe: false,
    loading: false,
    error: null,
    theme: 'dark',
    graphicsEnabled: true
  });

  // Initialize from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
      const savedGraphics = localStorage.getItem('graphicsEnabled') !== 'false';
      setState(prev => ({
        ...prev,
        theme: savedTheme,
        graphicsEnabled: savedGraphics
      }));
    }
  }, []);

  // Apply theme on mount and change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', state.theme);
      document.documentElement.setAttribute('data-theme', state.theme);
      onThemeChange?.(state.theme);
    }
  }, [state.theme]);

  // Toggle graphics
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('graphicsEnabled', String(state.graphicsEnabled));
    }
    onGraphicsToggle?.(state.graphicsEnabled);
  }, [state.graphicsEnabled]);

  const handleLogin = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Simulate auth delay
      await new Promise(r => setTimeout(r, 1000));

      if (!state.email || !state.password) {
        throw new Error('Email and password required');
      }

      // Admin check
      if (state.email === CREATOR_EMAIL && state.password === 'QueenSupernova2025!Lifetime') {
        onLogin({
          email: state.email,
          name: 'Supreme Architect',
          role: 'admin',
          handle: CREATOR_HANDLE,
          tier: 'LIFETIME_UNLIMITED'
        });
      } else {
        onLogin({
          email: state.email,
          name: state.email.split('@')[0],
          role: 'user',
          tier: 'starter'
        });
      }

      if (state.rememberMe) {
        localStorage.setItem('rememberedEmail', state.email);
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Authentication failed',
        loading: false
      }));
    }
  };

  const handleSignup = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      if (!state.email || !state.password || !state.confirmPassword) {
        throw new Error('All fields required');
      }
      if (state.password !== state.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      if (state.password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      await new Promise(r => setTimeout(r, 1000));

      onLogin({
        email: state.email,
        name: state.email.split('@')[0],
        role: 'user',
        tier: 'free'
      });
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Signup failed',
        loading: false
      }));
    }
  };

  const handleSSO = (provider: 'google' | 'github') => {
    setState(prev => ({ ...prev, loading: true }));

    // Simulate SSO flow
    setTimeout(() => {
      onLogin({
        email: `user.${Date.now()}@${provider}.com`,
        name: `${provider} User`,
        role: 'user',
        tier: 'starter',
        ssoProvider: provider
      });
    }, 1500);
  };

  const handleForgotPassword = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      if (!state.email) {
        throw new Error('Email required');
      }

      await new Promise(r => setTimeout(r, 800));

      setState(prev => ({
        ...prev,
        loading: false,
        mode: 'login',
        error: null
      }));

      // Show success (in real app, would send reset email)
      alert(`Password reset link sent to ${state.email}`);
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to process',
        loading: false
      }));
    }
  };

  const bgClass = state.graphicsEnabled
    ? 'bg-gradient-to-br from-slate-950 via-purple-900 to-black'
    : 'bg-slate-900';

  const inputClass = state.theme === 'dark'
    ? 'bg-slate-900/80 border-slate-600 text-white placeholder-slate-400'
    : 'bg-white/10 border-white/20 text-white placeholder-white/50';

  const labelClass = state.theme === 'dark'
    ? 'text-slate-300'
    : 'text-white/90';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center relative overflow-hidden font-sans transition-colors duration-300 ${bgClass}`}>
      {/* Animated Background */}
      {state.graphicsEnabled && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        </div>
      )}

      {/* Top Control Bar */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
        {/* Graphics Toggle */}
        <button
          onClick={() => setState(prev => ({ ...prev, graphicsEnabled: !prev.graphicsEnabled }))}
          className={`p-3 rounded-lg backdrop-blur-md border transition-all ${
            state.graphicsEnabled
              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
              : 'bg-slate-700/20 border-slate-600/50 text-slate-300'
          }`}
          title={state.graphicsEnabled ? 'Disable graphics' : 'Enable graphics'}
        >
          {state.graphicsEnabled ? <Zap size={20} /> : <ZapOff size={20} />}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setState(prev => ({
            ...prev,
            theme: prev.theme === 'dark' ? 'light' : 'dark'
          }))}
          className={`p-3 rounded-lg backdrop-blur-md border transition-all ${
            state.theme === 'dark'
              ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
              : 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300'
          }`}
          title="Toggle theme"
        >
          {state.theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      {/* Main Auth Card */}
      <div className={`relative z-20 w-full max-w-md mx-4 rounded-3xl backdrop-blur-xl border transition-all ${
        state.theme === 'dark'
          ? 'bg-black/60 border-cyan-500/30 shadow-[0_0_50px_rgba(34,211,238,0.2)]'
          : 'bg-white/20 border-white/30 shadow-[0_0_50px_rgba(255,255,255,0.2)]'
      } p-8`}>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-wider mb-2" style={{fontFamily: 'Orbitron'}}>
            {state.mode === 'login' ? 'ALOHA AGENTIC' :
             state.mode === 'signup' ? 'JOIN ALOHA' :
             'RECOVER ACCESS'}
          </h1>
          <p className={`text-xs tracking-widest ${labelClass}`}>
            {state.mode === 'login' ? 'ENTER THE UNIVERSE' :
             state.mode === 'signup' ? 'CREATE ACCOUNT' :
             'RESET PASSWORD'}
          </p>
          <p className="text-[10px] text-cyan-400 mt-2">Created by {CREATOR_HANDLE}</p>
        </div>

        {/* Error Message */}
        {state.error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-6 text-red-300 text-sm">
            {state.error}
          </div>
        )}

        {/* Login Form */}
        {state.mode === 'login' && (
          <div className="space-y-4">
            <div>
              <label className={`text-xs font-bold uppercase tracking-widest block mb-2 ${labelClass}`}>Email</label>
              <input
                type="email"
                value={state.email}
                onChange={e => setState(prev => ({ ...prev, email: e.target.value, error: null }))}
                placeholder="identity@example.com"
                className={`w-full p-3 rounded-lg border outline-none transition-all ${inputClass}`}
              />
            </div>

            <div>
              <label className={`text-xs font-bold uppercase tracking-widest block mb-2 ${labelClass}`}>Password</label>
              <div className="relative">
                <input
                  type={state.showPassword ? 'text' : 'password'}
                  value={state.password}
                  onChange={e => setState(prev => ({ ...prev, password: e.target.value, error: null }))}
                  placeholder="••••••••"
                  className={`w-full p-3 pr-10 rounded-lg border outline-none transition-all ${inputClass}`}
                />
                <button
                  onClick={() => setState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {state.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.rememberMe}
                  onChange={e => setState(prev => ({ ...prev, rememberMe: e.target.checked }))}
                  className="w-4 h-4 rounded"
                />
                <span className={labelClass}>Remember me</span>
              </label>
              <button
                onClick={() => setState(prev => ({ ...prev, mode: 'forgotPassword', error: null }))}
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Forgot?
              </button>
            </div>

            <button
              onClick={handleLogin}
              disabled={state.loading}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold rounded-lg tracking-widest transition-all"
            >
              {state.loading ? 'AUTHENTICATING...' : 'ENTER'}
            </button>

            {/* SSO Options */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${state.theme === 'dark' ? 'border-slate-700' : 'border-white/20'}`}></div>
              </div>
              <div className={`relative flex justify-center text-xs font-bold uppercase tracking-widest ${state.theme === 'dark' ? 'bg-black/60' : 'bg-white/10'} px-2 w-fit mx-auto`}>
                OR CONNECT WITH
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleSSO('google')}
                disabled={state.loading}
                className={`p-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                  state.theme === 'dark'
                    ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50'
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                }`}
              >
                <Globe size={18} />
                <span className="text-xs font-bold">Google</span>
              </button>
              <button
                onClick={() => handleSSO('github')}
                disabled={state.loading}
                className={`p-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                  state.theme === 'dark'
                    ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50'
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                }`}
              >
                <Github size={18} />
                <span className="text-xs font-bold">GitHub</span>
              </button>
            </div>

            <div className={`text-center text-xs ${labelClass}`}>
              Don't have an account?{' '}
              <button
                onClick={() => setState(prev => ({ ...prev, mode: 'signup', error: null, password: '', confirmPassword: '' }))}
                className="text-cyan-400 hover:text-cyan-300 font-bold ml-1"
              >
                SIGN UP
              </button>
            </div>
          </div>
        )}

        {/* Signup Form */}
        {state.mode === 'signup' && (
          <div className="space-y-4">
            <div>
              <label className={`text-xs font-bold uppercase tracking-widest block mb-2 ${labelClass}`}>Email</label>
              <input
                type="email"
                value={state.email}
                onChange={e => setState(prev => ({ ...prev, email: e.target.value, error: null }))}
                placeholder="your@email.com"
                className={`w-full p-3 rounded-lg border outline-none transition-all ${inputClass}`}
              />
            </div>

            <div>
              <label className={`text-xs font-bold uppercase tracking-widest block mb-2 ${labelClass}`}>Password</label>
              <div className="relative">
                <input
                  type={state.showPassword ? 'text' : 'password'}
                  value={state.password}
                  onChange={e => setState(prev => ({ ...prev, password: e.target.value, error: null }))}
                  placeholder="Min 8 characters"
                  className={`w-full p-3 pr-10 rounded-lg border outline-none transition-all ${inputClass}`}
                />
                <button
                  onClick={() => setState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {state.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className={`text-xs font-bold uppercase tracking-widest block mb-2 ${labelClass}`}>Confirm Password</label>
              <input
                type={state.showPassword ? 'text' : 'password'}
                value={state.confirmPassword}
                onChange={e => setState(prev => ({ ...prev, confirmPassword: e.target.value, error: null }))}
                placeholder="Repeat password"
                className={`w-full p-3 rounded-lg border outline-none transition-all ${inputClass}`}
              />
            </div>

            <button
              onClick={handleSignup}
              disabled={state.loading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold rounded-lg tracking-widest transition-all"
            >
              {state.loading ? 'CREATING...' : 'CREATE ACCOUNT'}
            </button>

            <div className={`text-center text-xs ${labelClass}`}>
              Already have an account?{' '}
              <button
                onClick={() => setState(prev => ({ ...prev, mode: 'login', error: null }))}
                className="text-cyan-400 hover:text-cyan-300 font-bold ml-1"
              >
                LOG IN
              </button>
            </div>
          </div>
        )}

        {/* Forgot Password Form */}
        {state.mode === 'forgotPassword' && (
          <div className="space-y-4">
            <p className={`text-sm ${labelClass} text-center mb-6`}>
              Enter your email and we'll send you a link to reset your password
            </p>

            <div>
              <label className={`text-xs font-bold uppercase tracking-widest block mb-2 ${labelClass}`}>Email</label>
              <input
                type="email"
                value={state.email}
                onChange={e => setState(prev => ({ ...prev, email: e.target.value, error: null }))}
                placeholder="your@email.com"
                className={`w-full p-3 rounded-lg border outline-none transition-all ${inputClass}`}
              />
            </div>

            <button
              onClick={handleForgotPassword}
              disabled={state.loading}
              className="w-full py-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold rounded-lg tracking-widest transition-all"
            >
              {state.loading ? 'SENDING...' : 'SEND RESET LINK'}
            </button>

            <button
              onClick={() => setState(prev => ({ ...prev, mode: 'login', error: null }))}
              className={`w-full py-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                state.theme === 'dark'
                  ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50'
                  : 'bg-white/10 border-white/20 hover:bg-white/20'
              }`}
            >
              <ArrowLeft size={18} />
              <span className="font-bold">BACK TO LOGIN</span>
            </button>
          </div>
        )}

        {/* Footer */}
        <div className={`text-center text-[10px] mt-8 ${state.theme === 'dark' ? 'text-slate-500' : 'text-white/50'}`}>
          <p>🌺 ALOHA NOVA UNIVERSE</p>
          <p>Powered by Advanced AI Agents</p>
          <p className="mt-2 text-cyan-600">Built by 808_KiNg_MiLkMaN</p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAuthGateway;
