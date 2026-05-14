import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { uploadImage, deleteImage } from '@/lib/cloudinary';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const MAX_UPLOAD_FILES = 8;
const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;
const allowedTypes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']);

function sanitizeFolder(folder: FormDataEntryValue | null) {
  if (typeof folder !== 'string') return 'products';

  const normalized = folder.trim().toLowerCase().replace(/[^a-z0-9/_-]/g, '').replace(/\/+/g, '/');
  return normalized && !normalized.startsWith('/') && !normalized.includes('..') ? normalized : 'products';
}

/**
 * POST /api/upload
 * Sube una o varias imagenes a Cloudinary
 */
export async function POST(request: NextRequest) {
  try {
    const limited = rateLimit(request, {
      keyPrefix: 'upload:post',
      limit: 20,
      windowMs: 60_000,
    });

    if (limited) return limited;

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
    const folder = sanitizeFolder(formData.get('folder'));

    if (!files || files.length === 0 || (files.length === 1 && !files[0]?.name)) {
      return NextResponse.json(
        { error: 'No se proporcionaron archivos' },
        { status: 400 }
      );
    }

    if (files.length > MAX_UPLOAD_FILES) {
      return NextResponse.json(
        { error: `Solo se pueden subir hasta ${MAX_UPLOAD_FILES} imagenes por solicitud` },
        { status: 400 }
      );
    }

    for (const file of files) {
      if (!file.type || !allowedTypes.has(file.type)) {
        return NextResponse.json(
          { error: `Tipo de archivo no permitido: ${file.type || 'desconocido'}. Use JPG, PNG, WebP o GIF.` },
          { status: 400 }
        );
      }
      // Limitar tamaño a 10MB
      if (file.size > MAX_UPLOAD_SIZE) {
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
    const limited = rateLimit(request, {
      keyPrefix: 'upload:delete',
      limit: 40,
      windowMs: 60_000,
    });

    if (limited) return limited;

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
