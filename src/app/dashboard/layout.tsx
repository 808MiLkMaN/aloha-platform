import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Aloha Nova Universe - AI Platform Admin',
  description: 'Access your Aloha Nova Universe dashboard. Monitor AI chat, deployments, analytics, and manage your account created by 808_KiNg_MiLkMaN.',
  keywords: ['dashboard', 'admin panel', 'analytics', 'AI chat', 'deployments'],
  openGraph: {
    type: 'website',
    title: 'Dashboard | Aloha Nova Universe',
    description: 'Monitor and manage your AI platform',
    url: 'https://alohanovauniverse.ai/dashboard',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
