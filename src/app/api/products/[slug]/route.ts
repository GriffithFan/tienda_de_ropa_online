import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        images: {
          orderBy: { order: 'asc' },
        },
        sizes: true,
        colors: true,
        reviews: {
          where: { isVisible: true },
          include: {
            user: {
              select: { firstName: true, lastName: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true,
      },
      take: 4,
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
        colors: true,
      },
    });

    const formattedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : undefined,
      sku: product.sku,
      category: product.category,
      images: product.images?.map((img: { url: string }) => img.url) || [],
      sizes: product.sizes?.map((s: { size: string; stock: number }) => ({ size: s.size, stock: s.stock })) || [],
      colors: product.colors?.map((c: { name: string; hex: string }) => ({ name: c.name, hexCode: c.hex })) || [],
      stock: product.stock,
      isNew: product.isNew,
      isFeatured: product.isFeatured,
      isOnSale: product.isOnSale,
      tags: product.tags || [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reviews: product.reviews?.map((r: any) => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        userName: `${r.user.firstName} ${r.user.lastName?.charAt(0) || ''}.`,
        createdAt: r.createdAt,
      })) || [],
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedRelated = relatedProducts.map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
      images: p.images.map((img: { url: string }) => img.url),
      colors: p.colors.map((c: { name: string; hex: string }) => ({ name: c.name, hex: c.hex })),
    }));

    return NextResponse.json({
      product: formattedProduct,
      relatedProducts: formattedRelated,
    });
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    return NextResponse.json(
      { error: 'Error al obtener el producto' },
      { status: 500 }
    );
  }
}
