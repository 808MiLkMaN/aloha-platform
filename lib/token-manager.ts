/**
 * Token Manager for Aloha Platform
 * Handles API tokens, JWT tokens, and session tokens
 * Auto-refresh and persistent storage
 */

import crypto from 'crypto';

export interface TokenConfig {
  email: string;
  apiKey: string;
  jwtToken: string;
  refreshToken: string;
  expiresAt: number;
  tier: 'LIFETIME_ENTERPRISE' | 'PRO' | 'STARTER';
  quotas: {
    apiRequests: number;
    deployments: number;
    avatars: number;
  };
}

export class TokenManager {
  private static STORAGE_KEY = 'aloha_tokens';

  /**
   * Generate new API token for user
   */
  static generateAPIToken(email: string, tier: string = 'LIFETIME_ENTERPRISE'): string {
    const payload = {
      email,
      tier,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60), // 1 year
    };

    const tokenString = JSON.stringify(payload);
    const hash = crypto.createHash('sha256').update(tokenString).digest('hex');
    const encoded = Buffer.from(tokenString).toString('base64');
    return `aloha_${encoded}_${hash}`;
  }

  /**
   * Generate JWT token with expiration
   */
  static generateJWT(email: string, secret: string): string {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
    const payload = Buffer.from(
      JSON.stringify({
        email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
      })
    ).toString('base64');

    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${header}.${payload}`)
      .digest('base64');

    return `${header}.${payload}.${signature}`;
  }

  /**
   * Create refresh token for persistent sessions
   */
  static generateRefreshToken(email: string): string {
    return `refresh_${email}_${crypto.randomBytes(32).toString('hex')}`;
  }

  /**
   * Initialize tokens for user (Malcolm Lee special case)
   */
  static initializeTokens(email: string): TokenConfig {
    const isAdmin = email === 'malcolmlee3@gmail.com';

    return {
      email,
      apiKey: this.generateAPIToken(email, isAdmin ? 'LIFETIME_ENTERPRISE' : 'STARTER'),
      jwtToken: this.generateJWT(email, process.env.NEXTAUTH_SECRET || 'dev-secret'),
      refreshToken: this.generateRefreshToken(email),
      expiresAt: Date.now() + (365 * 24 * 60 * 60 * 1000), // 1 year
      tier: isAdmin ? 'LIFETIME_ENTERPRISE' : 'STARTER',
      quotas: isAdmin
        ? { apiRequests: Infinity, deployments: Infinity, avatars: Infinity }
        : { apiRequests: 1000, deployments: 10, avatars: 5 },
    };
  }

  /**
   * Refresh JWT token when near expiration
   */
  static refreshJWTToken(email: string, secret: string): string {
    return this.generateJWT(email, secret);
  }

  /**
   * Store tokens in memory/localStorage
   */
  static storeTokens(config: TokenConfig): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
    } else {
      process.env.ALOHA_TOKENS = JSON.stringify(config);
    }
  }

  /**
   * Retrieve stored tokens
   */
  static getTokens(email: string): TokenConfig | null {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const config = JSON.parse(stored);
          if (config.email === email) {
            return config;
          }
        }
      } else if (process.env.ALOHA_TOKENS) {
        const config = JSON.parse(process.env.ALOHA_TOKENS);
        if (config.email === email) {
          return config;
        }
      }
    } catch (error) {
      console.error('Error retrieving tokens:', error);
    }
    return null;
  }

  /**
   * Validate and auto-refresh tokens if needed
   */
  static async validateAndRefresh(email: string, secret: string): Promise<TokenConfig> {
    let config = this.getTokens(email);

    if (!config) {
      config = this.initializeTokens(email);
      this.storeTokens(config);
      return config;
    }

    // Check if JWT needs refresh (< 1 hour remaining)
    if (Date.now() > config.expiresAt - 3600000) {
      config.jwtToken = this.refreshJWTToken(email, secret);
      config.expiresAt = Date.now() + (24 * 60 * 60 * 1000);
      this.storeTokens(config);
    }

    return config;
  }

  /**
   * Clear tokens for logout
   */
  static clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    } else {
      delete process.env.ALOHA_TOKENS;
    }
  }

  /**
   * Get quota info for user
   */
  static getQuotas(email: string): TokenConfig['quotas'] | null {
    const config = this.getTokens(email);
    return config?.quotas || null;
  }
}

export default TokenManager;
