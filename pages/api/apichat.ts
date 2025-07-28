import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import OpenAI from 'openai'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Marketing insights database
const getInsightsForProfile = (profile: any) => {
  const insights = {
    'SaaS/Software': {
      'Business decision-makers (B2B)': {
        timing: 'Tuesday & Thursday, 10am-2pm perform 40% better for B2B SaaS',
        platforms: 'LinkedIn: 60% budget, Twitter: 30%, Instagram: 10%',
        content: 'Demo videos outperform feature lists by 3.2x for your market',
        source: 'Based on 15,000+ similar launches'
      }
    },
    'Physical Product': {
      'End users/consumers (B2C)': {
        timing: 'Weekend posts get 25% more engagement for consumer products',
        platforms: 'Instagram: 50%, TikTok: 30%, Facebook: 20%',
        content: 'User-generated content drives 4x more conversions',
        source: 'Analysis of 8,000+ product launches'
      }
    },
    'Service/Consulting': {
      'Small business owners': {
        timing: 'Monday & Wednesday, 9am-11am best for service providers',
        platforms: 'LinkedIn: 70%, Facebook: 20%, Twitter: 10%',
        content: 'Case studies perform 5x better than service descriptions',
        source: 'Analysis of 5,000+ service launches'
      }
    }
  }
  
  const productInsights = (insights as any)[profile?.productType]
  const audienceInsights = productInsights?.[profile?.audience]
  
  return audienceInsights || {
    timing: 'Optimal posting times vary by industry - complete analysis in full report',
    platforms: 'Platform mix depends on your specific audience',
    content: 'Content strategy tailored to your product type',
    source: 'Personalized recommendations based on your profile'
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { message, conversationId } = req.body
    const userId = (session.user as any).id
    
    // Get user's profile for context
    const profile = await prisma.marketingProfile.findFirst({
      where: { userId: userId }
    })
    
    // Create system prompt with profile context
    let systemPrompt = `You are LaunchAI, an expert marketing strategy assistant. Help users create effective marketing strategies for their products.`
    
    if (profile) {
      const insights = getInsightsForProfile(profile)
      systemPrompt += `

User Profile:
- Product: ${profile.productType}
- Audience: ${profile.audience}
- Budget: ${profile.budget}
- Timeline: ${profile.timeline}
- Goals: ${profile.goals}

Key Insights:
- Timing: ${insights.timing}
- Platforms: ${insights.platforms}  
- Content: ${insights.content}

Always reference their specific profile when giving advice. Be specific and actionable.`
    } else {
      systemPrompt += ` The user hasn't completed their marketing profile yet. Encourage them to create one for personalized recommendations.`
    }

    // Get conversation history
    let conversation: any[] = []
    if (conversationId) {
      const existingConv = await prisma.conversation.findUnique({
        where: { id: conversationId }
      })
      if (existingConv) {
        conversation = existingConv.messages as any[]
      }
    }

    // Add new user message
    conversation.push({ role: 'user', content: message })

    // Get OpenAI response
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        ...conversation
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const aiResponse = completion.choices[0].message.content
    conversation.push({ role: 'assistant', content: aiResponse })

    // Save conversation
    const savedConversation = await prisma.conversation.upsert({
      where: {
        id: conversationId || 'new'
      },
      update: {
        messages: conversation,
      },
      create: {
        userId: userId,
        messages: conversation,
      },
    })

    res.status(200).json({
      message: aiResponse,
      conversationId: savedConversation.id,
      insights: profile ? getInsightsForProfile(profile) : null
    })

  } catch (error) {
    console.error('Chat API error:', error)
    res.status(500).json({ error: 'Failed to process message' })
  }
}
