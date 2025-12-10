'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit2,
  Save,
  ArrowUpDown,
  Filter,
  Download,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductStock {
  id: string;
  name: string;
  sku: string;
  image: string;
  category: string;
  variants: {
    id: string;
    size: string;
    color: string;
    stock: number;
    lowStockThreshold: number;
  }[];
  totalStock: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

// Datos de ejemplo
const mockProducts: ProductStock[] = [
  {
    id: '1',
    name: 'Camiseta Oversized Gothic',
    sku: 'TSH-001',
    image: '/products/shirt-1.jpg',
    category: 'Camisetas',
    variants: [
      { id: 'v1', size: 'S', color: 'Negro', stock: 15, lowStockThreshold: 5 },
      { id: 'v2', size: 'M', color: 'Negro', stock: 3, lowStockThreshold: 5 },
      { id: 'v3', size: 'L', color: 'Negro', stock: 20, lowStockThreshold: 5 },
      { id: 'v4', size: 'XL', color: 'Negro', stock: 0, lowStockThreshold: 5 },
    ],
    totalStock: 38,
    status: 'low_stock',
  },
  {
    id: '2',
    name: 'Hoodie Techwear Straps',
    sku: 'HDI-002',
    image: '/products/hoodie-1.jpg',
    category: 'Hoodies',
    variants: [
      { id: 'v5', size: 'M', color: 'Negro', stock: 8, lowStockThreshold: 3 },
      { id: 'v6', size: 'L', color: 'Negro', stock: 12, lowStockThreshold: 3 },
    ],
    totalStock: 20,
    status: 'in_stock',
  },
  {
    id: '3',
    name: 'Pantalón Cargo Wide',
    sku: 'PNT-003',
    image: '/products/pants-1.jpg',
    category: 'Pantalones',
    variants: [
      { id: 'v7', size: '28', color: 'Negro', stock: 0, lowStockThreshold: 5 },
      { id: 'v8', size: '30', color: 'Negro', stock: 0, lowStockThreshold: 5 },
      { id: 'v9', size: '32', color: 'Negro', stock: 0, lowStockThreshold: 5 },
    ],
    totalStock: 0,
    status: 'out_of_stock',
  },
  {
    id: '4',
    name: 'Camiseta Visual Kei',
    sku: 'TSH-004',
    image: '/products/shirt-2.jpg',
    category: 'Camisetas',
    variants: [
      { id: 'v10', size: 'S', color: 'Blanco', stock: 25, lowStockThreshold: 5 },
      { id: 'v11', size: 'M', color: 'Blanco', stock: 30, lowStockThreshold: 5 },
      { id: 'v12', size: 'L', color: 'Blanco', stock: 18, lowStockThreshold: 5 },
    ],
    totalStock: 73,
    status: 'in_stock',
  },
];

export default function InventarioPage() {
  const [products, setProducts] = useState<ProductStock[]>(mockProducts);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'status'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [editingVariant, setEditingVariant] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Estadísticas
  const stats = {
    totalProducts: products.length,
    inStock: products.filter((p) => p.status === 'in_stock').length,
    lowStock: products.filter((p) => p.status === 'low_stock').length,
    outOfStock: products.filter((p) => p.status === 'out_of_stock').length,
    totalUnits: products.reduce((sum, p) => sum + p.totalStock, 0),
  };

  // Filtrar y ordenar productos
  const filteredProducts = products
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'stock':
          comparison = a.totalStock - b.totalStock;
          break;
        case 'status':
          const statusOrder = { out_of_stock: 0, low_stock: 1, in_stock: 2 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const getStatusBadge = (status: ProductStock['status']) => {
    switch (status) {
      case 'in_stock':
        return (
          <span className="flex items-center gap-1 text-green-500 text-sm">
            <CheckCircle className="w-4 h-4" /> En stock
          </span>
        );
      case 'low_stock':
        return (
          <span className="flex items-center gap-1 text-amber-500 text-sm">
            <AlertTriangle className="w-4 h-4" /> Stock bajo
          </span>
        );
      case 'out_of_stock':
        return (
          <span className="flex items-center gap-1 text-red-500 text-sm">
            <XCircle className="w-4 h-4" /> Agotado
          </span>
        );
    }
  };

  const handleUpdateStock = (productId: string, variantId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id === productId) {
          const updatedVariants = product.variants.map((v) =>
            v.id === variantId ? { ...v, stock: newStock } : v
          );
          const totalStock = updatedVariants.reduce((sum, v) => sum + v.stock, 0);
          const hasOutOfStock = updatedVariants.some((v) => v.stock === 0);
          const hasLowStock = updatedVariants.some((v) => v.stock > 0 && v.stock <= v.lowStockThreshold);

          let status: ProductStock['status'] = 'in_stock';
          if (totalStock === 0) status = 'out_of_stock';
          else if (hasOutOfStock || hasLowStock) status = 'low_stock';

          return { ...product, variants: updatedVariants, totalStock, status };
        }
        return product;
      })
    );
    setEditingVariant(null);
    toast.success('Stock actualizado');
  };

  const exportToCSV = () => {
    const headers = ['SKU', 'Producto', 'Talla', 'Color', 'Stock', 'Estado'];
    const rows = products.flatMap((p) =>
      p.variants.map((v) => [p.sku, p.name, v.size, v.color, v.stock, p.status])
    );

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventario-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Inventario exportado');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Inventario</h1>
          <p className="text-zinc-400 mt-1">Control de stock de productos</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-zinc-800 text-white px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Package className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
              <p className="text-zinc-400 text-sm">Productos</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.inStock}</p>
              <p className="text-zinc-400 text-sm">En stock</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.lowStock}</p>
              <p className="text-zinc-400 text-sm">Stock bajo</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.outOfStock}</p>
              <p className="text-zinc-400 text-sm">Agotados</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Package className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalUnits}</p>
              <p className="text-zinc-400 text-sm">Unidades totales</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-white/20 focus:border-zinc-700"
          />
        </div>

        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-white/20"
          >
            <option value="all">Todos los estados</option>
            <option value="in_stock">En stock</option>
            <option value="low_stock">Stock bajo</option>
            <option value="out_of_stock">Agotados</option>
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split('-');
              setSortBy(by as 'name' | 'stock' | 'status');
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-white/20"
          >
            <option value="name-asc">Nombre A-Z</option>
            <option value="name-desc">Nombre Z-A</option>
            <option value="stock-asc">Menor stock</option>
            <option value="stock-desc">Mayor stock</option>
            <option value="status-asc">Urgentes primero</option>
            <option value="status-desc">En stock primero</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">
                  Producto
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">SKU</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">
                  Categoría
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-zinc-400">
                  Stock total
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-zinc-400">
                  Estado
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-zinc-400">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <>
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors cursor-pointer ${
                      expandedProduct === product.id ? 'bg-zinc-800/50' : ''
                    }`}
                    onClick={() =>
                      setExpandedProduct(expandedProduct === product.id ? null : product.id)
                    }
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                          <div className="w-full h-full flex items-center justify-center text-zinc-500">
                            <Package className="w-6 h-6" />
                          </div>
                        </div>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-zinc-400">{product.sku}</span>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">{product.category}</td>
                    <td className="px-6 py-4 text-center font-medium">{product.totalStock}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">{getStatusBadge(product.status)}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedProduct(
                            expandedProduct === product.id ? null : product.id
                          );
                        }}
                        className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
                      >
                        <ArrowUpDown className="w-4 h-4 text-zinc-400" />
                      </button>
                    </td>
                  </motion.tr>

                  {/* Expanded Variants */}
                  <AnimatePresence>
                    {expandedProduct === product.id && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <td colSpan={6} className="px-6 py-4 bg-zinc-800/30">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {product.variants.map((variant) => (
                              <div
                                key={variant.id}
                                className={`p-4 rounded-lg border ${
                                  variant.stock === 0
                                    ? 'bg-red-500/10 border-red-500/30'
                                    : variant.stock <= variant.lowStockThreshold
                                    ? 'bg-amber-500/10 border-amber-500/30'
                                    : 'bg-zinc-800 border-zinc-700'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium">
                                    {variant.size} / {variant.color}
                                  </span>
                                  {variant.stock === 0 ? (
                                    <XCircle className="w-4 h-4 text-red-500" />
                                  ) : variant.stock <= variant.lowStockThreshold ? (
                                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                                  ) : (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  )}
                                </div>

                                {editingVariant === variant.id ? (
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="number"
                                      value={editStock}
                                      onChange={(e) => setEditStock(Number(e.target.value))}
                                      min="0"
                                      className="w-20 px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white text-center"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdateStock(product.id, variant.id, editStock);
                                      }}
                                      className="p-2 bg-green-600 rounded-lg hover:bg-green-500 transition-colors"
                                    >
                                      <Save className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold">{variant.stock}</span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingVariant(variant.id);
                                        setEditStock(variant.stock);
                                      }}
                                      className="p-2 hover:bg-zinc-600 rounded-lg transition-colors"
                                    >
                                      <Edit2 className="w-4 h-4 text-zinc-400" />
                                    </button>
                                  </div>
                                )}

                                <p className="text-xs text-zinc-500 mt-2">
                                  Alerta: menos de {variant.lowStockThreshold} unidades
                                </p>
                              </div>
                            ))}
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-zinc-400">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No se encontraron productos</p>
          </div>
        )}
      </div>

      {/* Low Stock Alerts */}
      {stats.outOfStock > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-red-400">
                ¡Atención! {stats.outOfStock} producto(s) agotado(s)
              </h3>
              <p className="text-zinc-400 mt-1">
                Los siguientes productos están sin stock y no pueden ser vendidos:
              </p>
              <ul className="mt-3 space-y-1">
                {products
                  .filter((p) => p.status === 'out_of_stock')
                  .map((p) => (
                    <li key={p.id} className="text-red-300">
                      • {p.name} ({p.sku})
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
