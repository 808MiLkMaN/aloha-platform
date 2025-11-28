import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing & Billing | Aloha Nova Universe - Plans & Features',
  description: 'Choose your plan with Aloha Nova Universe. Free tier or premium plans with unlimited AI avatars, deployments, and more. Created by 808_KiNg_MiLkMaN.',
  keywords: ['pricing', 'plans', 'billing', 'subscription', 'enterprise'],
  openGraph: {
    type: 'website',
    title: 'Pricing & Billing | Aloha Nova Universe',
    description: 'Flexible pricing plans for creators and enterprises',
    url: 'https://alohanovauniverse.ai/billing',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BillingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
