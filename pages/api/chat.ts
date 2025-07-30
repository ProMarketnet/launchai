import { NextApiRequest, NextApiResponse } from 'next';
import { generateMarketingStrategy, ChatMessage, UserData } from '../../lib/ai-service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ChatRequest {
  message: string;
  userData?: UserData;
  conversationHistory?: ChatMessage[];
  conversationId?: string;
}

export interface ChatResponse {
  success: boolean;
  response?: string;
  error?: string;
  provider?: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
    cost?: number;
  };
  conversationId?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const { message, userData, conversationHistory, conversationId }: ChatRequest = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a string',
      });
    }

    // Generate response using AI service with fallback system
    const result = await generateMarketingStrategy(
      message, 
      userData, 
      conversationHistory || []
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to generate response'
      });
    }

    // Optional: Save to database if conversationId is provided
    if (conversationId && result.response) {
      try {
        // Save user message
        await prisma.message.create({
          data: {
            conversationId,
            role: 'user',
            content: message,
            tokens: result.usage?.input_tokens,
          },
        });

        // Save assistant response
        await prisma.message.create({
          data: {
            conversationId,
            role: 'assistant',
            content: result.response,
            tokens: result.usage?.output_tokens,
          },
        });

        // Track API usage with provider info
        await prisma.apiUsage.create({
          data: {
            model: `${result.provider}-${getModelName(result.provider || 'unknown')}`,
            inputTokens: result.usage?.input_tokens || 0,
            outputTokens: result.usage?.output_tokens || 0,
            totalCost: result.usage?.cost || 0,
          },
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue without failing the request
      }
    }

    res.status(200).json({
      success: true,
      response: result.response,
      provider: result.provider,
      usage: result.usage,
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}

// Helper function to get model names for tracking
function getModelName(provider: string): string {
  switch (provider) {
    case 'claude':
      return 'claude-3-5-sonnet-20241022';
    case 'openai':
      return 'gpt-4o';
    case 'gemini':
      return 'gemini-pro';
    case 'gpt35':
      return 'gpt-3.5-turbo';
    default:
      return 'unknown';
  }
}
