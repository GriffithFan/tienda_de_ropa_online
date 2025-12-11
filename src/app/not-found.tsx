'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="text-center">
        {/* Glitch Effect Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          <span className="text-[150px] md:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-zinc-700 to-zinc-900 select-none">
            404
          </span>
          <motion.span 
            className="absolute inset-0 text-[150px] md:text-[200px] font-bold text-white/5"
            animate={{ 
              x: [0, -3, 3, 0],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ 
              duration: 0.5, 
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            404
          </motion.span>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Página no encontrada
          </h1>
          <p className="text-zinc-400 mb-8 max-w-md mx-auto">
            Lo sentimos, la página que buscas no existe o fue movida. 
            Puede que el enlace esté roto o la URL sea incorrecta.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-zinc-200 transition-colors"
          >
            <Home className="w-4 h-4" />
            Ir al Inicio
          </Link>
          
          <Link
            href="/productos"
            className="flex items-center gap-2 px-6 py-3 bg-zinc-800 text-white rounded-full font-medium hover:bg-zinc-700 transition-colors"
          >
            <Search className="w-4 h-4" />
            Ver Productos
          </Link>
        </motion.div>

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          onClick={() => window.history.back()}
          className="mt-8 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver atrás
        </motion.button>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  )
}
