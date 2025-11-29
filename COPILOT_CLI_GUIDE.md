# GitHub Copilot CLI - Quick Start Guide

**Aloha Nova Universe Project**

This guide explains how to use GitHub Copilot CLI to accelerate development on the Aloha Nova Universe project.

## Prerequisites

### Installation
1. **Install GitHub Copilot CLI**:
   ```bash
   # Requires GitHub Copilot Pro, Pro+, Business, or Enterprise plan
   npm install -g @github/copilot
   ```

2. **Verify Installation**:
   ```bash
   copilot --version
   copilot help
   ```

3. **Authenticate with GitHub**:
   ```bash
   copilot
   # Follow prompts to login to GitHub
   # Or use: /login command in interactive mode
   ```

## Getting Started

### Start Interactive Session
```bash
# Navigate to project directory
cd "C:\Users\Ekolu\aloha-platform"

# Start Copilot CLI
copilot
```

You'll be asked to trust the directory. Choose:
- **"Yes, proceed"** - Trust for this session only
- **"Yes, and remember"** - Trust for future sessions (recommended)
- **"No, exit (Esc)"** - Cancel

### Exit Session
```bash
# Type one of:
exit
quit
/exit
# Or press Ctrl+C
```

## Common Tasks with Copilot CLI

### 1. Create a New Component
```
copilot create a new React component for user avatar selection with TypeScript
```

**What Copilot will do:**
- Generate `.tsx` file with proper types
- Include prop interface
- Add JSDoc comments
- Ensure Tailwind CSS styling
- Test in development

### 2. Fix TypeScript Error
```
copilot fix TypeScript error in @src/app/login/page.tsx
```

**What Copilot will do:**
- Read the file
- Identify type errors
- Propose fixes
- Apply corrections
- Verify compilation

### 3. Create API Endpoint
```
copilot create a POST endpoint for avatar creation in @backend/src/routes/avatars.ts
```

**What Copilot will do:**
- Generate Express route handler
- Add proper TypeScript types
- Include error handling
- Add validation
- Test with curl examples

### 4. Debug Issue
```
copilot debug the SSR error in @src/components/EnhancedAuthGateway.tsx
```

**What Copilot will do:**
- Analyze the code
- Identify SSR boundary violations
- Suggest fixes
- Apply corrections
- Verify fix works

### 5. Optimize Performance
```
copilot optimize the performance of @src/app/dashboard/page.tsx
```

**What Copilot will do:**
- Analyze component structure
- Suggest React.memo usage
- Recommend code splitting
- Optimize re-renders
- Measure improvements

### 6. Add Feature
```
copilot add dark mode theme switching to the authentication UI
```

**What Copilot will do:**
- Create theme provider/context
- Add toggle UI component
- Implement localStorage persistence
- Update styling configuration
- Test theme switching

## Using Copilot with Slash Commands

### File Reference - Use `@` to add context
```
copilot create a new form component for avatar customization based on @src/components/EnhancedAuthGateway.tsx
```

This adds the file's contents to the prompt context.

### Change Working Directory
```
/cwd /path/to/backend
copilot check backend TypeScript configuration
```

### Add Trusted Directory
```
/add-dir /path/to/safe/directory
```

### Resume Previous Session
```
copilot --resume
# Or continue last session:
copilot --continue
```

### Delegate to Copilot Coding Agent
```
/delegate implement the complete LLM integration with all three providers
```

This hands off to GitHub's Copilot Coding Agent for larger tasks.

### View Usage Statistics
```
/usage
```

Shows token usage, time spent, lines edited.

### Get Help
```
?
# Or:
copilot help
```

## Custom Agents for Your Project

Your project has specialized agents:

### Frontend Agent
```
copilot --agent=frontend-agent create a new page for avatar gallery
```

**Specializes in:**
- React/Next.js components
- TypeScript with strict mode
- Tailwind CSS styling
- Performance optimization
- SEO metadata

### Backend Agent
```
copilot --agent=backend-agent create API endpoints for avatar management
```

**Specializes in:**
- Express.js routes
- Multi-provider LLM integration
- JWT authentication
- API design
- Error handling

### Debug Agent
```
copilot --agent=debug-agent diagnose the Invalid Host header error
```

**Specializes in:**
- Error troubleshooting
- Debugging techniques
- Build issue resolution
- Performance analysis
- Root cause analysis

## Advanced Features

### MCP Servers - Extend Copilot's Capabilities
The GitHub MCP server is pre-configured. Use it to:
- Query GitHub issues/PRs
- Check workflow status
- Merge pull requests
- View deployments

**Add Custom MCP Server:**
```
/mcp add
# Fill in server details
# Ctrl+S to save
```

### Custom Instructions - Guide Copilot's Behavior
Project-wide instructions are in `.github/copilot-instructions.md`

These are automatically included in all prompts!

To view:
```
copilot cat .github/copilot-instructions.md
```

### Approve Tool Usage
When Copilot wants to modify files, it asks for approval:

```
📋 Approve running: npm run build

1. Yes
2. Yes, and approve 'npm' for rest of session
3. No, and tell Copilot what to do (Esc)
```

**Recommended:**
- Use "Yes" for file modifications
- Use "Yes, and approve..." for tools you trust (npm, node)
- Use "No" if you want different approach

## Copilot CLI Prompts - Examples

### Simple Questions
```
What's the difference between useState and useReducer?
Explain JWT token refresh flow
How do I implement error boundaries in React?
```

### Code Generation
```
Generate a custom React hook for managing form state with TypeScript
Create a Next.js API route for handling file uploads
Write a utility function to validate email addresses
```

### Code Analysis
```
Explain what this component does: @src/components/EnhancedAuthGateway.tsx
What are potential performance issues in @src/app/dashboard/page.tsx?
Analyze this API endpoint for security issues: @backend/src/routes/auth.ts
```

### Troubleshooting
```
Fix this TypeScript error: @src/app/page.tsx
The build fails with this error: [paste error message]
Debug why authentication isn't working on the deployed version
```

### Optimization
```
Optimize the bundle size of the frontend
Improve database query performance in the backend
Reduce re-renders in the avatar list component
```

## Best Practices

### 1. Provide Context
```
# ❌ VAGUE
create a button component

# ✅ GOOD
create a button component with loading state, disabled state, and Tailwind CSS styling based on @src/components/EnhancedAuthGateway.tsx design patterns
```

### 2. Be Specific
```
# ❌ VAGUE
fix the error

# ✅ GOOD
fix the TypeScript error "'email' does not exist on type 'AuthState'" in @src/components/EnhancedAuthGateway.tsx
```

### 3. Use File References
```
# Include relevant files with @
copilot implement JWT refresh token logic in @backend/src/lib/token-manager.ts following @backend/src/routes/auth.ts patterns
```

### 4. Break Down Large Tasks
```
# ❌ TOO LARGE
build the entire authentication system

# ✅ BETTER - Ask in steps:
# First: create login form UI
# Second: implement backend login endpoint
# Third: integrate frontend with backend
# Fourth: test authentication flow
```

### 5. Leverage Agents for Specialization
```
# For UI work:
copilot --agent=frontend-agent add dark mode toggle to the navigation bar

# For API work:
copilot --agent=backend-agent create the webhook handler for Stripe payments

# For debugging:
copilot --agent=debug-agent analyze why the build is failing
```

## Tips & Tricks

### Run Shell Commands Directly
Prepend with `!` to run shell commands:
```
!npm run build
!git status
!cd backend && npm install
```

### Stop Long Operations
Press `Esc` to stop Copilot while it's thinking.

### Resume Sessions
Return to previous conversations:
```
copilot --continue      # Continue last session
copilot --resume        # Choose from recent sessions
```

### Clear Session
Exit and restart to begin fresh:
```
exit
copilot
```

### View Logs
See what Copilot is doing:
```
copilot help logging
# Set log level (debug, verbose, info, warn, error)
COPILOT_LOG_LEVEL=debug copilot
```

## Real-World Workflow Example

### Scenario: Add Avatar Upload Feature

```bash
# 1. Start session
copilot

# 2. Create UI component
copilot --agent=frontend-agent create an image upload component with preview and drag-drop support

# 3. Wait for approval, review code, commit

# 4. Create backend endpoint
copilot --agent=backend-agent create a POST endpoint for avatar image uploads to @backend/src/routes/avatars.ts

# 5. Wait for approval, review code, commit

# 6. Connect frontend to backend
copilot integrate the upload component with the backend /api/avatars/upload endpoint

# 7. Fix any issues
copilot --agent=debug-agent debug the "413 Payload too large" error

# 8. Test locally
!npm run build
!npm run dev
# Manual testing in browser...

# 9. Delegate for final integration and testing
/delegate ensure all tests pass and deploy to production

# 10. Monitor GitHub PR
```

## Troubleshooting Copilot CLI

### "Not authenticated"
```bash
copilot /login
# Follow authentication flow
```

### "Command not found"
```bash
# Install/update Copilot CLI
npm install -g @github/copilot@latest
```

### "Directory not trusted"
```bash
# Choose "Yes, and remember this folder" when prompted
# Or manually add:
/add-dir /path/to/directory
```

### "Token limit reached"
```bash
# Check usage:
/usage

# Session token limit exceeded
# Solution: Exit session and start new one
exit
copilot
```

### "MCP server not responding"
```bash
# List configured servers:
/mcp list

# Test connection:
/mcp test server-name
```

## Pro Tips

1. **Use `@` for file context** - Makes Copilot suggestions more accurate
2. **Chain tasks logically** - Start with structure, then details
3. **Leverage agents** - Use right agent for right task
4. **Review generated code** - Always understand what Copilot creates
5. **Test incrementally** - Build and test after each step
6. **Ask for explanations** - "Explain what you generated and why"
7. **Request improvements** - "Make this more performant"
8. **Use delegation** - Hand off large tasks to Coding Agent

## Resources

- **Copilot CLI Docs**: https://docs.github.com/en/copilot/github-copilot-in-the-cli
- **Project Instructions**: `.github/copilot-instructions.md`
- **Custom Agents**: `.github/agents/`
- **GitHub Issues**: https://github.com/808MiLkMaN/aloha-platform/issues

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Stop current operation | Esc |
| Save in editor | Ctrl+S |
| View help | ? |
| Exit session | Ctrl+C or type `exit` |
| Navigate autocomplete | Arrow Keys |
| Select autocomplete | Tab |

---

**Quick Reference**: `copilot help`
**Usage Stats**: `/usage`
**Available Agents**: `/agent`
**MCP Servers**: `/mcp list`

---

**Last Updated**: 2025-11-29
**Version**: 1.0
**For**: GitHub Copilot Pro/Pro+/Business/Enterprise
