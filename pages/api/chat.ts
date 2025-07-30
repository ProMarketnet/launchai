import { NextApiRequest, NextApiResponse } from 'next';
import { generateMarketingStrategy, ChatMessage, UserData } from '../../lib/ai-service';

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
    const { message, userData, conversationHistory }: ChatRequest = req.body;

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

    // Log usage for debugging (optional)
    if (result.usage && result.provider) {
      console.log(`Response from ${result.provider}:`, {
        input_tokens: result.usage.input_tokens,
        output_tokens: result.usage.output_tokens,
        cost: result.usage.cost
      });
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
