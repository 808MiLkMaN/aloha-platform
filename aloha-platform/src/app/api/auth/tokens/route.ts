/**
 * Token Management API Route
 * Handles token generation, validation, and refresh
 */

import { NextRequest, NextResponse } from 'next/server';
import TokenManager from '@/lib/token-manager';

/**
 * POST /api/auth/tokens/generate
 * Generate new tokens for user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const tokenConfig = TokenManager.initializeTokens(email);
    TokenManager.storeTokens(tokenConfig);

    return NextResponse.json({
      success: true,
      data: {
        email: tokenConfig.email,
        apiKey: tokenConfig.apiKey,
        jwtToken: tokenConfig.jwtToken,
        refreshToken: tokenConfig.refreshToken,
        tier: tokenConfig.tier,
        expiresAt: tokenConfig.expiresAt,
        quotas: tokenConfig.quotas,
      },
    });
  } catch (error) {
    console.error('Token generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate tokens' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/tokens/validate
 * Validate existing tokens
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const tokenConfig = await TokenManager.validateAndRefresh(
      email,
      process.env.NEXTAUTH_SECRET || 'dev-secret'
    );

    return NextResponse.json({
      success: true,
      data: {
        email: tokenConfig.email,
        tier: tokenConfig.tier,
        quotas: tokenConfig.quotas,
        expiresAt: tokenConfig.expiresAt,
      },
    });
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate tokens' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/auth/tokens/refresh
 * Refresh JWT token
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, refreshToken } = body;

    if (!email || !refreshToken) {
      return NextResponse.json(
        { error: 'Email and refresh token required' },
        { status: 400 }
      );
    }

    const tokenConfig = TokenManager.initializeTokens(email);
    const newJWT = TokenManager.refreshJWTToken(
      email,
      process.env.NEXTAUTH_SECRET || 'dev-secret'
    );

    tokenConfig.jwtToken = newJWT;
    TokenManager.storeTokens(tokenConfig);

    return NextResponse.json({
      success: true,
      data: {
        jwtToken: newJWT,
        expiresAt: tokenConfig.expiresAt,
      },
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/auth/tokens/revoke
 * Revoke tokens
 */
export async function DELETE(request: NextRequest) {
  try {
    TokenManager.clearTokens();

    return NextResponse.json({
      success: true,
      message: 'Tokens revoked successfully',
    });
  } catch (error) {
    console.error('Token revocation error:', error);
    return NextResponse.json(
      { error: 'Failed to revoke tokens' },
      { status: 500 }
    );
  }
}
