// lib/claude.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface ClaudeResponse {
  content: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
  model: string;
}

export interface MarketingPromptData {
  businessType?: string;
  targetAudience?: string;
  goals?: string;
  budget?: string;
  industry?: string;
  currentChallenges?: string;
}

export class ClaudeService {
  static async generateMarketingStrategy(
    prompt: string, 
    userData?: MarketingPromptData
  ): Promise<ClaudeResponse> {
    try {
      const systemPrompt = this.buildSystemPrompt();
      const userPrompt = this.buildUserPrompt(prompt, userData);

      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      });

      const content = message.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude API');
      }

      return {
        content: content.text,
        usage: {
          input_tokens: message.usage.input_tokens,
          output_tokens: message.usage.output_tokens,
        },
        model: message.model,
      };
    } catch (error) {
      console.error('Claude API Error:', error);
      throw new Error('Failed to generate marketing strategy');
    }
  }

  private static buildSystemPrompt(): string {
    return `You are LaunchAI, an expert marketing strategist and business consultant. Your role is to provide actionable, personalized marketing strategies that help businesses grow.

Key principles:
- Be specific and actionable, not generic
- Focus on practical steps the user can implement immediately
- Consider budget constraints and business stage
- Provide clear metrics and KPIs to track success
- Use data-driven insights when possible
- Be encouraging but realistic about timelines and expectations

Response format:
- Use clear headings and bullet points for readability
- Include specific tactics, not just high-level strategies
- Provide concrete examples relevant to their industry
- Suggest tools and platforms where appropriate
- End with immediate next steps they can take today`;
  }

  private static buildUserPrompt(prompt: string, userData?: MarketingPromptData): string {
    let contextualPrompt = prompt;

    if (userData) {
      const context = [];
      if (userData.businessType) context.push(`Business Type: ${userData.businessType}`);
      if (userData.targetAudience) context.push(`Target Audience: ${userData.targetAudience}`);
      if (userData.goals) context.push(`Goals: ${userData.goals}`);
      if (userData.budget) context.push(`Budget: ${userData.budget}`);
      if (userData.industry) context.push(`Industry: ${userData.industry}`);
      if (userData.currentChallenges) context.push(`Current Challenges: ${userData.currentChallenges}`);

      if (context.length > 0) {
        contextualPrompt = `Context about my b
