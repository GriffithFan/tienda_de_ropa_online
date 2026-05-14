import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';

const newsletterSchema = z.object({
  email: z.string().email('Email invalido').max(255),
});

export async function POST(request: NextRequest) {
  try {
    const limited = rateLimit(request, {
      keyPrefix: 'newsletter:post',
      limit: 5,
      windowMs: 60_000,
    });

    if (limited) return limited;

    const body = await request.json();
    const validation = newsletterSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Email invalido', details: validation.error.errors },
        { status: 400 }
      );
    }

    const email = validation.data.email.trim().toLowerCase();

    await prisma.subscriber.upsert({
      where: { email },
      update: { isActive: true },
      create: { email },
    });

    return NextResponse.json({
      success: true,
      message: 'Suscripcion registrada',
    });
  } catch (error) {
    console.error('Error procesando newsletter:', error);
    return NextResponse.json(
      { error: 'Error al registrar la suscripcion' },
      { status: 500 }
    );
  }
}