import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get('category');
    const sizes = searchParams.getAll('size').flatMap((value) => value.split(',')).filter(Boolean);
    const colors = searchParams.getAll('color').flatMap((value) => value.split(',')).filter(Boolean);
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'newest';
    const search = searchParams.get('search')?.trim().slice(0, 80);
    const featured = searchParams.get('featured');
    const onSale = searchParams.get('onSale');
    const slugs = searchParams.get('slugs');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(48, Math.max(1, parseInt(searchParams.get('limit') || '12')));

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    // Filtrar por slugs (para favoritos)
    if (slugs) {
      const slugArray = slugs.split(',').filter(Boolean);
      where.slug = { in: slugArray };
    }

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (sizes.length > 0) {
      where.sizes = {
        some: {
          size: { in: sizes },
          stock: { gt: 0 },
        },
      };
    }

    if (colors.length > 0) {
      where.colors = {
        some: {
          name: {
            in: colors,
            mode: 'insensitive',
          },
        },
      };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search.toLowerCase()] } },
      ];
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (onSale === 'true') {
      where.isOnSale = true;
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };

    switch (sort) {
      case 'price-asc':
        orderBy = { price: 'asc' };
        break;
      case 'price-desc':
        orderBy = { price: 'desc' };
        break;
      case 'name-asc':
        orderBy = { name: 'asc' };
        break;
      case 'name-desc':
        orderBy = { name: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [products, totalProducts] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          images: {
            orderBy: { order: 'asc' },
          },
          sizes: true,
          colors: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(totalProducts / limit);

    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      category: product.category,
      images: product.images?.map((img: { url: string }) => img.url) || [],
      sizes: product.sizes?.map((s: { size: string; stock: number }) => ({ size: s.size, stock: s.stock })) || [],
      colors: product.colors?.map((c: { name: string; hex: string }) => ({ name: c.name, hexCode: c.hex })) || [],
      stock: product.stock,
      isNew: product.isNew,
      isFeatured: product.isFeatured,
      isOnSale: product.isOnSale,
      isActive: product.isActive,
      tags: product.tags || [],
      createdAt: product.createdAt,
    }));

    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        page,
        limit,
        totalProducts,
        total: totalProducts,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}
