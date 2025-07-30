// pages/api/chat.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { generateMarketingStrategy, ChatMessage, UserData } from '../../lib/ai-service';

export interface ChatRequest {
  message: string;
  userData?: UserData;
  conversationId?: string;
}

export interface ChatResponse {
  success: boolean;
  response?: string;
  error?: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
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
    const { message, userData }: ChatRequest = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a string',
      });
    }

    // Rate limiting check (implement based on your needs)
    // TODO: Add rate limiting logic here

    const result = await ClaudeService.generateMarketingStrategy(message, userData);

    // TODO: Save conversation to database if needed
    // await saveConversation(conversationId, message, result.content);

    res.status(200).json({
      success: true,
      response: result.content,
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
