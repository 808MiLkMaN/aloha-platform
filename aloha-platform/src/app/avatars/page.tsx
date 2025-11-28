'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { Users, Plus, Sparkles, Palette, Mic2, Smile } from 'lucide-react';

export default function AvatarsPage() {
  const [avatars, setAvatars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [type, setType] = useState('female');
  const [skinTone, setSkinTone] = useState('medium');
  const [hairColor, setHairColor] = useState('brown');
  const [personality, setPersonality] = useState('friendly');

  const avatarTypes = [
    { id: 'male', label: 'Male', emoji: '👨' },
    { id: 'female', label: 'Female', emoji: '👩' },
    { id: 'cosmic', label: 'Cosmic', emoji: '✨' },
  ];

  const personalities = ['friendly', 'professional', 'playful', 'sophisticated'];
  const skinTones = ['light', 'medium', 'dark'];
  const hairColors = ['brown', 'black', 'blonde', 'red'];

  useEffect(() => {
    // Fetch avatars from backend
    fetch('http://localhost:5000/api/avatars')
      .then(r => r.json())
      .then(data => setAvatars(data.avatars || []))
      .catch(err => {
        console.error('Failed to fetch avatars:', err);
        setAvatars([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCreateAvatar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await fetch('http://localhost:5000/api/avatars/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          type,
          customization: { skinTone, hairColor, personality, voiceId: 'premium-voice' },
        }),
      });
      const data = await res.json();
      if (data.avatar) {
        setAvatars([...avatars, data.avatar]);
        setName('');
      }
    } catch (err) {
      console.error('Failed to create avatar:', err);
    }
  };

  // Demo avatar for preview
  const getAvatarEmoji = (type: string): string => {
    const emojis: Record<string, string> = { male: '👨', female: '👩', cosmic: '✨' };
    return emojis[type] || '👤';
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
            <Link href="/dashboard" className="px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600">
              Dashboard
            </Link>
            <Link href="/avatars" className="px-4 py-2 rounded-lg bg-cyan-600/50 hover:bg-cyan-500/50 border border-cyan-500/50">
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
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Users className="w-10 h-10 text-purple-400" />
              </div>
              <div>
                <h1 className="text-5xl font-bold">Avatar Studio</h1>
                <p className="text-slate-400 mt-2">Create and customize photorealistic 3D avatars</p>
              </div>
            </div>
          </div>

          {/* Create Avatar Form */}
          <div className="mb-12 p-8 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-2xl border border-slate-700/50 backdrop-blur">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-cyan-400" />
              Create Your Avatar
            </h2>

            <form onSubmit={handleCreateAvatar} className="space-y-8">
              {/* Avatar Name */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-slate-300">Avatar Name</label>
                <input
                  type="text"
                  placeholder="e.g., Luna, Alex, Nova..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 rounded-lg border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                />
              </div>

              {/* Avatar Type Selection */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-slate-300">Avatar Type</label>
                <div className="grid grid-cols-3 gap-4">
                  {avatarTypes.map((avType) => (
                    <button
                      key={avType.id}
                      type="button"
                      onClick={() => setType(avType.id)}
                      className={`p-4 rounded-xl border-2 transition ${
                        type === avType.id
                          ? 'bg-cyan-600/30 border-cyan-400'
                          : 'bg-slate-700 border-slate-600 hover:border-cyan-400/50'
                      }`}
                    >
                      <div className="text-4xl mb-2">{avType.emoji}</div>
                      <div className="font-semibold">{avType.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Customization Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Skin Tone */}
                <div>
                  <label className="block text-sm font-semibold mb-3 text-slate-300 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Skin Tone
                  </label>
                  <div className="space-y-2">
                    {skinTones.map((tone) => (
                      <button
                        key={tone}
                        type="button"
                        onClick={() => setSkinTone(tone)}
                        className={`w-full px-4 py-2 rounded-lg border transition capitalize ${
                          skinTone === tone
                            ? 'bg-cyan-600 border-cyan-400'
                            : 'bg-slate-700 border-slate-600 hover:border-cyan-400'
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hair Color */}
                <div>
                  <label className="block text-sm font-semibold mb-3 text-slate-300 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Hair Color
                  </label>
                  <div className="space-y-2">
                    {hairColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setHairColor(color)}
                        className={`w-full px-4 py-2 rounded-lg border transition capitalize ${
                          hairColor === color
                            ? 'bg-cyan-600 border-cyan-400'
                            : 'bg-slate-700 border-slate-600 hover:border-cyan-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Personality Selection */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-slate-300 flex items-center gap-2">
                  <Smile className="w-4 h-4" />
                  Personality
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {personalities.map((pers) => (
                    <button
                      key={pers}
                      type="button"
                      onClick={() => setPersonality(pers)}
                      className={`p-3 rounded-lg border transition capitalize ${
                        personality === pers
                          ? 'bg-purple-600 border-purple-400'
                          : 'bg-slate-700 border-slate-600 hover:border-purple-400'
                      }`}
                    >
                      {pers}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview & Submit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Preview */}
                <div className="p-6 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-xl border border-purple-400/20">
                  <h3 className="text-sm font-semibold text-slate-300 mb-4">Live Preview</h3>
                  <div className="aspect-square bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-600">
                    <div className="text-center">
                      <div className="text-8xl mb-4">{getAvatarEmoji(type)}</div>
                      <p className="text-slate-400">{name || 'Your Avatar'}</p>
                      <p className="text-xs text-slate-500 mt-2 capitalize">{personality} • {skinTone} • {hairColor}</p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col justify-center gap-4">
                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transform hover:scale-105 transition"
                  >
                    <Plus className="w-6 h-6" />
                    Create Avatar
                  </button>
                  <p className="text-xs text-slate-500 text-center">
                    Your avatar will be rendered with voice synthesis and 3D animation support
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* Avatars Gallery */}
          <div>
            <h2 className="text-3xl font-bold mb-2">Your Avatars</h2>
            <p className="text-slate-400 mb-8">Manage and deploy your custom avatars</p>

            {loading ? (
              <div className="text-center py-12">
                <div className="text-slate-400 flex items-center justify-center gap-2">
                  <div className="animate-spin">⚙️</div>
                  Loading avatars...
                </div>
              </div>
            ) : avatars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {avatars.map((avatar) => (
                  <div
                    key={avatar.id}
                    className="group p-6 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-2xl border border-slate-700/50 hover:border-cyan-400/50 transition backdrop-blur"
                  >
                    {/* Avatar Preview */}
                    <div className="w-full h-56 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-xl mb-4 flex items-center justify-center border-2 border-dashed border-slate-600 group-hover:border-cyan-400/50 transition">
                      <div className="text-center">
                        <div className="text-6xl mb-2">{getAvatarEmoji(avatar.type)}</div>
                        <p className="text-sm text-slate-400">{avatar.name}</p>
                      </div>
                    </div>

                    {/* Avatar Details */}
                    <h3 className="font-bold text-xl mb-2">{avatar.name}</h3>
                    <p className="text-sm text-slate-400 mb-4 capitalize">Type: {avatar.type}</p>

                    {/* Customization Info */}
                    <div className="space-y-2 mb-4 text-xs text-slate-500">
                      <p>✓ Skin: {avatar.customization?.skinTone || 'Default'}</p>
                      <p>✓ Hair: {avatar.customization?.hairColor || 'Default'}</p>
                      <p>✓ Personality: {avatar.customization?.personality || 'Friendly'}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <button className="w-full px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 rounded-lg font-semibold text-sm">
                        Deploy Avatar
                      </button>
                      <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold text-sm">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 p-8 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-2xl border border-slate-700/50 border-dashed">
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-2xl font-bold mb-2">No Avatars Yet</h3>
                <p className="text-slate-400 mb-6">Create your first avatar using the form above</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
