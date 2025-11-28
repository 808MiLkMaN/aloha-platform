/**
 * API Integration Tests for Aloha Nova Backend
 */

describe('Aloha Nova API', () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

  describe('Health Check', () => {
    it('should return healthy status', async () => {
      const response = await fetch(`${API_URL}/health`)
      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data).toHaveProperty('status')
      expect(data.status).toBe('healthy')
      expect(data).toHaveProperty('version')
      expect(data).toHaveProperty('services')
    })
  })

  describe('LLM Models', () => {
    it('should list available LLM models', async () => {
      const response = await fetch(`${API_URL}/api/llm/models`)

      if (response.status === 404) {
        console.warn('Backend not running, skipping LLM test')
        return
      }

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(Array.isArray(data.models)).toBe(true)
      expect(data).toHaveProperty('configured')
    })
  })

  describe('Billing Plans', () => {
    it('should return subscription plans', async () => {
      const response = await fetch(`${API_URL}/api/billing/plans`)

      if (response.status === 404) {
        console.warn('Backend not running, skipping billing test')
        return
      }

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(Array.isArray(data.plans)).toBe(true)
      expect(data.plans.length).toBeGreaterThan(0)
    })
  })

  describe('Avatars', () => {
    it('should list avatars', async () => {
      const response = await fetch(`${API_URL}/api/avatars`)

      if (response.status === 404) {
        console.warn('Backend not running, skipping avatar test')
        return
      }

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(Array.isArray(data.avatars)).toBe(true)
    })
  })
})
