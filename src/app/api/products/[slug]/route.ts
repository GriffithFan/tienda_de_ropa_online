import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/data/products';

/**
 * GET /api/products/[slug]
 * Obtiene un producto por su slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Buscar el producto
    const product = products.find((p) => p.slug === slug);

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // Obtener productos relacionados (misma categoria, excluyendo el actual)
    const relatedProducts = products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);

    return NextResponse.json({
      product,
      relatedProducts,
    });
  } catch (error) {
    console.error('Error obteniendo producto:', error);

    return NextResponse.json(
      { error: 'Error al obtener el producto' },
      { status: 500 }
    );
  }
}
