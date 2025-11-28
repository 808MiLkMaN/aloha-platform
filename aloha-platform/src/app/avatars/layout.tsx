import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Avatar Studio | Aloha Nova Universe - Create AI Avatars',
  description: 'Create stunning photorealistic AI avatars with voice synthesis, expressions, and full customization. Powered by advanced AI by 808_KiNg_MiLkMaN.',
  keywords: ['avatar creation', '3D avatars', 'AI avatars', 'voice synthesis', 'photorealistic'],
  openGraph: {
    type: 'website',
    title: 'Avatar Studio | Aloha Nova Universe',
    description: 'Create your own AI avatar with advanced customization',
    url: 'https://alohanovauniverse.ai/avatars',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AvatarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
