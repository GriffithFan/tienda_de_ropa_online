'use client'

import { useEffect, useState } from 'react'
import { 
  Search, 
  Eye,
  Package,
  X,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Filter
} from 'lucide-react'

interface OrderItem {
  id: string
  quantity: number
  price: number
  size: string | null
  color: string | null
  product: {
    id: string
    name: string
    images: string[]
  }
}

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentMethod: string
  shippingMethod: string
  subtotal: number
  shippingCost: number
  total: number
  notes: string | null
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string | null
    email: string
  }
  shippingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    province: string
    postalCode: string
    phone: string
  } | null
  items: OrderItem[]
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  CONFIRMED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  PROCESSING: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  SHIPPED: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  DELIVERED: 'bg-green-500/20 text-green-400 border-green-500/30',
  CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
}

const statusLabels: Record<string, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  PROCESSING: 'Procesando',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
}

const statusIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  PENDING: Clock,
  CONFIRMED: CheckCircle,
  PROCESSING: Package,
  SHIPPED: Truck,
  DELIVERED: CheckCircle,
  CANCELLED: XCircle,
}

const paymentMethodLabels: Record<string, string> = {
  MERCADOPAGO: 'MercadoPago',
  TRANSFER: 'Transferencia',
  CASH: 'Efectivo',
}

const shippingMethodLabels: Record<string, string> = {
  STANDARD: 'Envio estandar',
  EXPRESS: 'Envio express',
  PICKUP: 'Retiro en tienda',
}

export default function AdminPedidos() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [searchQuery, statusFilter])

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (statusFilter) params.set('status', statusFilter)
      
      const res = await fetch(`/api/admin/orders?${params}`)
      if (!res.ok) throw new Error('Error al cargar pedidos')
      const data = await res.json()
      setOrders(data.orders || data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error('Error al actualizar estado')

      await fetchOrders()
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
    } catch (err) {
      console.error(err)
      alert('Error al actualizar el estado del pedido')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Pedidos</h1>
        <p className="text-zinc-400 mt-1">
          Gestiona los pedidos de la tienda
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por numero de pedido o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-600 appearance-none"
          >
            <option value="">Todos los estados</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
                <th className="px-5 py-4">Pedido</th>
                <th className="px-5 py-4">Cliente</th>
                <th className="px-5 py-4">Fecha</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Estado</th>
                <th className="px-5 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-zinc-500">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No se encontraron pedidos</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const StatusIcon = statusIcons[order.status] || Clock
                  return (
                    <tr key={order.id} className="hover:bg-zinc-800/50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-white">
                          {order.orderNumber}
                        </p>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-white">
                          {order.user.name || 'Sin nombre'}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {order.user.email}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-zinc-400">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-white">
                          ${order.total.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${
                          statusColors[order.status] || 'bg-zinc-700 text-zinc-300 border-zinc-600'
                        }`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusLabels[order.status] || order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/80 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-3xl my-8">
            <div className="flex items-center justify-between p-5 border-b border-zinc-800">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Pedido {selectedOrder.orderNumber}
                </h2>
                <p className="text-sm text-zinc-500 mt-0.5">
                  {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-6">
              {/* Status Update */}
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <label className="block text-sm font-medium text-zinc-300 mb-3">
                  Estado del pedido
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(statusLabels).map(([value, label]) => {
                    const StatusIcon = statusIcons[value] || Clock
                    const isActive = selectedOrder.status === value
                    return (
                      <button
                        key={value}
                        onClick={() => updateOrderStatus(selectedOrder.id, value)}
                        disabled={updatingStatus || isActive}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors disabled:opacity-50 ${
                          isActive
                            ? statusColors[value]
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-500'
                        }`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-zinc-300 mb-3">
                    Informacion del cliente
                  </h3>
                  <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2">
                    <p className="text-sm text-white">
                      {selectedOrder.user.name || 'Sin nombre'}
                    </p>
                    <p className="text-sm text-zinc-400">
                      {selectedOrder.user.email}
                    </p>
                  </div>
                </div>

                {selectedOrder.shippingAddress && (
                  <div>
                    <h3 className="text-sm font-medium text-zinc-300 mb-3">
                      Direccion de envio
                    </h3>
                    <div className="bg-zinc-800/50 rounded-lg p-4 space-y-1">
                      <p className="text-sm text-white">
                        {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                      </p>
                      <p className="text-sm text-zinc-400">
                        {selectedOrder.shippingAddress.address}
                      </p>
                      <p className="text-sm text-zinc-400">
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.province}
                      </p>
                      <p className="text-sm text-zinc-400">
                        CP: {selectedOrder.shippingAddress.postalCode}
                      </p>
                      <p className="text-sm text-zinc-400">
                        Tel: {selectedOrder.shippingAddress.phone}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-sm font-medium text-zinc-300 mb-3">
                  Productos
                </h3>
                <div className="bg-zinc-800/50 rounded-lg divide-y divide-zinc-700">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4">
                      <div className="w-16 h-16 bg-zinc-700 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.images[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-zinc-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {item.product.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                          {item.size && <span>Talla: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                          <span>Cant: {item.quantity}</span>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-white">
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-zinc-300 mb-3">
                    Detalles del pedido
                  </h3>
                  <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Metodo de pago</span>
                      <span className="text-white">
                        {paymentMethodLabels[selectedOrder.paymentMethod] || selectedOrder.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Metodo de envio</span>
                      <span className="text-white">
                        {shippingMethodLabels[selectedOrder.shippingMethod] || selectedOrder.shippingMethod}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-zinc-300 mb-3">
                    Resumen
                  </h3>
                  <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Subtotal</span>
                      <span className="text-white">${selectedOrder.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Envio</span>
                      <span className="text-white">
                        {selectedOrder.shippingCost === 0 ? 'Gratis' : `$${selectedOrder.shippingCost.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-medium pt-2 border-t border-zinc-700">
                      <span className="text-white">Total</span>
                      <span className="text-white">${selectedOrder.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="text-sm font-medium text-zinc-300 mb-3">
                    Notas
                  </h3>
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <p className="text-sm text-zinc-400">{selectedOrder.notes}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-zinc-800">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 border border-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
