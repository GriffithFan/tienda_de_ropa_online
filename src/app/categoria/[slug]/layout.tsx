import { Metadata } from 'next'
import prisma from '@/lib/prisma'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kuro.com.ar'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: params.slug, isActive: true },
    })

    if (!category) {
      return {
        title: 'Categoría no encontrada',
        description: 'La categoría que buscas no existe.',
      }
    }

    return {
      title: `${category.name} | KURO`,
      description: category.description || `Explora nuestra colección de ${category.name}. Ropa alternativa y streetwear japonés de alta calidad.`,
      keywords: [
        category.name,
        'ropa alternativa',
        'streetwear',
        'KURO',
        'moda japonesa',
      ],
      openGraph: {
        title: `${category.name} | KURO`,
        description: category.description || `Colección de ${category.name}`,
        url: `${BASE_URL}/categoria/${category.slug}`,
        siteName: 'KURO',
        locale: 'es_AR',
        type: 'website',
      },
      alternates: {
        canonical: `${BASE_URL}/categoria/${category.slug}`,
      },
    }
  } catch (error) {
    return {
      title: 'KURO - Categoría',
      description: 'Tienda de ropa alternativa y streetwear japonés',
    }
  }
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
