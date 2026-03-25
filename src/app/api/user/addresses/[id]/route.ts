import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const addressUpdateSchema = z.object({
  label: z.string().min(1).max(100).optional(),
  street: z.string().min(1).max(200).optional(),
  number: z.string().min(1).max(20).optional(),
  floor: z.string().max(10).optional().nullable(),
  apartment: z.string().max(10).optional().nullable(),
  city: z.string().min(1).max(100).optional(),
  province: z.string().min(1).max(100).optional(),
  postalCode: z.string().min(1).max(10).optional(),
  isDefault: z.boolean().optional(),
})

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
    const validation = addressUpdateSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos invalidos', details: validation.error.errors },
        { status: 400 }
      )
    }

    const validatedData = validation.data

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
    if (validatedData.isDefault) {
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
        label: validatedData.label ?? existingAddress.label,
        street: validatedData.street ?? existingAddress.street,
        number: validatedData.number ?? existingAddress.number,
        floor: validatedData.floor ?? existingAddress.floor,
        apartment: validatedData.apartment ?? existingAddress.apartment,
        city: validatedData.city ?? existingAddress.city,
        province: validatedData.province ?? existingAddress.province,
        postalCode: validatedData.postalCode ?? existingAddress.postalCode,
        isDefault: validatedData.isDefault ?? existingAddress.isDefault,
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
