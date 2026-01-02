import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const moduleId = searchParams.get('moduleId')
    const type = searchParams.get('type')
    const difficulty = searchParams.get('difficulty')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    let whereClause: any = {
      isPublished: true
    }

    if (moduleId) {
      whereClause.moduleId = moduleId
    }

    if (type) {
      whereClause.type = type
    }

    if (difficulty) {
      whereClause.difficulty = difficulty
    }

    const missions = await db.mission.findMany({
      where: whereClause,
      include: {
        module: {
          select: {
            id: true,
            title: true,
            color: true
          }
        },
        _count: {
          select: {
            progress: true
          }
        }
      },
      orderBy: {
        order: 'asc'
      },
      take: limit,
      skip: offset
    })

    const total = await db.mission.count({
      where: whereClause
    })

    return NextResponse.json({
      missions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error('Error fetching missions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch missions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      context,
      type,
      difficulty,
      points,
      estimatedTime,
      moduleId,
      dataset,
      brokenCode,
      objectives,
      constraints,
      validationRules,
      hints,
      tags,
      order
    } = body

    // Validate required fields
    if (!title || !description || !context || !type || !difficulty || !moduleId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const mission = await db.mission.create({
      data: {
        title,
        description,
        context,
        type,
        difficulty,
        points: points || 100,
        estimatedTime: estimatedTime || 30,
        moduleId,
        dataset: dataset || null,
        brokenCode: brokenCode || null,
        objectives: objectives || [],
        constraints: constraints || null,
        validationRules: validationRules || {},
        hints: hints || {},
        tags: JSON.stringify(tags || []),
        order: order || 0,
        isPublished: false
      },
      include: {
        module: {
          select: {
            id: true,
            title: true,
            color: true
          }
        }
      }
    })

    return NextResponse.json(mission, { status: 201 })
  } catch (error) {
    console.error('Error creating mission:', error)
    return NextResponse.json(
      { error: 'Failed to create mission' },
      { status: 500 }
    )
  }
}