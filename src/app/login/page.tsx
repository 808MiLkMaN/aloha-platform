'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EnhancedAuthGateway from '@/components/EnhancedAuthGateway';

export default function LoginPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const handleLogin = (credentials: any) => {
    // Store auth data in localStorage
    localStorage.setItem('auth-user', JSON.stringify(credentials));

    // Redirect to dashboard
    router.push('/dashboard');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-slate-950' : 'bg-white'}`}>
      <EnhancedAuthGateway
        onLogin={handleLogin}
        onThemeChange={setTheme}
      />
    </div>
  );
}
