import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | Aloha Nova Universe - AI Avatar Platform',
  description: 'Sign in to your Aloha Nova Universe account. Access your AI avatars, deployments, and dashboard powered by 808_KiNg_MiLkMaN.',
  keywords: ['login', 'sign in', 'authentication', 'aloha nova'],
  openGraph: {
    type: 'website',
    title: 'Login | Aloha Nova Universe',
    description: 'Sign in to your Aloha Nova Universe account',
    url: 'https://alohanovauniverse.ai/login',
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
