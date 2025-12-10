import { NextRequest, NextResponse } from 'next/server';
import { products, categories } from '@/data/products';

/**
 * GET /api/products
 * Obtiene la lista de productos con filtros opcionales
 * 
 * Query params:
 * - category: slug de la categoria
 * - size: talle (XS, S, M, L, XL)
 * - color: color del producto
 * - minPrice: precio minimo
 * - maxPrice: precio maximo
 * - sort: ordenamiento (price-asc, price-desc, newest)
 * - page: numero de pagina
 * - limit: productos por pagina
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Obtener parametros de filtrado
    const category = searchParams.get('category');
    const size = searchParams.get('size');
    const color = searchParams.get('color');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // Filtrar productos
    let filteredProducts = [...products];

    // Filtro por categoria
    if (category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === category
      );
    }

    // Filtro por talle
    if (size) {
      filteredProducts = filteredProducts.filter((product) =>
        product.sizes.includes(size)
      );
    }

    // Filtro por color
    if (color) {
      filteredProducts = filteredProducts.filter((product) =>
        product.colors.some((c) => c.name.toLowerCase() === color.toLowerCase())
      );
    }

    // Filtro por precio minimo
    if (minPrice) {
      const min = parseFloat(minPrice);
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= min
      );
    }

    // Filtro por precio maximo
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      filteredProducts = filteredProducts.filter(
        (product) => product.price <= max
      );
    }

    // Ordenamiento
    switch (sort) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        // Asumimos que los productos mas nuevos estan primero en el array
        break;
    }

    // Paginacion
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return NextResponse.json({
      products: paginatedProducts,
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
