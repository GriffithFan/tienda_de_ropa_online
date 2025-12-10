import { v2 as cloudinary } from 'cloudinary';

// Configuracion de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

/**
 * Opciones de transformacion para imagenes de productos
 */
export const productImageTransform = {
  thumbnail: {
    width: 300,
    height: 400,
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto',
    format: 'webp',
  },
  card: {
    width: 600,
    height: 800,
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto',
    format: 'webp',
  },
  full: {
    width: 1200,
    height: 1600,
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto',
    format: 'webp',
  },
};

/**
 * Genera URL optimizada de Cloudinary
 */
export function getOptimizedImageUrl(
  publicId: string,
  transform: keyof typeof productImageTransform = 'card'
): string {
  const options = productImageTransform[transform];
  return cloudinary.url(publicId, options);
}

/**
 * Sube una imagen a Cloudinary
 */
export async function uploadImage(
  file: string | Buffer,
  folder: string = 'products'
): Promise<{ url: string; publicId: string }> {
  try {
    const result = await cloudinary.uploader.upload(
      typeof file === 'string' ? file : `data:image/jpeg;base64,${file.toString('base64')}`,
      {
        folder: `kuro/${folder}`,
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 1600, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      }
    );

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Error subiendo imagen a Cloudinary:', error);
    throw new Error('Error al subir la imagen');
  }
}

/**
 * Elimina una imagen de Cloudinary
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Error eliminando imagen de Cloudinary:', error);
    return false;
  }
}

/**
 * Sube multiples imagenes
 */
export async function uploadMultipleImages(
  files: (string | Buffer)[],
  folder: string = 'products'
): Promise<{ url: string; publicId: string }[]> {
  const results = await Promise.all(
    files.map((file) => uploadImage(file, folder))
  );
  return results;
}
