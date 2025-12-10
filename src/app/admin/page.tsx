'use client'

import { useEffect, useState } from 'react'
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import Link from 'next/link'

interface Stats {
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  totalUsers: number
  recentOrders: Array<{
    id: string
    orderNumber: string
    total: number
    status: string
    createdAt: string
    user: { name: string; email: string }
  }>
  topProducts: Array<{
    id: string
    name: string
    _count: { orderItems: number }
  }>
  ordersByStatus: Record<string, number>
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-400',
  CONFIRMED: 'bg-blue-500/20 text-blue-400',
  PROCESSING: 'bg-purple-500/20 text-purple-400',
  SHIPPED: 'bg-cyan-500/20 text-cyan-400',
  DELIVERED: 'bg-green-500/20 text-green-400',
  CANCELLED: 'bg-red-500/20 text-red-400',
}

const statusLabels: Record<string, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  PROCESSING: 'Procesando',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats')
        if (!res.ok) throw new Error('Error al cargar estadisticas')
        const data = await res.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
        <p className="text-red-400">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (!stats) return null

  const statCards = [
    {
      title: 'Ingresos totales',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: '+12.5%',
      positive: true,
    },
    {
      title: 'Pedidos',
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      change: '+8.2%',
      positive: true,
    },
    {
      title: 'Productos',
      value: stats.totalProducts.toString(),
      icon: Package,
      change: '0%',
      positive: true,
    },
    {
      title: 'Usuarios',
      value: stats.totalUsers.toString(),
      icon: Users,
      change: '+15.3%',
      positive: true,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 mt-1">
          Bienvenido al panel de administracion
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 bg-zinc-800 rounded-lg">
                  <Icon className="w-5 h-5 text-zinc-400" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  stat.positive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.positive ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-zinc-500 mt-1">{stat.title}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="flex items-center justify-between p-5 border-b border-zinc-800">
            <h2 className="text-lg font-semibold text-white">Pedidos recientes</h2>
            <Link
              href="/admin/pedidos"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Ver todos
            </Link>
          </div>
          <div className="divide-y divide-zinc-800">
            {stats.recentOrders.length === 0 ? (
              <div className="p-5 text-center text-zinc-500">
                No hay pedidos recientes
              </div>
            ) : (
              stats.recentOrders.map((order) => (
                <div key={order.id} className="p-4 hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {order.orderNumber}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {order.user.name || order.user.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">
                        ${order.total.toLocaleString()}
                      </p>
                      <span className={`inline-block px-2 py-0.5 text-xs rounded-full mt-1 ${
                        statusColors[order.status] || 'bg-zinc-700 text-zinc-300'
                      }`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="p-5 border-b border-zinc-800">
            <h2 className="text-lg font-semibold text-white">Estado de pedidos</h2>
          </div>
          <div className="p-5 space-y-4">
            {Object.entries(stats.ordersByStatus).length === 0 ? (
              <div className="text-center text-zinc-500">
                No hay datos de pedidos
              </div>
            ) : (
              Object.entries(stats.ordersByStatus).map(([status, count]) => {
                const percentage = stats.totalOrders > 0 
                  ? Math.round((count / stats.totalOrders) * 100) 
                  : 0
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-zinc-400">
                        {statusLabels[status] || status}
                      </span>
                      <span className="text-white font-medium">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          status === 'DELIVERED' ? 'bg-green-500' :
                          status === 'CANCELLED' ? 'bg-red-500' :
                          status === 'SHIPPED' ? 'bg-cyan-500' :
                          status === 'PROCESSING' ? 'bg-purple-500' :
                          status === 'CONFIRMED' ? 'bg-blue-500' :
                          'bg-yellow-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl lg:col-span-2">
          <div className="flex items-center justify-between p-5 border-b border-zinc-800">
            <h2 className="text-lg font-semibold text-white">Productos mas vendidos</h2>
            <Link
              href="/admin/productos"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Ver todos
            </Link>
          </div>
          <div className="overflow-x-auto">
            {stats.topProducts.length === 0 ? (
              <div className="p-5 text-center text-zinc-500">
                No hay datos de productos
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-zinc-500 uppercase tracking-wider">
                    <th className="px-5 py-3">Producto</th>
                    <th className="px-5 py-3 text-right">Ventas</th>
                    <th className="px-5 py-3 text-right">Tendencia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {stats.topProducts.map((product, index) => (
                    <tr key={product.id} className="hover:bg-zinc-800/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-zinc-500">
                            #{index + 1}
                          </span>
                          <span className="text-sm text-white">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="text-sm text-white">
                          {product._count.orderItems}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-1 text-green-400">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
