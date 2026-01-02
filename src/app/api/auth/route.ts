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

    // Create or get user
    const user = await db.user.upsert({
      where: { email },
      update: {
        name: name || undefined,
        lastActiveAt: new Date()
      },
      create: {
        email,
        name: name || null,
        level: 1,
        totalPoints: 0,
        streak: 0
      }
    })

    // Initialize user analytics if not exists
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    await db.userAnalytics.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: today
        }
      },
      update: {},
      create: {
        userId: user.id,
        date: today
      }
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        level: user.level,
        totalPoints: user.totalPoints,
        streak: user.streak
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