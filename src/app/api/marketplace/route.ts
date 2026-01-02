// ============================================
// Skillytics Marketplace API Routes
// Handles marketplace items, purchases, and creator management
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// GET /api/marketplace - Get marketplace items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'popular';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Build query
    const where: any = {
      status: 'APPROVED'
    };

    if (category) where.category = category;
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } }
      ];
    }
    if (minPrice) where.price = { ...where.price, gte: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice) };

    // Determine sort order
    let orderBy: any = {};
    switch (sortBy) {
      case 'popular': orderBy = { totalSales: 'desc' }; break;
      case 'newest': orderBy = { publishedAt: 'desc' }; break;
      case 'price_asc': orderBy = { price: 'asc' }; break;
      case 'price_desc': orderBy = { price: 'desc' }; break;
      case 'rating': orderBy = { averageRating: 'desc' }; break;
      default: orderBy = { totalSales: 'desc' };
    }

    // Fetch items
    const [items, total] = await Promise.all([
      db.marketplaceItem.findMany({
        where,
        include: {
          creator: {
            include: {
              user: { select: { name: true, avatar: true } }
            }
          },
          reviews: {
            where: userId ? { userId } : undefined,
            select: { rating: true, id: true }
          }
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit
      }),
      db.marketplaceItem.count({ where })
    ]);

    // Check if user has purchased items
    let purchasedIds: Set<string> = new Set();
    if (userId) {
      const purchases = await db.marketplacePurchase.findMany({
        where: { userId },
        select: { itemId: true }
      });
      purchasedIds = new Set(purchases.map(p => p.itemId));
    }

    // Format response
    const formattedItems = items.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      type: item.type,
      category: item.category,
      tags: JSON.parse(item.tags),
      price: item.price,
      currency: item.currency,
      isFree: item.isFree,
      creator: {
        name: item.creator.user.name,
        avatar: item.creator.user.avatar
      },
      rating: {
        average: item.averageRating,
        count: item.totalReviews
      },
      sales: item.totalSales,
      previewContent: item.previewContent,
      hasPurchased: purchasedIds.has(item.id),
      userReview: item.reviews[0] || null
    }));

    return NextResponse.json({
      items: formattedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Marketplace API error:', error);
    return NextResponse.json({ error: 'Failed to fetch marketplace items' }, { status: 500 });
  }
}

// POST /api/marketplace - Create or manage marketplace items
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { action, itemId, ...itemData } = body;

    // Get or create creator profile
    let creator = await db.marketplaceCreator.findUnique({
      where: { userId }
    });

    if (!creator) {
      creator = await db.marketplaceCreator.create({
        data: { userId }
      });
    }

    switch (action) {
      case 'create': {
        // Validate item data
        if (!itemData.title || !itemData.description || !itemData.type || !itemData.category) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const item = await db.marketplaceItem.create({
          data: {
            creatorId: creator.id,
            title: itemData.title,
            description: itemData.description,
            type: itemData.type,
            category: itemData.category,
            tags: JSON.stringify(itemData.tags || []),
            price: itemData.price || 0,
            currency: 'USD',
            isFree: itemData.isFree || false,
            content: JSON.stringify(itemData.content || {}),
            previewContent: itemData.previewContent || null,
            fileUrls: JSON.stringify(itemData.fileUrls || []),
            status: 'DRAFT',
            revenueShare: 0.6 // Default 60% to creator
          }
        });

        return NextResponse.json({
          success: true,
          itemId: item.id,
          message: 'Item created successfully. Submit for review when ready.'
        });
      }

      case 'update': {
        if (!itemId) {
          return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
        }

        // Verify ownership
        const existingItem = await db.marketplaceItem.findUnique({
          where: { id: itemId },
          include: { creator: true }
        });

        if (!existingItem || existingItem.creator.userId !== userId) {
          return NextResponse.json({ error: 'Item not found or access denied' }, { status: 403 });
        }

        const item = await db.marketplaceItem.update({
          where: { id: itemId },
          data: {
            title: itemData.title,
            description: itemData.description,
            type: itemData.type,
            category: itemData.category,
            tags: JSON.stringify(itemData.tags || []),
            price: itemData.price,
            isFree: itemData.isFree,
            content: JSON.stringify(itemData.content || {}),
            previewContent: itemData.previewContent,
            fileUrls: JSON.stringify(itemData.fileUrls || [])
          }
        });

        return NextResponse.json({
          success: true,
          message: 'Item updated successfully'
        });
      }

      case 'submit': {
        if (!itemId) {
          return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
        }

        const item = await db.marketplaceItem.update({
          where: { id: itemId },
          data: { status: 'PENDING_REVIEW' }
        });

        return NextResponse.json({
          success: true,
          message: 'Item submitted for review. Our team will review your submission within 48 hours.'
        });
      }

      case 'publish': {
        // Only admins can publish
        const user = await db.user.findUnique({
          where: { id: userId },
          select: { subscriptionTier: true }
        });

        if (user?.subscriptionTier !== 'ENTERPRISE') {
          return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        if (!itemId) {
          return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
        }

        const item = await db.marketplaceItem.update({
          where: { id: itemId },
          data: { 
            status: 'APPROVED',
            publishedAt: new Date()
          }
        });

        return NextResponse.json({
          success: true,
          message: 'Item published successfully'
        });
      }

      case 'archive': {
        if (!itemId) {
          return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
        }

        const item = await db.marketplaceItem.update({
          where: { id: itemId },
          data: { status: 'ARCHIVED' }
        });

        return NextResponse.json({
          success: true,
          message: 'Item archived'
        });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Marketplace API error:', error);
    return NextResponse.json({ error: 'Marketplace operation failed' }, { status: 500 });
  }
}

// PURCHASE endpoint
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { itemId, useCredits } = body;

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
    }

    // Get item
    const item = await db.marketplaceItem.findUnique({
      where: { id: itemId },
      include: { creator: true }
    });

    if (!item || item.status !== 'APPROVED') {
      return NextResponse.json({ error: 'Item not available' }, { status: 404 });
    }

    // Check if already purchased
    const existingPurchase = await db.marketplacePurchase.findUnique({
      where: {
        userId_itemId: { userId, itemId }
      }
    });

    if (existingPurchase) {
      return NextResponse.json({ error: 'Already purchased', accessUrl: `/marketplace/item/${itemId}` }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { credits: true, stripeCustomerId: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Handle free items
    if (item.isFree || item.price === 0) {
      await db.marketplacePurchase.create({
        data: {
          userId,
          itemId,
          amount: 0,
          currency: 'USD',
          paymentMethod: 'free'
        }
      });

      await db.marketplaceItem.update({
        where: { id: itemId },
        data: { totalSales: { increment: 1 } }
      });

      return NextResponse.json({
        success: true,
        message: 'Item added to your library',
        accessUrl: `/marketplace/item/${itemId}`
      });
    }

    // Handle credit purchase
    if (useCredits) {
      if (user.credits < item.price) {
        return NextResponse.json({ 
          error: 'Insufficient credits',
          required: item.price,
          available: user.credits
        }, { status: 400 });
      }

      // Deduct credits and create purchase
      await db.$transaction([
        db.user.update({
          where: { id: userId },
          data: { credits: { decrement: item.price } }
        }),
        db.marketplacePurchase.create({
          data: {
            userId,
            itemId,
            amount: item.price,
            currency: 'USD',
            paymentMethod: 'credits'
          }
        }),
        db.marketplaceItem.update({
          where: { id: itemId },
          data: { totalSales: { increment: 1 } }
        }),
        db.marketplaceCreator.update({
          where: { id: item.creator.id },
          data: {
            pendingPayout: { increment: item.price * item.revenueShare },
            totalEarnings: { increment: item.price * item.revenueShare }
          }
        })
      ]);

      return NextResponse.json({
        success: true,
        message: 'Purchase successful',
        accessUrl: `/marketplace/item/${itemId}`
      });
    }

    // Handle Stripe checkout for remaining balance
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Create Stripe checkout session
    const { createOneTimePaymentSession } = await import('@/lib/stripe');
    
    const checkoutSession = await createOneTimePaymentSession(
      userId,
      session.user.email!,
      session.user.name || undefined,
      item.price,
      `Marketplace: ${item.title}`,
      { itemId, type: 'marketplace_purchase' },
      `${baseUrl}/marketplace/item/${itemId}?success=true`,
      `${baseUrl}/marketplace/item/${itemId}`
    );

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url
    });
  } catch (error) {
    console.error('Marketplace purchase error:', error);
    return NextResponse.json({ error: 'Purchase failed' }, { status: 500 });
  }
}
