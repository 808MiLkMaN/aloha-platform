# Aloha Nova Universe - GitHub Copilot Instructions

## Project Overview
Aloha Nova Universe is a production-ready AI avatar platform with:
- **Frontend**: Next.js 16 with React 18.3.1, TypeScript, Tailwind CSS 4
- **Backend**: Express.js with Node.js 20 LTS
- **AI**: Multi-provider LLM integration (Claude, GPT-4o, Gemini 2.0)
- **Deployment**: Vercel + GitHub Actions CI/CD
- **Creator**: 808_KiNg_MiLkMaN (Malcolm Lee) - malcolmlee3@gmail.com

## Key Coding Standards

### TypeScript Strict Mode
- Always include proper type annotations
- Use `as const` for literal types
- Never use `any` type - use `unknown` and type guards
- Proper error handling with typed errors

**Example:**
```typescript
// ✅ GOOD
async function handleError(error: unknown): Promise<void> {
  if (error instanceof Error) {
    console.error(error.message);
  }
}

// ❌ BAD
async function handleError(error: any) {
  console.error(error.message);
}
```

### React & Next.js Patterns

#### SSR/Client Boundary
Always check `typeof window !== 'undefined'` before accessing browser APIs:

```typescript
// ✅ GOOD
useEffect(() => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('key', value);
  }
}, []);

// ❌ BAD - SSR will break
const value = localStorage.getItem('key'); // In component body
```

#### Component Structure
```typescript
'use client'; // Client component marker

import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface ComponentProps {
  children: ReactNode;
  disabled?: boolean;
}

export default function MyComponent({ children, disabled }: ComponentProps) {
  const [state, setState] = useState<string>('');

  useEffect(() => {
    // Side effects here
  }, []);

  return <div className="...">{children}</div>;
}
```

### API Design

#### Endpoint Patterns
- `GET /api/resource` - List/fetch resources
- `POST /api/resource` - Create resource
- `PUT /api/resource/:id` - Update resource
- `DELETE /api/resource/:id` - Delete resource

#### Response Format
```typescript
// ✅ GOOD
{
  "success": true,
  "data": { /* resource */ },
  "message": "Operation successful"
}

// Error
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Authentication

#### JWT Tokens
- Access token expiry: 24 hours
- Refresh token expiry: 7 days
- Store in localStorage (frontend), session (backend)
- Always validate on API endpoints

#### Admin Credentials (for testing)
- Email: `malcolmlee3@gmail.com`
- Password: `QueenSupernova2025!Lifetime`
- Admin users have unlimited access

### LLM Integration

#### Supported Providers
1. **Claude 3.5 Sonnet** (Anthropic) - Advanced reasoning
2. **GPT-4o Mini** (OpenAI) - Fast, efficient
3. **Gemini 2.0 Flash** (Google) - Multimodal
4. **Ollama** (Local fallback) - Self-hosted

#### Usage Pattern
```typescript
import llmService from '@/lib/llm-service';

// Generate response
const response = await llmService.generate('Your prompt');

// Stream response
for await (const chunk of llmService.generateStream('Your prompt')) {
  console.log(chunk);
}

// Check availability
const available = await llmService.isAvailable();
```

### File Organization

#### Frontend Structure
```
src/
├── app/               # Next.js app router pages
├── components/        # React components
├── lib/              # Utilities (LLM, tokens, etc.)
├── hooks/            # Custom React hooks
├── styles/           # Global styles
└── types/            # TypeScript type definitions
```

#### Backend Structure
```
backend/
├── src/
│   ├── routes/       # API endpoints
│   ├── middleware/   # Express middleware
│   ├── services/     # Business logic
│   └── types/        # Interfaces
└── .env              # Environment config
```

## Testing & Validation

### TypeScript Check
Always ensure TypeScript compiles without errors:
```bash
npx tsc --noEmit
```

### Linting
Code should pass ESLint:
```bash
npm run lint
npm run lint:fix
```

### Build Verification
Test the production build:
```bash
npm run build
npm run start
```

## Deployment

### GitHub Actions Workflow
- Triggers on push to `master` or `main`
- Runs TypeScript checks
- Runs ESLint
- Builds project
- Auto-deploys to Vercel

### Environment Variables
- **Frontend**: `NEXT_PUBLIC_*` prefix for client-side vars
- **Backend**: Unprefixed vars in `.env`
- **Required**:
  - `GOOGLE_AI_KEY` - Google Gemini API key
  - `ANTHROPIC_API_KEY` - Claude API key
  - `OPENAI_API_KEY` - GPT API key
  - `NEXT_PUBLIC_API_URL` - Backend URL

## Common Tasks

### Add New API Endpoint
1. Create route in `backend/src/routes/`
2. Add TypeScript interface for request/response
3. Implement authentication check (if needed)
4. Test with `curl` or API client
5. Commit and push to trigger deployment

### Create New React Component
1. Create `.tsx` file in `src/components/`
2. Use TypeScript for props interface
3. Include proper JSDoc comments
4. Ensure SSR-safe (check `typeof window`)
5. Test in development mode

### Debug Issue
1. Check `npm run build` output for errors
2. Review `npx tsc --noEmit` for type errors
3. Check browser DevTools Console
4. Check Backend logs: `cd backend && npm start`
5. Review GitHub Actions logs

## Troubleshooting Guide

### "Invalid Host header" Error
- Update `next.config.ts` with proper host handling
- Ensure `vercel.json` is configured
- Clear Vercel cache and redeploy

### TypeScript Errors
- Never use `any` - use proper types
- Use type guards for unknown types
- Check `tsconfig.json` strict mode

### React SSR Errors
- Wrap localStorage access in `typeof window` check
- Use `useEffect` for browser-only code
- Check server logs for render errors

### LLM API Failures
- Verify API keys are set in `.env`
- Check if provider is available with `isAvailable()`
- Review error message in backend logs
- Check API rate limits

## File Reference Guide

### Important Frontend Files
- `src/app/layout.tsx` - Root layout with SEO
- `src/app/login/page.tsx` - Authentication page
- `src/components/EnhancedAuthGateway.tsx` - Auth UI
- `src/lib/llm-service.ts` - LLM integration
- `src/lib/token-manager.ts` - JWT handling
- `next.config.ts` - Next.js configuration

### Important Backend Files
- `backend/src/index.ts` - Server entry point
- `backend/src/routes/auth.ts` - Auth endpoints
- `backend/src/services/llm-service.ts` - LLM logic
- `backend/.env` - Environment config

## Useful Commands

### Development
```bash
# Frontend dev server (port 3001)
npm run dev

# Backend dev server (port 5000)
cd backend && npm start

# Type check
npx tsc --noEmit

# Lint
npm run lint
npm run lint:fix
```

### Testing & Building
```bash
# Build for production
npm run build

# Start production server
npm run start

# Run tests (if configured)
npm test
```

### GitHub & Deployment
```bash
# View GitHub status
gh repo view 808MiLkMaN/aloha-platform

# Push changes (auto-deploys)
git push origin master

# Check deployment status
gh run list
```

## Custom Instructions for Copilot

### When Creating New Features
- Maintain TypeScript strict mode compliance
- Add proper error handling
- Include JSDoc comments
- Test SSR/Client boundaries
- Update tests if applicable

### When Fixing Bugs
- First: Identify root cause
- Second: Write minimal fix
- Third: Test in development
- Fourth: Ensure TypeScript passes
- Fifth: Commit with clear message

### When Optimizing Code
- Check browser DevTools performance
- Use React.memo for expensive components
- Optimize database queries
- Minify assets for production
- Review bundle size

## Security Considerations

### Sensitive Data
- Never commit `.env` files
- Never log passwords or tokens
- Use environment variables for secrets
- Always validate user input
- Sanitize output for XSS prevention

### API Security
- Implement JWT validation on protected routes
- Check user permissions before operations
- Use HTTPS for all communications
- Implement rate limiting for APIs
- Log security events

### Frontend Security
- Use Content Security Policy headers
- Prevent CSRF with token validation
- Sanitize user input before display
- Keep dependencies updated
- Regular security audits

## Questions or Issues?

### Resources
- **GitHub**: https://github.com/808MiLkMaN/aloha-platform
- **Documentation**: See README.md and DEPLOYMENT.md
- **Creator**: Malcolm Lee (808_KiNg_MiLkMaN)
- **Email**: malcolmlee3@gmail.com

### Getting Help with Copilot
- Use `@filename.ts` to add file context
- Ask specific questions about implementation
- Request refactoring with specific goals
- Ask for debugging help with error messages
- Request code reviews before commits

---

**Last Updated**: 2025-11-29
**Version**: 1.0
