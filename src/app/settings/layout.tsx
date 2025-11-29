import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings - Aloha Nova Universe',
  description: 'Manage your API keys, integrate custom LLM models, and configure your account settings.',
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
