import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { uploadImage, deleteImage } from '@/lib/cloudinary';

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
    
    // Aceptar tanto 'file' (singular) como 'files' (plural)
    const singleFile = formData.get('file') as File | null;
    const multipleFiles = formData.getAll('files') as File[];
    
    const files: File[] = singleFile ? [singleFile] : multipleFiles;
    const folder = formData.get('folder') as string || 'products';

    if (!files || files.length === 0 || (files.length === 1 && !files[0]?.name)) {
      return NextResponse.json(
        { error: 'No se proporcionaron archivos' },
        { status: 400 }
      );
    }

    // Validar tipos de archivo - ser mas permisivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    for (const file of files) {
      if (!file.type || (!allowedTypes.includes(file.type) && !file.type.startsWith('image/'))) {
        return NextResponse.json(
          { error: `Tipo de archivo no permitido: ${file.type || 'desconocido'}. Use JPG, PNG, WebP o GIF.` },
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

    // Si es un solo archivo, devolver url directamente para compatibilidad
    if (results.length === 1) {
      return NextResponse.json({
        success: true,
        url: results[0].url,
        publicId: results[0].publicId,
        images: results,
      });
    }

    return NextResponse.json({
      success: true,
      images: results,
    });
  } catch (error) {
    console.error('Error en upload:', error);
    return NextResponse.json(
      { error: 'Error al subir las imagenes', details: error instanceof Error ? error.message : 'Unknown error' },
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
