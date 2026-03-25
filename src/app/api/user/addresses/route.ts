import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const addressSchema = z.object({
  label: z.string().min(1).max(100),
  street: z.string().min(1).max(200),
  number: z.string().min(1).max(20),
  floor: z.string().max(10).optional().nullable(),
  apartment: z.string().max(10).optional().nullable(),
  city: z.string().min(1).max(100),
  province: z.string().min(1).max(100),
  postalCode: z.string().min(1).max(10),
  isDefault: z.boolean().optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json(addresses)
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json(
      { error: 'Error al obtener direcciones' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validation = addressSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos invalidos', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { label, street, number, floor, apartment, city, province, postalCode, isDefault } = validation.data

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      })
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: session.user.id,
        label,
        street,
        number,
        floor,
        apartment,
        city,
        province,
        postalCode,
        isDefault: isDefault || false,
      },
    })

    return NextResponse.json(newAddress, { status: 201 })
  } catch (error) {
    console.error('Error creating address:', error)
    return NextResponse.json(
      { error: 'Error al crear direccion' },
      { status: 500 }
    )
  }
}
