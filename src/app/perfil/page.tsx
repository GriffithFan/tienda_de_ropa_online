'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSession, signOut } from 'next-auth/react';
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  ChevronRight,
  Edit2,
  Plus,
  Trash2,
  Loader2,
} from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';

/**
 * Schema de validacion para perfil
 */
const profileSchema = z.object({
  firstName: z.string().min(2, 'Nombre muy corto'),
  lastName: z.string().min(2, 'Apellido muy corto'),
  email: z.string().email('Email invalido'),
  phone: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

/**
 * Pagina de perfil de usuario
 * Muestra informacion personal, pedidos, direcciones y favoritos
 */
export default function PerfilPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>('profile');
  const { data: session, status } = useSession();
  const router = useRouter();

  // Mientras carga la sesión
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-muted" />
      </div>
    );
  }

  // Si no esta autenticado, redirigir a login
  if (!session?.user) {
    router.push('/auth/login');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-muted" />
      </div>
    );
  }

  const user = session.user;

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const tabs = [
    { id: 'profile', label: 'Mi Perfil', icon: User },
    { id: 'orders', label: 'Mis Pedidos', icon: Package },
    { id: 'addresses', label: 'Direcciones', icon: MapPin },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="container-custom py-8">
          <nav className="text-sm text-accent-muted mb-4">
            <Link href="/" className="hover:text-accent">
              Inicio
            </Link>
            <span className="mx-2">/</span>
            <span className="text-accent">Mi Cuenta</span>
          </nav>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent text-background flex items-center justify-center font-display font-bold text-xl">
                {user?.firstName?.charAt(0) || 'U'}
              </div>
              <div>
                <h1 className="font-display text-xl font-bold">
                  Hola, {user?.firstName || 'Usuario'}
                </h1>
                <p className="text-sm text-accent-muted">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-accent-muted hover:text-error transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesion
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={cn(
                    'w-full flex items-center justify-between p-3 rounded-lg transition-colors',
                    activeTab === tab.id
                      ? 'bg-surface text-accent'
                      : 'text-accent-muted hover:bg-surface/50'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ))}
              <Link
                href="/favoritos"
                className="w-full flex items-center justify-between p-3 rounded-lg transition-colors text-accent-muted hover:bg-surface/50"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5" />
                  <span>Favoritos</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'profile' && <ProfileSection user={user} />}
              {activeTab === 'orders' && <OrdersSection />}
              {activeTab === 'addresses' && <AddressesSection />}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}

/**
 * Seccion de perfil
 */
function ProfileSection({ user }: { user: any }) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = (data: ProfileForm) => {
    // TODO: Implementar llamada a API para actualizar perfil
    setIsEditing(false);
  };

  return (
    <div className="card p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold">Informacion Personal</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-sm text-accent-muted hover:text-accent flex items-center gap-2"
        >
          <Edit2 className="w-4 h-4" />
          {isEditing ? 'Cancelar' : 'Editar'}
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="input-group">
            <label className="input-label">Nombre</label>
            <input
              type="text"
              {...register('firstName')}
              disabled={!isEditing}
              className={cn(!isEditing && 'bg-surface cursor-not-allowed')}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Apellido</label>
            <input
              type="text"
              {...register('lastName')}
              disabled={!isEditing}
              className={cn(!isEditing && 'bg-surface cursor-not-allowed')}
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Email</label>
          <input
            type="email"
            {...register('email')}
            disabled={!isEditing}
            className={cn(!isEditing && 'bg-surface cursor-not-allowed')}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Telefono</label>
          <input
            type="tel"
            {...register('phone')}
            disabled={!isEditing}
            className={cn(!isEditing && 'bg-surface cursor-not-allowed')}
          />
        </div>

        {isEditing && (
          <button type="submit" className="btn-primary">
            Guardar cambios
          </button>
        )}
      </form>
    </div>
  );
}

/**
 * Seccion de pedidos
 */
function OrdersSection() {
  // Ejemplo de pedidos - en produccion vendrian de la API
  const orders = [
    {
      id: 'KURO-ABC123',
      date: '2024-12-08',
      status: 'delivered',
      total: 89900,
      items: 2,
    },
    {
      id: 'KURO-DEF456',
      date: '2024-12-05',
      status: 'shipped',
      total: 44900,
      items: 1,
    },
  ];

  const statusLabels = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  };

  const statusColors = {
    pending: 'text-warning',
    confirmed: 'text-blue-400',
    shipped: 'text-purple-400',
    delivered: 'text-success',
    cancelled: 'text-error',
  };

  if (orders.length === 0) {
    return (
      <div className="card p-8 text-center">
        <Package className="w-16 h-16 mx-auto text-accent-muted mb-4" />
        <h2 className="font-display text-xl font-bold mb-2">Sin pedidos</h2>
        <p className="text-accent-muted mb-6">
          Aun no realizaste ninguna compra
        </p>
        <Link href="/productos" className="btn-primary">
          Empezar a comprar
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold">Mis Pedidos</h2>
      
      {orders.map((order) => (
        <div key={order.id} className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono font-medium">{order.id}</p>
              <p className="text-sm text-accent-muted">
                {new Date(order.date).toLocaleDateString('es-AR')} • {order.items} producto{order.items !== 1 && 's'}
              </p>
            </div>
            <div className="text-right">
              <p className={cn('text-sm font-medium', statusColors[order.status as keyof typeof statusColors])}>
                {statusLabels[order.status as keyof typeof statusLabels]}
              </p>
              <p className="font-medium">{formatPrice(order.total)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Seccion de direcciones
 */
function AddressesSection() {
  const addresses = [
    {
      id: '1',
      label: 'Casa',
      street: 'Av. Corrientes',
      number: '1234',
      city: 'CABA',
      province: 'Buenos Aires',
      postalCode: '1043',
      isDefault: true,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Mis Direcciones</h2>
        <button className="btn-secondary text-sm">
          <Plus className="w-4 h-4" />
          Agregar
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="card p-8 text-center">
          <MapPin className="w-16 h-16 mx-auto text-accent-muted mb-4" />
          <h3 className="font-display text-lg font-bold mb-2">
            Sin direcciones guardadas
          </h3>
          <p className="text-accent-muted">
            Agrega una direccion para agilizar tus compras
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {addresses.map((address) => (
            <div key={address.id} className="card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-medium">{address.label}</p>
                    {address.isDefault && (
                      <span className="text-xs bg-accent text-background px-2 py-0.5 rounded">
                        Principal
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-accent-muted">
                    {address.street} {address.number}
                  </p>
                  <p className="text-sm text-accent-muted">
                    {address.city}, {address.province} ({address.postalCode})
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-accent-muted hover:text-accent transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-accent-muted hover:text-error transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
