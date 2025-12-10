'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  GripVertical,
  FolderOpen,
  Loader2,
  X,
  Save,
  Image as ImageIcon
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  order: number;
  isActive: boolean;
  _count?: { products: number };
}

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    isActive: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        image: category.image || '',
        isActive: category.isActive,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        image: '',
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: editingCategory ? formData.slug : generateSlug(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingCategory 
        ? `/api/admin/categories/${editingCategory.id}`
        : '/api/admin/categories';
      
      const res = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchCategories();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estas seguro de eliminar esta categoria?')) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchCategories();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Categorias</h1>
          <p className="text-accent-muted text-sm mt-1">
            Gestiona las categorias de productos
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn-primary"
        >
          <Plus className="w-5 h-5" />
          Nueva Categoria
        </button>
      </div>

      {/* Lista de categorias */}
      <div className="card">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 mx-auto text-accent-muted mb-4" />
            <p className="text-accent-muted">No hay categorias creadas</p>
            <button
              onClick={() => openModal()}
              className="btn-secondary mt-4"
            >
              Crear primera categoria
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-4 hover:bg-surface/50"
              >
                {/* Drag handle */}
                <button className="p-1 text-accent-muted hover:text-accent cursor-grab">
                  <GripVertical className="w-5 h-5" />
                </button>

                {/* Imagen */}
                <div className="w-16 h-16 rounded-lg bg-surface overflow-hidden flex-shrink-0">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-accent-muted" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium truncate">{category.name}</h3>
                    {!category.isActive && (
                      <span className="px-2 py-0.5 bg-warning/20 text-warning text-xs rounded">
                        Inactiva
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-accent-muted truncate">
                    /{category.slug} - {category._count?.products || 0} productos
                  </p>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal(category)}
                    className="p-2 hover:bg-surface rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 hover:bg-error/20 text-error rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="font-display text-xl font-semibold">
                  {editingCategory ? 'Editar Categoria' : 'Nueva Categoria'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-surface rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="input-field"
                    placeholder="Ej: Remeras"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Slug (URL)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="input-field font-mono"
                    placeholder="ej-remeras"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Descripcion</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field min-h-[80px]"
                    placeholder="Descripcion opcional de la categoria"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">URL de Imagen</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="input-field"
                    placeholder="https://..."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-border"
                  />
                  <label htmlFor="isActive" className="text-sm">
                    Categoria activa (visible en la tienda)
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary flex-1"
                  >
                    {saving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Guardar
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
