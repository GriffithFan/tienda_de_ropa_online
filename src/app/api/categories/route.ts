import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const limited = rateLimit(request, {
      keyPrefix: 'categories:get',
      limit: 120,
      windowMs: 60_000,
    });

    if (limited) return limited;

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: {
            products: {
              where: { isActive: true },
            },
          },
        },
      },
    });

    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      productCount: category._count.products,
    }));

    return NextResponse.json({
      categories: formattedCategories,
    });
  } catch (error) {
    console.error('Error obteniendo categorias:', error);
    return NextResponse.json(
      { error: 'Error al obtener categorias' },
      { status: 500 }
    );
  }
}
