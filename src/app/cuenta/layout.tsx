'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  User, 
  Package, 
  MapPin,
  Heart,
  LogOut,
  ChevronRight,
  Settings
} from 'lucide-react'
import { signOut } from 'next-auth/react'

const navigation = [
  { name: 'Mi cuenta', href: '/cuenta', icon: User },
  { name: 'Mis pedidos', href: '/cuenta/pedidos', icon: Package },
  { name: 'Direcciones', href: '/cuenta/direcciones', icon: MapPin },
  { name: 'Favoritos', href: '/favoritos', icon: Heart },
]

export default function CuentaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/login?callbackUrl=/cuenta')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              {/* User Info */}
              <div className="p-5 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center">
                    <span className="text-xl font-medium text-white">
                      {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">
                      {session.user.name || 'Usuario'}
                    </p>
                    <p className="text-sm text-zinc-500 truncate">
                      {session.user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-3">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors group"
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                      <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  )
                })}
                
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors mt-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Cerrar sesion</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
