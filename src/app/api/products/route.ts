import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get('category');
    const size = searchParams.get('size');
    const color = searchParams.get('color');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'newest';
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const onSale = searchParams.get('onSale');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (size) {
      where.sizes = {
        some: {
          size: size,
          stock: { gt: 0 },
        },
      };
    }

    if (color) {
      where.colors = {
        some: {
          name: {
            equals: color,
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
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : undefined,
      category: product.category.slug,
      images: product.images.map((img) => img.url),
      sizes: product.sizes.map((s) => s.size),
      colors: product.colors.map((c) => ({ name: c.name, hex: c.hex })),
      stock: product.stock,
      isNew: product.isNew,
      isFeatured: product.isFeatured,
      isOnSale: product.isOnSale,
      tags: product.tags,
    }));

    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        page,
        limit,
        totalProducts,
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
