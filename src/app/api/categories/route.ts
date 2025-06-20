import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const categories = await prisma.event_categories.findMany({
      include: {
        event_subcategories: {
          orderBy: {
            subcategory_name: 'asc'
          }
        }
      },
      orderBy: {
        category_name: 'asc'
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
} 