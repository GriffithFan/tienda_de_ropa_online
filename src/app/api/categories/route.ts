import { NextRequest, NextResponse } from 'next/server';
import { categories } from '@/data/products';

/**
 * GET /api/categories
 * Obtiene todas las categorias de productos
 */
export async function GET() {
  try {
    return NextResponse.json({
      categories,
    });
  } catch (error) {
    console.error('Error obteniendo categorias:', error);

    return NextResponse.json(
      { error: 'Error al obtener categorias' },
      { status: 500 }
    );
  }
}
