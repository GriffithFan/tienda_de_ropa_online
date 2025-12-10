import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { id } = await params

    const address = await prisma.address.findFirst({
      where: { 
        id,
        userId: session.user.id,
      },
    })

    if (!address) {
      return NextResponse.json(
        { error: 'Direccion no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(address)
  } catch (error) {
    console.error('Error fetching address:', error)
    return NextResponse.json(
      { error: 'Error al obtener direccion' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    // Verify ownership
    const existingAddress = await prisma.address.findFirst({
      where: { 
        id,
        userId: session.user.id,
      },
    })

    if (!existingAddress) {
      return NextResponse.json(
        { error: 'Direccion no encontrada' },
        { status: 404 }
      )
    }

    // If setting as default, unset other defaults
    if (body.isDefault) {
      await prisma.address.updateMany({
        where: { 
          userId: session.user.id,
          id: { not: id },
        },
        data: { isDefault: false },
      })
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: {
        firstName: body.firstName ?? existingAddress.firstName,
        lastName: body.lastName ?? existingAddress.lastName,
        address: body.address ?? existingAddress.address,
        city: body.city ?? existingAddress.city,
        province: body.province ?? existingAddress.province,
        postalCode: body.postalCode ?? existingAddress.postalCode,
        phone: body.phone ?? existingAddress.phone,
        isDefault: body.isDefault ?? existingAddress.isDefault,
      },
    })

    return NextResponse.json(updatedAddress)
  } catch (error) {
    console.error('Error updating address:', error)
    return NextResponse.json(
      { error: 'Error al actualizar direccion' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Verify ownership
    const existingAddress = await prisma.address.findFirst({
      where: { 
        id,
        userId: session.user.id,
      },
    })

    if (!existingAddress) {
      return NextResponse.json(
        { error: 'Direccion no encontrada' },
        { status: 404 }
      )
    }

    await prisma.address.delete({
      where: { id },
    })

    // If deleted address was default, set another as default
    if (existingAddress.isDefault) {
      const anotherAddress = await prisma.address.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
      })

      if (anotherAddress) {
        await prisma.address.update({
          where: { id: anotherAddress.id },
          data: { isDefault: true },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting address:', error)
    return NextResponse.json(
      { error: 'Error al eliminar direccion' },
      { status: 500 }
    )
  }
}
