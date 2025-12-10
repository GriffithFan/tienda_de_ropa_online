'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Mail, 
  Phone,
  MapPin,
  ShoppingBag,
  Shield,
  ShieldCheck,
  Calendar,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  role: 'CUSTOMER' | 'ADMIN';
  createdAt: string;
  _count: {
    orders: number;
    addresses: number;
  };
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });
      if (roleFilter) params.append('role', roleFilter);
      if (search) params.append('search', search);

      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      setUsers(data.users || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const toggleRole = async (userId: string, newRole: 'CUSTOMER' | 'ADMIN') => {
    if (!confirm(`¿Cambiar rol a ${newRole}?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold">Usuarios</h1>
        <p className="text-accent-muted text-sm mt-1">
          Gestiona los usuarios registrados
        </p>
      </div>

      {/* Filtros */}
      <div className="card p-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-muted" />
            <input
              type="text"
              placeholder="Buscar por email o nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="input-field sm:w-40"
          >
            <option value="">Todos los roles</option>
            <option value="CUSTOMER">Clientes</option>
            <option value="ADMIN">Admins</option>
          </select>
          <button type="submit" className="btn-primary">
            Buscar
          </button>
        </form>
      </div>

      {/* Tabla */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto text-accent-muted mb-4" />
            <p className="text-accent-muted">No se encontraron usuarios</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface border-b border-border">
                  <tr>
                    <th className="text-left p-4 font-medium text-accent-muted">Usuario</th>
                    <th className="text-left p-4 font-medium text-accent-muted">Contacto</th>
                    <th className="text-center p-4 font-medium text-accent-muted">Pedidos</th>
                    <th className="text-center p-4 font-medium text-accent-muted">Rol</th>
                    <th className="text-left p-4 font-medium text-accent-muted">Registro</th>
                    <th className="text-right p-4 font-medium text-accent-muted">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-surface/50"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-medium">
                            {user.firstName && user.lastName 
                              ? `${user.firstName} ${user.lastName}`
                              : 'Sin nombre'}
                          </p>
                          <p className="text-sm text-accent-muted">{user.email}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {user.phone ? (
                            <span className="flex items-center gap-1 text-sm">
                              <Phone className="w-4 h-4 text-accent-muted" />
                              {user.phone}
                            </span>
                          ) : (
                            <span className="text-sm text-accent-muted">-</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1">
                          <ShoppingBag className="w-4 h-4 text-accent-muted" />
                          {user._count.orders}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => toggleRole(
                            user.id, 
                            user.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN'
                          )}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                            user.role === 'ADMIN'
                              ? 'bg-primary/20 text-primary'
                              : 'bg-surface text-accent-muted'
                          }`}
                        >
                          {user.role === 'ADMIN' ? (
                            <>
                              <ShieldCheck className="w-3 h-3" />
                              Admin
                            </>
                          ) : (
                            <>
                              <Shield className="w-3 h-3" />
                              Cliente
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-1 text-sm text-accent-muted">
                          <Calendar className="w-4 h-4" />
                          {formatDate(user.createdAt)}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-2 hover:bg-surface rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginacion */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-border">
                <p className="text-sm text-accent-muted">
                  Pagina {page} de {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                    className="btn-secondary"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                    className="btn-secondary"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de detalles (simplificado) */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setSelectedUser(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl w-full max-w-md p-6"
          >
            <h2 className="font-display text-xl font-semibold mb-4">
              Detalles del Usuario
            </h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-accent-muted">Nombre</p>
                <p className="font-medium">
                  {selectedUser.firstName} {selectedUser.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-accent-muted">Email</p>
                <p className="font-medium">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-sm text-accent-muted">Telefono</p>
                <p className="font-medium">{selectedUser.phone || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-accent-muted">Pedidos realizados</p>
                <p className="font-medium">{selectedUser._count.orders}</p>
              </div>
              <div>
                <p className="text-sm text-accent-muted">Direcciones guardadas</p>
                <p className="font-medium">{selectedUser._count.addresses}</p>
              </div>
              <div>
                <p className="text-sm text-accent-muted">Fecha de registro</p>
                <p className="font-medium">{formatDate(selectedUser.createdAt)}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="btn-secondary w-full mt-6"
            >
              Cerrar
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
