import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { validateCode } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      missionId,
      code,
      language = 'python'
    } = body

    // Validate required fields
    if (!userId || !missionId || !code) {
      return NextResponse.json(
        { error: 'User ID, Mission ID, and code are required' },
        { status: 400 }
      )
    }

    // Get mission details for validation
    const mission = await db.mission.findUnique({
      where: { id: missionId },
      select: {
        id: true,
        title: true,
        type: true,
        validationRules: true,
        objectives: true
      }
    })

    if (!mission) {
      return NextResponse.json(
        { error: 'Mission not found' },
        { status: 404 }
      )
    }

    // Get or create progress record
    const progress = await db.missionProgress.upsert({
      where: {
        userId_missionId: {
          userId,
          missionId
        }
      },
      update: {
        attempts: { increment: 1 },
        lastAttemptAt: new Date()
      },
      create: {
        userId,
        missionId,
        status: 'IN_PROGRESS',
        attempts: 1
      }
    })

    // Validate the code
    const validationResult = await validateCode(code, mission.validationRules, {
      missionType: mission.type,
      language
    })

    // Create submission record
    const submission = await db.codeSubmission.create({
      data: {
        userId,
        missionId,
        progressId: progress.id,
        code,
        language,
        testResults: validationResult.testResults,
        score: validationResult.score,
        feedback: validationResult.feedback,
        isCorrect: validationResult.isCorrect,
        executionTime: validationResult.executionTime
      }
    })

    // Update progress if this is the best score
    const updateData: any = {
      currentScore: validationResult.score
    }

    if (!progress.bestScore || validationResult.score > progress.bestScore) {
      updateData.bestScore = validationResult.score
    }

    if (validationResult.isCorrect) {
      updateData.status = 'COMPLETED'
      updateData.completedAt = new Date()
    }

    await db.missionProgress.update({
      where: { id: progress.id },
      data: updateData
    })

    // Update user analytics
    await updateUserAnalytics(userId, mission.type, validationResult.isCorrect)

    return NextResponse.json({
      submission,
      validation: validationResult,
      progress: {
        ...updateData,
        attempts: progress.attempts + 1
      }
    })
  } catch (error) {
    console.error('Error submitting code:', error)
    return NextResponse.json(
      { error: 'Failed to submit code' },
      { status: 500 }
    )
  }
}

async function updateUserAnalytics(userId: string, missionType: string, isCorrect: boolean) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const analytics = await db.userAnalytics.upsert({
    where: {
      userId_date: {
        userId,
        date: today
      }
    },
    update: {
      totalAttempts: { increment: 1 },
      missionsCompleted: isCorrect ? { increment: 1 } : undefined,
      ...(missionType === 'MODEL_DEBUG' && isCorrect && { bugFixes: { increment: 1 } }),
      ...(missionType === 'DATA_QUALITY' && isCorrect && { dataCleaned: { increment: 1 } }),
      ...(missionType === 'ALGORITHM_SELECTION' && isCorrect && { algorithmsChosen: { increment: 1 } }),
      preferredMissionType: missionType
    },
    create: {
      userId,
      date: today,
      totalAttempts: 1,
      missionsCompleted: isCorrect ? 1 : 0,
      bugFixes: missionType === 'MODEL_DEBUG' && isCorrect ? 1 : 0,
      dataCleaned: missionType === 'DATA_QUALITY' && isCorrect ? 1 : 0,
      algorithmsChosen: missionType === 'ALGORITHM_SELECTION' && isCorrect ? 1 : 0,
      preferredMissionType: missionType
    }
  })

  return analytics
}