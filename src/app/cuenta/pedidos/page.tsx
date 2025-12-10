'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle,
  ChevronRight,
  Eye,
  X
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
    slug: string
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
  createdAt: string
  items: OrderItem[]
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

const statusIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  PENDING: Clock,
  CONFIRMED: CheckCircle,
  PROCESSING: Package,
  SHIPPED: Truck,
  DELIVERED: CheckCircle,
  CANCELLED: XCircle,
}

export default function MisPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/user/orders')
        if (!res.ok) throw new Error('Error al cargar pedidos')
        const data = await res.json()
        setOrders(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
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
      <div>
        <h1 className="text-2xl font-bold text-white">Mis pedidos</h1>
        <p className="text-zinc-400 mt-1">
          Historial de todos tus pedidos
        </p>
      </div>

      {orders.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center"
        >
          <Package className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No tienes pedidos</h2>
          <p className="text-zinc-400 mb-6">
            Cuando realices una compra, aparecera aqui
          </p>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors font-medium"
          >
            Explorar productos
            <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => {
            const StatusIcon = statusIcons[order.status] || Clock
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-zinc-800">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-white">
                        {order.orderNumber}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
                        statusColors[order.status] || 'bg-zinc-700 text-zinc-300'
                      }`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusLabels[order.status] || order.status}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 mt-1">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold text-white">
                      ${order.total.toLocaleString()}
                    </span>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center gap-2 px-4 py-2 border border-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Ver detalles
                    </button>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-5">
                  <div className="flex items-center gap-4 overflow-x-auto pb-2">
                    {order.items.slice(0, 4).map((item) => (
                      <div 
                        key={item.id}
                        className="w-16 h-16 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0"
                      >
                        {item.product.images[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-zinc-600" />
                          </div>
                        )}
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-sm text-zinc-400">
                          +{order.items.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-zinc-500 mt-3">
                    {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/80 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-2xl my-8"
          >
            <div className="flex items-center justify-between p-5 border-b border-zinc-800">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {selectedOrder.orderNumber}
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
              {/* Status */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-400">Estado:</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
                  statusColors[selectedOrder.status] || 'bg-zinc-700 text-zinc-300'
                }`}>
                  {statusLabels[selectedOrder.status] || selectedOrder.status}
                </span>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-sm font-medium text-zinc-300 mb-3">Productos</h3>
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
                        <Link 
                          href={`/producto/${item.product.slug}`}
                          className="text-sm font-medium text-white hover:underline truncate block"
                        >
                          {item.product.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                          {item.size && <span>Talla: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                          <span>x{item.quantity}</span>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-white">
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
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

            <div className="flex justify-end p-5 border-t border-zinc-800">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 border border-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
