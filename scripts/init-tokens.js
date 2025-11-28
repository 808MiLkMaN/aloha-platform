#!/usr/bin/env node

/**
 * Token Initialization Script
 * Generates and stores tokens for admin user (malcolm@gmail.com)
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ADMIN_EMAIL = 'malcolmlee3@gmail.com';
const TOKENS_FILE = path.join(__dirname, '../.admin-tokens.json');

class TokenGenerator {
  static generateAPIToken(email, tier = 'LIFETIME_ENTERPRISE') {
    const payload = {
      email,
      tier,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60),
    };

    const tokenString = JSON.stringify(payload);
    const hash = crypto.createHash('sha256').update(tokenString).digest('hex');
    const encoded = Buffer.from(tokenString).toString('base64');
    return `aloha_${encoded}_${hash}`;
  }

  static generateJWT(email, secret) {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
    const payload = Buffer.from(
      JSON.stringify({
        email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
      })
    ).toString('base64');

    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${header}.${payload}`)
      .digest('base64');

    return `${header}.${payload}.${signature}`;
  }

  static generateRefreshToken(email) {
    return `refresh_${email}_${crypto.randomBytes(32).toString('hex')}`;
  }

  static initializeTokens(email) {
    const secret = process.env.NEXTAUTH_SECRET || 'dev-secret-' + crypto.randomBytes(16).toString('hex');

    return {
      email,
      apiKey: this.generateAPIToken(email, 'LIFETIME_ENTERPRISE'),
      jwtToken: this.generateJWT(email, secret),
      refreshToken: this.generateRefreshToken(email),
      secret,
      expiresAt: Date.now() + (365 * 24 * 60 * 60 * 1000),
      tier: 'LIFETIME_ENTERPRISE',
      quotas: {
        apiRequests: Infinity,
        deployments: Infinity,
        avatars: Infinity,
        videoHours: Infinity,
      },
      createdAt: new Date().toISOString(),
    };
  }
}

console.log('\n🌺 Aloha Platform - Token Initialization\n');
console.log(`Email: ${ADMIN_EMAIL}`);
console.log(`Tier: LIFETIME_ENTERPRISE`);
console.log(`Status: Generating tokens...\n`);

try {
  const tokens = TokenGenerator.initializeTokens(ADMIN_EMAIL);

  // Save to file
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2), { mode: 0o600 });

  console.log('✅ Tokens generated successfully!\n');
  console.log('📋 Token Summary:');
  console.log(`   Email: ${tokens.email}`);
  console.log(`   Tier: ${tokens.tier}`);
  console.log(`   API Key: ${tokens.apiKey.substring(0, 20)}...`);
  console.log(`   JWT Token: ${tokens.jwtToken.substring(0, 20)}...`);
  console.log(`   Refresh Token: ${tokens.refreshToken.substring(0, 20)}...`);
  console.log(`   Expires: ${new Date(tokens.expiresAt).toISOString()}`);
  console.log(`\n📁 Saved to: ${TOKENS_FILE}`);
  console.log(`🔐 File permissions: 600 (owner read/write only)\n`);

  // Also output environment variable
  console.log('📝 Add to .env:');
  console.log(`ADMIN_API_KEY=${tokens.apiKey}`);
  console.log(`ADMIN_JWT=${tokens.jwtToken}`);
  console.log(`NEXTAUTH_SECRET=${tokens.secret}\n`);

  console.log('✨ Token setup complete!\n');
  process.exit(0);
} catch (error) {
  console.error('❌ Error generating tokens:', error);
  process.exit(1);
}
