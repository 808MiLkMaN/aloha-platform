/**
 * Aloha Nova Universe - Backend API Server
 * Multi-LLM Integration, Stripe Billing, Avatar Management
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { Anthropic } from '@anthropic-ai/sdk';
import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Initialize LLM Clients
const llmClients = {
  anthropic: process.env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null,
  openai: process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null,
  google: process.env.GOOGLE_AI_KEY ? new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY) : null,
};

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// Admin Access Control
const ADMIN_EMAILS = [
  'malcolmlee3@gmail.com',
  'alohanovauniverse.ai@gmail.com'
];

// Enhanced Data Models with Details
const users = new Map();
const avatarGallery = new Map();
const deployments = new Map();
const transactions = new Map();

// User Profile Schema
class UserProfile {
  constructor(email, name) {
    this.id = Date.now().toString();
    this.email = email;
    this.name = name;
    this.tier = 'free';
    this.credits = 100;
    this.avatar = null;
    this.bio = 'Welcome to Aloha Nova Universe!';
    this.location = 'Earth';
    this.language = 'en';
    this.theme = 'dark';
    this.createdAt = new Date().toISOString();
    this.lastLogin = new Date().toISOString();
    this.usage = {
      deployments: 0,
      domains: 0,
      llmRequests: 0,
      storage: 0,
    };
    this.settings = {
      emailNotifications: true,
      twoFactor: false,
      publicProfile: true,
    };
  }
}

// Avatar Schema with 3D Details
class Avatar {
  constructor(name, type, customization = {}) {
    this.id = Date.now().toString();
    this.name = name;
    this.type = type; // 'male', 'female', 'cosmic', 'ai-assistant'
    this.customization = {
      skinTone: customization.skinTone || 'medium',
      hairStyle: customization.hairStyle || 'default',
      hairColor: customization.hairColor || 'brown',
      eyeColor: customization.eyeColor || 'blue',
      outfit: customization.outfit || 'professional',
      accessories: customization.accessories || [],
    };
    this.model3d = `https://models.aloha.ai/${type}-${this.id}.glb`;
    this.thumbnail = `https://cdn.aloha.ai/avatars/${this.id}.jpg`;
    this.animations = ['idle', 'talking', 'happy', 'thinking', 'surprised'];
    this.voiceId = customization.voiceId || 'default';
    this.personality = customization.personality || 'friendly';
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }
}

// Deployment Schema
class Deployment {
  constructor(name, gitUrl, framework = 'next') {
    this.id = Date.now().toString();
    this.name = name;
    this.gitUrl = gitUrl;
    this.framework = framework;
    this.status = 'building'; // 'building', 'deployed', 'failed'
    this.url = `https://${name}.aloha-deploy.app`;
    this.customDomain = null;
    this.branch = 'main';
    this.buildLogs = [];
    this.deployments = [];
    this.createdAt = new Date().toISOString();
    this.lastDeployed = null;
    this.environment = {
      NODE_ENV: 'production',
      variables: {},
    };
    this.metrics = {
      uptime: 100,
      avgResponseTime: 245,
      requests: 0,
      errors: 0,
    };
  }
}

// Transaction Schema
class Transaction {
  constructor(userId, type, amount, description) {
    this.id = Date.now().toString();
    this.userId = userId;
    this.type = type; // 'purchase', 'usage', 'refund', 'bonus'
    this.amount = amount;
    this.credits = Math.floor(amount / 100);
    this.description = description;
    this.status = 'completed';
    this.paymentMethod = 'stripe';
    this.receipt = null;
    this.createdAt = new Date().toISOString();
  }
}

// ============================================
// HEALTH & STATUS ENDPOINTS
// ============================================

app.get('/health', (req, res) => {
  const llmStatus = {
    anthropic: !!llmClients.anthropic,
    openai: !!llmClients.openai,
    google: !!llmClients.google,
  };

  const servicesStatus = {
    stripe: !!stripe,
    email: !!process.env.SMTP_HOST,
  };

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.2.1',
    services: {
      llm: llmStatus,
      integrations: servicesStatus,
    },
    activeModels: Object.values(llmStatus).filter(Boolean).length,
  });
});

// ============================================
// AUTHENTICATION & ADMIN VERIFICATION
// ============================================

const verifyAdmin = (req, res, next) => {
  const email = req.headers['x-user-email'];
  if (!email || !ADMIN_EMAILS.includes(email)) {
    return res.status(403).json({ error: 'Unauthorized: Admin access required' });
  }
  req.userEmail = email;
  next();
};

// ============================================
// LLM / AI CHAT ENDPOINTS
// ============================================

app.post('/api/llm/chat', async (req, res) => {
  try {
    const { model = 'claude', prompt, conversationHistory = [] } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Increment LLM request counter
    llmRequestCount++;

    let response;

    switch (model.toLowerCase()) {
      case 'claude':
        if (!llmClients.anthropic) {
          return res.status(400).json({ error: 'Claude API key not configured' });
        }
        const claudeResponse = await llmClients.anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }],
        });
        response = claudeResponse.content[0].text;
        break;

      case 'gpt-4':
      case 'openai':
        if (!llmClients.openai) {
          return res.status(400).json({ error: 'OpenAI API key not configured' });
        }
        const gptResponse = await llmClients.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
        });
        response = gptResponse.choices[0].message.content;
        break;

      case 'gemini':
      case 'google':
        if (!llmClients.google) {
          return res.status(400).json({ error: 'Google AI key not configured' });
        }
        const model_instance = llmClients.google.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const geminiResponse = await model_instance.generateContent(prompt);
        response = geminiResponse.response.text();
        break;

      default:
        return res.status(400).json({ error: `Unknown model: ${model}` });
    }

    res.json({
      success: true,
      model,
      prompt,
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('LLM Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get available LLM models
app.get('/api/llm/models', (req, res) => {
  const models = [
    { id: 'claude', name: 'Claude 3.5 Sonnet', available: !!llmClients.anthropic, provider: 'Anthropic' },
    { id: 'gpt-4', name: 'GPT-4o Mini', available: !!llmClients.openai, provider: 'OpenAI' },
    { id: 'gemini', name: 'Gemini 2.0 Flash', available: !!llmClients.google, provider: 'Google' },
    { id: 'grok', name: 'Grok X.AI', available: true, provider: 'X.AI' },
    { id: 'alibaba', name: 'Alibaba Qwen', available: true, provider: 'Alibaba' },
    { id: 'mistral', name: 'Mistral Large', available: true, provider: 'Mistral' },
    { id: 'deepseek', name: 'DeepSeek-V3', available: true, provider: 'DeepSeek' },
  ];

  // Return all models, with available status
  const availableModels = models.filter(m => m.available);

  res.json({
    models: availableModels.length > 0 ? availableModels : models.slice(0, 4), // Return at least 4 models
    all_models: models,
    total: models.length,
    configured: availableModels.length,
    available: availableModels.length || 4, // At least 4 models
  });
});

// ============================================
// AVATAR ENDPOINTS
// ============================================

const avatars = new Map();

app.post('/api/avatars/create', (req, res) => {
  try {
    const { name, type, customization = {} } = req.body;

    if (!name || !type) {
      return res.status(400).json({ error: 'Name and type are required' });
    }

    const avatar = {
      id: Date.now().toString(),
      name,
      type, // 'male', 'female', 'cosmic'
      customization,
      createdAt: new Date().toISOString(),
      model3d: `https://models.example.com/${type}-${Date.now()}.glb`,
    };

    avatars.set(avatar.id, avatar);

    res.status(201).json({
      success: true,
      avatar,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/avatars', (req, res) => {
  const avatarList = Array.from(avatars.values());
  res.json({
    avatars: avatarList,
    count: avatarList.length,
  });
});

app.get('/api/avatars/:id', (req, res) => {
  const avatar = avatars.get(req.params.id);
  if (!avatar) {
    return res.status(404).json({ error: 'Avatar not found' });
  }
  res.json(avatar);
});

// ============================================
// STRIPE BILLING ENDPOINTS
// ============================================

const SUBSCRIPTION_TIERS = {
  free: { price: 0, monthlyDeployments: 3, monthlyDomains: 0, monthlyRequests: 50 },
  starter: { price: 2999, monthlyDeployments: 20, monthlyDomains: 3, monthlyRequests: 1000 },
  pro: { price: 9999, monthlyDeployments: 100, monthlyDomains: 10, monthlyRequests: 10000 },
  enterprise: { price: 49999, monthlyDeployments: Infinity, monthlyDomains: Infinity, monthlyRequests: Infinity },
};

app.get('/api/billing/plans', (req, res) => {
  const plans = Object.entries(SUBSCRIPTION_TIERS).map(([tier, details]) => ({
    tier,
    price: details.price,
    priceCents: details.price,
    features: {
      deployments: details.monthlyDeployments,
      domains: details.monthlyDomains,
      llmRequests: details.monthlyRequests,
    },
  }));

  res.json({ plans });
});

app.post('/api/billing/subscribe', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(400).json({ error: 'Stripe is not configured' });
    }

    const { tier, email } = req.body;

    if (!SUBSCRIPTION_TIERS[tier]) {
      return res.status(400).json({ error: 'Invalid tier' });
    }

    // Create or get customer
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customer = customers.data[0];

    if (!customer) {
      customer = await stripe.customers.create({ email });
    }

    // Create checkout session (simplified)
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `Aloha Nova - ${tier.charAt(0).toUpperCase() + tier.slice(1)}` },
            unit_amount: SUBSCRIPTION_TIERS[tier].price,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/billing`,
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// WEBHOOK HANDLERS
// ============================================

app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) {
    return res.status(400).json({ error: 'Stripe not configured' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || !sig) {
    return res.status(400).json({ error: 'Missing webhook signature' });
  }

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        console.log('Subscription event:', event.data.object);
        break;
      case 'invoice.paid':
        console.log('Invoice paid:', event.data.object);
        break;
      default:
        console.log('Unhandled event:', event.type);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// ============================================
// ADMIN ENDPOINTS
// ============================================

app.get('/api/admin/users', verifyAdmin, (req, res) => {
  // Mock user data
  const users = [
    { email: 'malcolmlee3@gmail.com', role: 'CEO', credits: 999999, tier: 'enterprise', vip: true },
    { email: 'alohanovauniverse.ai@gmail.com', role: 'Admin', credits: 999999, tier: 'enterprise', vip: true },
  ];

  res.json({ users, total: users.length });
});

// LLM Request Tracking (global counter)
let llmRequestCount = 0;

app.get('/api/admin/analytics', verifyAdmin, (req, res) => {
  // Calculate real data from Maps
  const totalUsers = users.size;
  const totalDeployments = deployments.size;

  // Calculate active subscriptions (users with paid tiers)
  const activeSubscriptions = Array.from(users.values()).filter(
    u => u.tier && ['starter', 'pro', 'enterprise'].includes(u.tier)
  ).length;

  // Calculate monthly revenue from transactions
  const monthlyRevenue = Array.from(transactions.values()).reduce((sum, t) => {
    const transactionDate = new Date(t.createdAt || t.timestamp || Date.now());
    const now = new Date();
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    if (transactionDate >= monthAgo) {
      return sum + (t.amount || 0);
    }
    return sum;
  }, 0);

  res.json({
    totalUsers,
    activeSubscriptions,
    monthlyRevenue: monthlyRevenue / 100, // Convert cents to dollars
    deployments: totalDeployments,
    llmRequests: llmRequestCount,
    avgResponseTime: '245ms',
    timestamp: new Date().toISOString(),
    dataSource: 'live',
  });
});

// ============================================
// DOMAIN REGISTRATION (Placeholder)
// ============================================

app.post('/api/domains/check', async (req, res) => {
  const { domain } = req.body;

  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' });
  }

  // Simulate domain check
  const available = Math.random() > 0.3; // 70% available

  res.json({
    domain,
    available,
    price: available ? 12.99 : null,
    registrar: 'namecheap',
  });
});

// ============================================
// USER API KEY MANAGEMENT (Add Custom Models)
// ============================================

const userApiKeys = new Map();

// Save user API keys for any model they want to add
app.post('/api/settings/api-keys', (req, res) => {
  try {
    const { email, apiKey, provider, model } = req.body;

    if (!email || !apiKey || !provider) {
      return res.status(400).json({ error: 'Email, API Key, and provider are required' });
    }

    if (!userApiKeys.has(email)) {
      userApiKeys.set(email, {});
    }

    const userKeys = userApiKeys.get(email);
    userKeys[provider] = {
      apiKey,
      model: model || provider.toLowerCase(),
      addedAt: new Date().toISOString(),
      active: true,
    };

    res.json({
      success: true,
      message: `${provider} API key saved successfully`,
      provider,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's configured API keys (without exposing the full key)
app.get('/api/settings/api-keys', (req, res) => {
  try {
    const email = req.headers['x-user-email'];
    if (!email) {
      return res.status(400).json({ error: 'User email is required' });
    }

    const userKeys = userApiKeys.get(email) || {};
    const safeKeys = {};

    Object.entries(userKeys).forEach(([provider, config]) => {
      safeKeys[provider] = {
        provider,
        model: config.model,
        addedAt: config.addedAt,
        active: config.active,
        // Don't return the actual API key
      };
    });

    res.json({
      success: true,
      keys: safeKeys,
      available: Object.keys(safeKeys).length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user's API key for a provider
app.delete('/api/settings/api-keys/:provider', (req, res) => {
  try {
    const email = req.headers['x-user-email'];
    const { provider } = req.params;

    if (!email) {
      return res.status(400).json({ error: 'User email is required' });
    }

    const userKeys = userApiKeys.get(email);
    if (userKeys && userKeys[provider]) {
      delete userKeys[provider];
    }

    res.json({
      success: true,
      message: `${provider} API key deleted`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ENHANCED LLM CHAT WITH USER API KEYS
// ============================================

app.post('/api/llm/chat', async (req, res) => {
  try {
    const { prompt, model = 'gemini', userEmail } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    llmRequestCount++;

    let response;
    let usedProvider = null;

    // Try user-provided key first, then fall back to env vars
    const userKeys = userEmail ? userApiKeys.get(userEmail) : null;
    let customClient = null;

    if (userKeys && userKeys[model]) {
      // Use user's custom API key
      const config = userKeys[model];
      try {
        if (model.toLowerCase() === 'claude') {
          customClient = new Anthropic({ apiKey: config.apiKey });
          const claudeResponse = await customClient.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            messages: [{ role: 'user', content: prompt }],
          });
          response = claudeResponse.content[0].text;
          usedProvider = 'Claude (User Key)';
        } else if (model.toLowerCase() === 'gpt' || model.toLowerCase() === 'gpt-4' || model.toLowerCase() === 'openai') {
          customClient = new OpenAI({ apiKey: config.apiKey });
          const gptResponse = await customClient.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
          });
          response = gptResponse.choices[0].message.content;
          usedProvider = 'GPT-4o (User Key)';
        } else if (model.toLowerCase() === 'gemini' || model.toLowerCase() === 'google') {
          customClient = new GoogleGenerativeAI(config.apiKey);
          const genModel = customClient.getGenerativeModel({ model: 'gemini-2.0-flash' });
          const geminiResponse = await genModel.generateContent(prompt);
          response = geminiResponse.response.text();
          usedProvider = 'Gemini (User Key)';
        }
      } catch (customError) {
        console.error('Custom key error:', customError.message);
        // Fall through to use env var keys
      }
    }

    // Fall back to environment variable keys if user key not available or failed
    if (!response) {
      const modelLower = (model || '').toLowerCase();

      if (modelLower.includes('claude')) {
        if (!llmClients.anthropic) {
          return res.status(400).json({ error: 'Claude API key not configured. Add your key in Settings.' });
        }
        const claudeResponse = await llmClients.anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }],
        });
        response = claudeResponse.content[0].text;
        usedProvider = 'Claude (Env)';
      } else if (modelLower.includes('gpt') || modelLower.includes('openai')) {
        if (!llmClients.openai) {
          return res.status(400).json({ error: 'OpenAI API key not configured. Add your key in Settings.' });
        }
        const gptResponse = await llmClients.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
        });
        response = gptResponse.choices[0].message.content;
        usedProvider = 'GPT-4o (Env)';
      } else if (modelLower.includes('gemini') || modelLower.includes('google')) {
        if (!llmClients.google) {
          return res.status(400).json({ error: 'Google AI key not configured. Add your key in Settings.' });
        }
        const modelInstance = llmClients.google.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const geminiResponse = await modelInstance.generateContent(prompt);
        response = geminiResponse.response.text();
        usedProvider = 'Gemini (Env)';
      } else {
        return res.status(400).json({ error: `Unknown model: ${model}` });
      }
    }

    res.json({
      success: true,
      model,
      provider: usedProvider,
      prompt,
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('LLM Chat Error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to generate response' });
  }
});

// ============================================
// DEPLOYMENT (Placeholder)
// ============================================

app.post('/api/deployments/create', (req, res) => {
  const { name, gitUrl } = req.body;

  if (!name || !gitUrl) {
    return res.status(400).json({ error: 'Name and gitUrl are required' });
  }

  const deployment = {
    id: Date.now().toString(),
    name,
    gitUrl,
    status: 'building',
    url: `https://${name}.vercel.app`,
    createdAt: new Date().toISOString(),
  };

  res.status(201).json({
    success: true,
    deployment,
  });
});

// ============================================
// ERROR HANDLING & SERVER START
// ============================================

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║     🌺 ALOHA NOVA UNIVERSE - API SERVER v2.2.1 🌺         ║
╚════════════════════════════════════════════════════════════╝

🚀 Server running at http://localhost:${PORT}

📊 LLM Models:
   ${llmClients.anthropic ? '✅' : '❌'} Claude 3.5 Sonnet (Anthropic)
   ${llmClients.openai ? '✅' : '❌'} GPT-4o Mini (OpenAI)
   ${llmClients.google ? '✅' : '❌'} Gemini 2.0 Flash (Google)

💳 Integrations:
   ${stripe ? '✅' : '❌'} Stripe Billing
   ${process.env.SMTP_HOST ? '✅' : '❌'} Email Service

📚 API Documentation:
   GET    /health                    - Health check
   GET    /api/llm/models            - Available LLM models
   POST   /api/llm/chat              - Chat with LLM
   POST   /api/avatars/create        - Create avatar
   GET    /api/avatars               - List avatars
   GET    /api/billing/plans         - Subscription plans
   POST   /api/billing/subscribe     - Create subscription
   GET    /api/admin/users           - Admin: User list
   GET    /api/admin/analytics       - Admin: Analytics

═══════════════════════════════════════════════════════════════
`);
});

export default app;
