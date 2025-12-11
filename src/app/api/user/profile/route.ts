import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { firstName, lastName, phone } = body

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone && { phone }),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Error al actualizar perfil' },
      { status: 500 }
    )
  }
}
