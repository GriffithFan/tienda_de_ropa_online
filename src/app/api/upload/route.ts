import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { uploadImage, deleteImage, uploadMultipleImages } from '@/lib/cloudinary';

/**
 * POST /api/upload
 * Sube una o varias imagenes a Cloudinary
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticacion y permisos de admin
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const folder = formData.get('folder') as string || 'products';

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No se proporcionaron archivos' },
        { status: 400 }
      );
    }

    // Validar tipos de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Tipo de archivo no permitido: ${file.type}` },
          { status: 400 }
        );
      }
      // Limitar tamaño a 10MB
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'El archivo excede el tamaño maximo de 10MB' },
          { status: 400 }
        );
      }
    }

    // Convertir archivos a base64 y subir
    const uploadPromises = files.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
      return uploadImage(base64, folder);
    });

    const results = await Promise.all(uploadPromises);

    return NextResponse.json({
      success: true,
      images: results,
    });
  } catch (error) {
    console.error('Error en upload:', error);
    return NextResponse.json(
      { error: 'Error al subir las imagenes' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/upload
 * Elimina una imagen de Cloudinary
 */
export async function DELETE(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json(
        { error: 'Se requiere publicId' },
        { status: 400 }
      );
    }

    const deleted = await deleteImage(publicId);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Error al eliminar la imagen' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error eliminando imagen:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la imagen' },
      { status: 500 }
    );
  }
}
