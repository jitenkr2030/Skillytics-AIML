import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const modules = await db.skillModule.findMany({
      include: {
        missions: {
          where: {
            isPublished: true
          },
          select: {
            id: true,
            title: true,
            type: true,
            difficulty: true,
            points: true,
            order: true
          },
          orderBy: {
            order: 'asc'
          }
        },
        _count: {
          select: {
            missions: {
              where: {
                isPublished: true
              }
            }
          }
        }
      },
      orderBy: {
        order: 'asc'
      }
    })

    return NextResponse.json(modules)
  } catch (error) {
    console.error('Error fetching skill modules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skill modules' },
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
      order,
      icon,
      color,
      isLocked
    } = body

    // Validate required fields
    if (!title || !description || order === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const skillModule = await db.skillModule.create({
      data: {
        title,
        description,
        order,
        icon: icon || null,
        color: color || '#6366f1',
        isLocked: isLocked !== undefined ? isLocked : true
      }
    })

    return NextResponse.json(skillModule, { status: 201 })
  } catch (error) {
    console.error('Error creating skill module:', error)
    return NextResponse.json(
      { error: 'Failed to create skill module' },
      { status: 500 }
    )
  }
}