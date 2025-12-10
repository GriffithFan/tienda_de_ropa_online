import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }

  return handler(request);
}

export async function withAdmin(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }

  if (token.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Acceso denegado' },
      { status: 403 }
    );
  }

  return handler(request);
}
