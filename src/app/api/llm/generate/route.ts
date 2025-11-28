/**
 * LLM Generation API Route
 * Supports multiple providers: local, OpenAI, Claude, Gemini
 */

import { NextRequest, NextResponse } from 'next/server';
import { LLMService } from '@/lib/llm-service';

/**
 * POST /api/llm/generate
 * Generate text using configured LLM
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, provider, model, stream } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const llm = new LLMService({
      provider: provider || undefined,
      model: model || undefined,
    });

    // Check if LLM is available
    const available = await llm.isAvailable();
    if (!available && provider === 'local') {
      return NextResponse.json(
        {
          error: 'Local LLM (Ollama) is not running',
          hint: 'Run "ollama serve" in another terminal',
        },
        { status: 503 }
      );
    }

    // Handle streaming
    if (stream) {
      return new NextResponse(
        new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of llm.generateStream(prompt)) {
                controller.enqueue(chunk);
              }
              controller.close();
            } catch (error) {
              controller.error(error);
            }
          },
        }),
        {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
          },
        }
      );
    }

    // Non-streaming response
    const response = await llm.generate(prompt);

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('LLM generation error:', error);

    const message = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { error: `LLM generation failed: ${message}` },
      { status: 500 }
    );
  }
}

/**
 * GET /api/llm/generate
 * Check LLM status and available models
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || 'status';

    const llm = new LLMService();

    if (action === 'status') {
      const available = await llm.isAvailable();
      const models = available ? await llm.getAvailableModels() : [];

      return NextResponse.json({
        success: true,
        data: {
          provider: process.env.LLM_PROVIDER || 'local',
          available,
          models,
          defaultModel: process.env.LOCAL_LLM_MODEL || 'mistral',
        },
      });
    }

    if (action === 'models') {
      const models = await llm.getAvailableModels();

      return NextResponse.json({
        success: true,
        data: { models },
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('LLM status error:', error);

    return NextResponse.json(
      { error: 'Failed to get LLM status' },
      { status: 500 }
    );
  }
}
