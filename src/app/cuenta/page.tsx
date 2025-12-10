'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Save, CheckCircle } from 'lucide-react'

export default function CuentaPage() {
  const { data: session, update } = useSession()
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name }),
      })

      if (!res.ok) {
        throw new Error('Error al actualizar perfil')
      }

      await update({ name: formData.name })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Mi cuenta</h1>
        <p className="text-zinc-400 mt-1">
          Administra tu informacion personal
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900 border border-zinc-800 rounded-xl"
      >
        <div className="p-5 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-white">Informacion personal</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Success Message */}
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400"
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">Perfil actualizado correctamente</p>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400"
            >
              <p className="text-sm">{error}</p>
            </motion.div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Nombre completo
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Tu nombre"
                className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="email"
                value={session?.user?.email || ''}
                disabled
                className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-400 cursor-not-allowed"
              />
            </div>
            <p className="mt-1.5 text-xs text-zinc-500">
              El email no se puede modificar
            </p>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Guardar cambios
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Change Password Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-zinc-900 border border-zinc-800 rounded-xl"
      >
        <div className="p-5 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-white">Seguridad</h2>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Contrasena</p>
              <p className="text-sm text-zinc-500 mt-0.5">
                Ultima actualizacion hace mas de 30 dias
              </p>
            </div>
            <button
              type="button"
              className="px-4 py-2 border border-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors text-sm"
            >
              Cambiar contrasena
            </button>
          </div>
        </div>
      </motion.div>

      {/* Delete Account */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-zinc-900 border border-red-500/20 rounded-xl"
      >
        <div className="p-5">
          <h2 className="text-lg font-semibold text-red-400 mb-2">Eliminar cuenta</h2>
          <p className="text-sm text-zinc-400 mb-4">
            Una vez que elimines tu cuenta, todos tus datos seran borrados permanentemente. 
            Esta accion no se puede deshacer.
          </p>
          <button
            type="button"
            className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm"
          >
            Eliminar mi cuenta
          </button>
        </div>
      </motion.div>
    </div>
  )
}
