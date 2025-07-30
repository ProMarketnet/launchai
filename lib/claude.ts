import Anthropic from '@anthropic-ai/sdk';

// Types
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface UserData {
  businessType?: string;
  targetAudience?: string;
  goals?: string;
  budget?: string;
}

export interface AIResponse {
  success: boolean;
  response?: string;
  error?: string;
  provider?: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
    cost?: number;
  };
}

// Initialize Claude client
const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
}) : null;

// Marketing system prompt
const MARKETING_SYSTEM_PROMPT = `You are LaunchAI, an expert marketing strategist and business consultant. You help businesses create personalized marketing plans, campaigns, and strategies.

Your expertise includes:
- Digital marketing strategy (SEO, SEM, social media, content marketing)
- Brand positioning and messaging
- Customer acquisition and retention
- Marketing automation and funnels
- Performance marketing and analytics
- Budget allocation and ROI optimization
- Market research and competitive analysis

Always provide:
1. Actionable, specific recommendations
2. Clear explanations of strategy rationale
3. Implementation timelines when relevant
4. Budget considerations and ROI expectations
5. Metrics to track success

Be conversational but professional. Ask clarifying questions when you need more context about their business, target audience, or goals.`;

// Claude implementation (Primary)
async function callClaude(
  messages: ChatMessage[],
  userData?: UserData
): Promise<AIResponse> {
  if (!anthropic) {
    throw new Error('Claude API key not configured');
  }

  try {
    // Build context from user data
    let contextPrompt = '';
    if (userData) {
      contextPrompt = `\n\nUser Context:
- Business Type: ${userData.businessType || 'Not specified'}
- Target Audience: ${userData.targetAudience || 'Not specified'}
- Goals: ${userData.goals || 'Not specified'}
- Budget: ${userData.budget || 'Not specified'}`;
    }

    // Convert messages for Claude format
    const claudeMessages: Anthropic.Messages.MessageParam[] = messages
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content + (msg.role === 'user' && contextPrompt ? contextPrompt : '')
      }));

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      temperature: 0.7,
      system: MARKETING_SYSTEM_PROMPT,
      messages: claudeMessages,
    });

    const textContent = response.content.find(
      (content): content is Anthropic.TextBlock => content.type === 'text'
    );

    if (!textContent) {
      throw new Error('No text content in response');
    }

    return {
      success: true,
      response: textContent.text,
      provider: 'claude',
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
        cost: calculateClaudeCost(response.usage.input_tokens, response.usage.output_tokens),
      },
    };
  } catch (error) {
    console.error('Claude API Error:', error);
    throw error;
  }
}

// OpenAI implementation (Fallback)
async function callOpenAI(
  messages: ChatMessage[],
  userData?: UserData
): Promise<AIResponse> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    // Build system message with context
    let systemMessage = MARKETING_SYSTEM_PROMPT;
    if (userData) {
      systemMessage += `\n\nUser Context:
- Business Type: ${userData.businessType || 'Not specified'}
- Target Audience: ${userData.targetAudience || 'Not specified'}
- Goals: ${userData.goals || 'Not specified'}
- Budget: ${userData.budget || 'Not specified'}`;
    }

    const openAIMessages = [
      { role: 'system', content: systemMessage },
      ...messages.filter(msg => msg.role !== 'system')
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: openAIMessages,
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      success: true,
      response: data.choices[0].message.content,
      provider: 'openai',
      usage: {
        input_tokens: data.usage.prompt_tokens,
        output_tokens: data.usage.completion_tokens,
        cost: calculateOpenAICost(data.usage.prompt_tokens, data.usage.completion_tokens),
      },
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}

// Main function with fallback logic
export async function generateMarketingStrategy(
  message: string,
  userData?: UserData,
  conversationHistory: ChatMessage[] = []
): Promise<AIResponse> {
  const messages: ChatMessage[] = [
    ...conversationHistory,
    { role: 'user', content: message }
  ];

  // Fallback order: Claude -> OpenAI GPT-4o
  const providers = [
    { name: 'claude', fn: callClaude },
    { name: 'openai', fn: callOpenAI },
  ];

  let lastError: Error | null = null;

  for (const provider of providers) {
    try {
      console.log(`Attempting to call ${provider.name}...`);
      const result = await provider.fn(messages, userData);
      console.log(`Successfully got response from ${provider.name}`);
      return result;
    } catch (error) {
      console.warn(`${provider.name} failed:`, error);
      lastError = error instanceof Error ? error : new Error(`${provider.name} failed`);
      
      // If it's a configuration error (no API key), skip to next provider
      if (error instanceof Error && error.message.includes('not configured')) {
        continue;
      }
      
      // For API errors, wait a bit before trying next provider
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // If all providers failed
  return {
    success: false,
    error: `All AI providers failed. Last error: ${lastError?.message || 'Unknown error'}`,
  };
}

// Cost calculation functions
function calculateClaudeCost(inputTokens: number, outputTokens: number): number {
  // Claude 3.5 Sonnet pricing (Jan 2025)
  const INPUT_COST_PER_1K = 0.003;
  const OUTPUT_COST_PER_1K = 0.015;
  return (inputTokens / 1000) * INPUT_COST_PER_1K + (outputTokens / 1000) * OUTPUT_COST_PER_1K;
}

function calculateOpenAICost(inputTokens: number, outputTokens: number): number {
  // GPT-4o pricing
  const INPUT_COST_PER_1K = 0.0025;
  const OUTPUT_COST_PER_1K = 0.01;
  return (inputTokens / 1000) * INPUT_COST_PER_1K + (outputTokens / 1000) * OUTPUT_COST_PER_1K;
}
