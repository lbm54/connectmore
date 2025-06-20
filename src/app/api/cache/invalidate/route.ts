import { NextRequest, NextResponse } from 'next/server';
import { invalidateCache } from '@/lib/apiCache';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    switch (type) {
      case 'events':
        await invalidateCache.events();
        break;
      case 'event':
        if (id) await invalidateCache.event(id);
        break;
      case 'organizers':
        await invalidateCache.organizers();
        break;
      case 'organizer':
        if (id) await invalidateCache.organizer(id);
        break;
      case 'venues':
        await invalidateCache.venues();
        break;
      case 'all':
        await invalidateCache.all();
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid cache type' },
          { status: 400 }
        );
    }

    return NextResponse.json({ 
      success: true, 
      message: `Cache invalidated for ${type}${id ? ` (${id})` : ''}` 
    });

  } catch (error) {
    console.error('Cache invalidation error:', error);
    return NextResponse.json(
      { error: 'Failed to invalidate cache' },
      { status: 500 }
    );
  }
} 