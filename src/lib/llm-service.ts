/**
 * LLM Service - Multi-provider LLM integration
 */

import { Anthropic } from '@anthropic-ai/sdk';
import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface LLMResponse {
  content: string;
  model: string;
  provider: string;
  tokensUsed?: number;
}

export class LLMService {
  private anthropic: Anthropic | null = null;
  private openai: OpenAI | null = null;
  private google: GoogleGenerativeAI | null = null;
  public config: any = {};

  constructor(config: any = {}) {
    this.config = config;
    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    }
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    if (process.env.GOOGLE_AI_KEY) {
      this.google = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
    }
  }

  async generate(prompt: string): Promise<LLMResponse> {
    const content = await this.generateResponse(prompt);
    return {
      content,
      model: this.config.model || 'gpt-4',
      provider: 'openai',
    };
  }

  async generateResponse(
    prompt: string,
    model: string = 'gpt-4',
    conversationHistory: any[] = []
  ): Promise<string> {
    try {
      if (model === 'claude' && this.anthropic) {
        const message = await this.anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }],
        });
        return message.content[0].type === 'text' ? message.content[0].text : '';
      } else if (model === 'gpt-4' && this.openai) {
        const completion = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1024,
        });
        return completion.choices[0].message.content || '';
      } else if (model === 'gemini' && this.google) {
        const genAI = this.google;
        const generativeModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const result = await generativeModel.generateContent(prompt);
        return result.response.text();
      }
      return 'Model not available';
    } catch (error) {
      console.error('LLM Error:', error);
      throw error;
    }
  }

  getAvailableModels() {
    return {
      anthropic: !!this.anthropic,
      openai: !!this.openai,
      google: !!this.google,
    };
  }

  async isAvailable(): Promise<boolean> {
    try {
      // Check if at least one provider is available
      if (this.anthropic || this.openai || this.google) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async *generateStream(prompt: string): AsyncGenerator<string> {
    // Return an async generator that yields the response
    const response = await this.generateResponse(prompt);
    yield response;
  }
}

const llmServiceInstance = new LLMService();
export default llmServiceInstance;
