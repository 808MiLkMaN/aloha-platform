/**
 * Token Manager - JWT token handling and validation
 */

import jwt, { SignOptions } from 'jsonwebtoken';

export class TokenManager {
  private secret: string;
  private refreshSecret: string;

  constructor(secret?: string, refreshSecret?: string) {
    this.secret = secret || process.env.JWT_SECRET || 'dev-secret-key';
    this.refreshSecret = refreshSecret || process.env.SESSION_SECRET || 'refresh-secret-key';
  }

  generateToken(payload: any, expiresIn: string = '24h'): string {
    const options: SignOptions = { expiresIn: expiresIn as any };
    return jwt.sign(payload, this.secret, options);
  }

  generateRefreshToken(payload: any, expiresIn: string = '7d'): string {
    const options: SignOptions = { expiresIn: expiresIn as any };
    return jwt.sign(payload, this.refreshSecret, options);
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, this.refreshSecret);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  decodeToken(token: string): any {
    return jwt.decode(token);
  }

  refreshAccessToken(refreshToken: string): string {
    const decoded = this.verifyRefreshToken(refreshToken);
    return this.generateToken({
      email: decoded.email,
      id: decoded.id,
      role: decoded.role,
    });
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as any;
      if (!decoded || !decoded.exp) return true;
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  initializeTokens(email: string): any {
    const apiKey = `aloha_${Buffer.from(JSON.stringify({ email, iat: Date.now() / 1000 })).toString('base64')}`;
    const jwtToken = this.generateToken({ email });
    const refreshToken = this.generateRefreshToken({ email });

    return {
      email,
      apiKey,
      jwtToken,
      accessToken: jwtToken,
      refreshToken,
      tier: 'free',
      quotas: {
        apiRequests: null,
        deployments: null,
        avatars: null,
        videoHours: null,
      },
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      createdAt: new Date().toISOString(),
    };
  }

  storeTokens(tokenConfig: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-tokens', JSON.stringify(tokenConfig));
    }
  }

  getStoredTokens(): any {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('auth-tokens');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  }

  clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-tokens');
    }
  }

  validateAndRefresh(email: string, secret: string): any {
    try {
      return {
        email,
        tier: 'free',
        quotas: {
          apiRequests: null,
          deployments: null,
          avatars: null,
          videoHours: null,
        },
        accessToken: this.generateToken({ email }),
        refreshToken: this.generateRefreshToken({ email }),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error('Token validation failed');
    }
  }

  refreshJWTToken(email: string, secret: string): string {
    return this.generateToken({ email });
  }
}

export default new TokenManager();
