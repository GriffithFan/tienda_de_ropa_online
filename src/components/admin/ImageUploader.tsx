'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface UploadedImage {
  url: string;
  publicId: string;
}

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  folder?: string;
}

export default function ImageUploader({
  images,
  onImagesChange,
  maxImages = 5,
  folder = 'products',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (files: FileList) => {
    if (files.length === 0) return;
    if (images.length + files.length > maxImages) {
      setError(`Maximo ${maxImages} imagenes permitidas`);
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });
    formData.append('folder', folder);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al subir imagenes');
      }

      const data = await response.json();
      const newUrls = data.images.map((img: UploadedImage) => img.url);
      onImagesChange([...images, ...newUrls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir imagenes');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files);
    }
  }, [images]);

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const newImages = [...images];
    const [removed] = newImages.splice(from, 1);
    newImages.splice(to, 0, removed);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Zona de drop */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-colors
          ${dragActive ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'}
          ${uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        `}
      >
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading || images.length >= maxImages}
        />
        
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <span className="text-sm text-accent-muted">Subiendo imagenes...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-accent-muted" />
            <span className="text-sm text-accent-muted">
              Arrastra imagenes o haz clic para seleccionar
            </span>
            <span className="text-xs text-accent-muted">
              JPG, PNG, WebP (max 10MB) - {images.length}/{maxImages}
            </span>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-error"
        >
          {error}
        </motion.p>
      )}

      {/* Preview de imagenes */}
      <AnimatePresence>
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
          >
            {images.map((url, index) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-[3/4] rounded-lg overflow-hidden group bg-surface"
              >
                <img
                  src={url}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {/* Mover izquierda */}
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => moveImage(index, index - 1)}
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                      title="Mover izquierda"
                    >
                      <span className="text-white">←</span>
                    </button>
                  )}
                  
                  {/* Mover derecha */}
                  {index < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveImage(index, index + 1)}
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                      title="Mover derecha"
                    >
                      <span className="text-white">→</span>
                    </button>
                  )}
                  
                  {/* Eliminar */}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-2 bg-red-500/80 rounded-lg hover:bg-red-500 transition-colors"
                    title="Eliminar"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
                
                {/* Badge de principal */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-accent text-background text-xs font-medium rounded">
                    Principal
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
