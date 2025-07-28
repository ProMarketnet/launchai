import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const userId = (session.user as any).id

  if (req.method === 'POST') {
    try {
      const profile = await prisma.marketingProfile.upsert({
        where: {
          userId: userId,
        },
        update: {
          ...req.body,
          completed: true,
        },
        create: {
          userId: userId,
          ...req.body,
          completed: true,
        },
      })
      
      res.status(200).json(profile)
    } catch (error) {
      console.error('Profile save error:', error)
      res.status(500).json({ error: 'Failed to save profile' })
    }
  } else if (req.method === 'GET') {
    try {
      const profile = await prisma.marketingProfile.findFirst({
        where: {
          userId: userId,
        },
      })
      
      res.status(200).json(profile)
    } catch (error) {
      console.error('Profile fetch error:', error)
      res.status(500).json({ error: 'Failed to fetch profile' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
