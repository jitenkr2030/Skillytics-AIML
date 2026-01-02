import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const missionId = searchParams.get('missionId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    let whereClause: any = {
      userId
    }

    if (missionId) {
      whereClause.missionId = missionId
    }

    const progress = await db.missionProgress.findMany({
      where: whereClause,
      include: {
        mission: {
          select: {
            id: true,
            title: true,
            type: true,
            difficulty: true,
            points: true,
            module: {
              select: {
                id: true,
                title: true,
                color: true
              }
            }
          }
        },
        submissions: {
          select: {
            id: true,
            score: true,
            isCorrect: true,
            submittedAt: true,
            executionTime: true
          },
          orderBy: {
            submittedAt: 'desc'
          },
          take: 1
        }
      }
    })

    return NextResponse.json(progress)
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      missionId,
      status,
      attempts,
      bestScore,
      currentScore,
      timeSpent
    } = body

    // Validate required fields
    if (!userId || !missionId) {
      return NextResponse.json(
        { error: 'User ID and Mission ID are required' },
        { status: 400 }
      )
    }

    const progress = await db.missionProgress.upsert({
      where: {
        userId_missionId: {
          userId,
          missionId
        }
      },
      update: {
        status: status || undefined,
        attempts: attempts !== undefined ? { increment: attempts } : undefined,
        bestScore: bestScore !== undefined ? bestScore : undefined,
        currentScore: currentScore !== undefined ? currentScore : undefined,
        timeSpent: timeSpent !== undefined ? { increment: timeSpent } : undefined,
        lastAttemptAt: new Date(),
        completedAt: status === 'COMPLETED' ? new Date() : undefined
      },
      create: {
        userId,
        missionId,
        status: status || 'IN_PROGRESS',
        attempts: attempts || 1,
        bestScore: bestScore || null,
        currentScore: currentScore || null,
        timeSpent: timeSpent || 0
      },
      include: {
        mission: {
          select: {
            id: true,
            title: true,
            type: true,
            difficulty: true,
            points: true
          }
        }
      }
    })

    return NextResponse.json(progress)
  } catch (error) {
    console.error('Error updating progress:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}