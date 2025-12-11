import { Metadata } from 'next'
import prisma from '@/lib/prisma'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kuro.com.ar'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug, isActive: true },
      include: {
        category: true,
        images: { orderBy: { order: 'asc' }, take: 1 },
      },
    })

    if (!product) {
      return {
        title: 'Producto no encontrado',
        description: 'El producto que buscas no existe o fue eliminado.',
      }
    }

    const imageUrl = product.images[0]?.url || `${BASE_URL}/images/placeholder.jpg`

    return {
      title: product.name,
      description: product.description.substring(0, 160),
      keywords: [
        product.name,
        product.category?.name || 'ropa',
        'streetwear',
        'ropa alternativa',
        'KURO',
      ],
      openGraph: {
        title: `${product.name} | KURO`,
        description: product.description.substring(0, 160),
        url: `${BASE_URL}/producto/${product.slug}`,
        siteName: 'KURO',
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 800,
            alt: product.name,
          },
        ],
        locale: 'es_AR',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description: product.description.substring(0, 160),
        images: [imageUrl],
      },
      alternates: {
        canonical: `${BASE_URL}/producto/${product.slug}`,
      },
    }
  } catch (error) {
    return {
      title: 'KURO - Producto',
      description: 'Tienda de ropa alternativa y streetwear japonés',
    }
  }
}

export { generateMetadata as generateProductMetadata }
