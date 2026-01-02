import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Create or get existing user
    const user = await db.user.upsert({
      where: { email },
      update: {
        name: name || undefined,
        lastActiveAt: new Date()
      },
      create: {
        email,
        name: name || 'ML Learner',
        level: 1,
        totalPoints: 0,
        streak: 0
      }
    })

    // Initialize user analytics if new user
    if (!user.createdAt || user.createdAt.toISOString() === user.updatedAt.toISOString()) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      await db.userAnalytics.create({
        data: {
          userId: user.id,
          date: today,
          missionsCompleted: 0,
          totalAttempts: 0,
          averageScore: 0,
          timeSpent: 0,
          bugFixes: 0,
          modelsImproved: 0,
          dataCleaned: 0,
          algorithmsChosen: 0,
          hintUsage: 0,
          streakDays: 0
        }
      })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        level: user.level,
        totalPoints: user.totalPoints,
        streak: user.streak,
        avatar: user.avatar
      }
    })
  } catch (error) {
    console.error('Error in auth:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}