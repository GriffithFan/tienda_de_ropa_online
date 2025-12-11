# 🛒 KURO E-commerce Platform

<div align="center">

![KURO Store](https://img.shields.io/badge/KURO-E--commerce-black?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=for-the-badge&logo=tailwindcss)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=for-the-badge&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma)

**Plataforma de e-commerce moderna, completa y lista para producción.**

[Demo en Vivo](#) • [Documentación](./DOCUMENTATION.md) • [Características](#-características) • [Instalación](#-instalación)

</div>

---

## ✨ Características

### 🎨 Frontend
- **Diseño Dark & Minimalista** - Paleta oscura moderna con acentos elegantes
- **100% Responsive** - Adaptado para móvil, tablet y desktop
- **Animaciones Fluidas** - Framer Motion para transiciones suaves
- **SSR + SSG** - Renderizado híbrido para SEO y performance

### 🛒 E-commerce Core
- **Catálogo Completo** - Productos, categorías, variantes (talle/color)
- **Carrito Persistente** - Almacenamiento en localStorage
- **Checkout Multi-paso** - Datos → Envío → Pago → Confirmación
- **Lista de Favoritos** - Wishlist para usuarios

### 💳 Pagos Integrados
- **MercadoPago** - Tarjetas, Pago Fácil, Rapipago
- **Transferencia Bancaria** - Con descuento del 10%
- **Webhooks** - Notificaciones automáticas de pago

### 👤 Usuarios & Auth
- **NextAuth.js** - Autenticación segura
- **Login Social** - Google OAuth integrado
- **Perfil de Usuario** - Datos, direcciones, historial
- **Roles** - Usuarios y administradores

### 🔧 Panel de Administración
- **Dashboard** - Métricas y estadísticas
- **Gestión de Productos** - CRUD completo con imágenes
- **Gestión de Pedidos** - Estados, seguimiento
- **Gestión de Usuarios** - Roles y permisos
- **Inventario** - Control de stock

### 📧 Comunicaciones
- **Emails Transaccionales** - Resend integrado
- **Confirmación de Pedido**
- **Notificaciones de Envío**
- **Formulario de Contacto**

### 🖼️ Gestión de Medios
- **Cloudinary** - Upload y optimización de imágenes
- **Múltiples Imágenes** - Por producto
- **Lazy Loading** - Carga optimizada

### 🔍 SEO Optimizado
- **Meta Tags Dinámicos** - Por producto y categoría
- **Sitemap.xml** - Generación automática
- **Robots.txt** - Configurado
- **Open Graph** - Compartir en redes sociales

---

## 🛠️ Stack Tecnológico

| Categoría | Tecnología |
|-----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Lenguaje** | TypeScript 5 |
| **Estilos** | Tailwind CSS 3 |
| **Base de Datos** | PostgreSQL 17 (Neon) |
| **ORM** | Prisma 6 |
| **Auth** | NextAuth.js 4 |
| **Pagos** | MercadoPago SDK |
| **Emails** | Resend |
| **Imágenes** | Cloudinary |
| **Estado** | Zustand |
| **Animaciones** | Framer Motion |
| **Formularios** | React Hook Form + Zod |
| **UI Components** | Lucide Icons, Swiper |

---

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── admin/              # Panel de administración
│   │   ├── productos/      # CRUD de productos
│   │   ├── pedidos/        # Gestión de pedidos
│   │   ├── usuarios/       # Gestión de usuarios
│   │   └── categorias/     # Gestión de categorías
│   ├── api/                # API Routes
│   │   ├── admin/          # Endpoints admin
│   │   ├── auth/           # NextAuth endpoints
│   │   ├── products/       # Productos públicos
│   │   ├── checkout/       # Proceso de pago
│   │   └── webhooks/       # MercadoPago webhooks
│   ├── auth/               # Login / Registro
│   ├── checkout/           # Flujo de compra
│   ├── cuenta/             # Área de usuario
│   ├── categoria/[slug]/   # Páginas de categoría
│   ├── producto/[slug]/    # Páginas de producto
│   └── ...                 # Otras páginas
├── components/             # Componentes React
│   ├── cart/               # Carrito de compras
│   ├── home/               # Componentes del home
│   ├── layout/             # Header, Footer
│   ├── products/           # Cards, grids, filtros
│   └── ui/                 # Componentes base
├── lib/                    # Utilidades
│   ├── prisma.ts           # Cliente Prisma
│   ├── auth.ts             # Configuración NextAuth
│   ├── cloudinary.ts       # Upload de imágenes
│   ├── mercadopago.ts      # SDK MercadoPago
│   └── utils.ts            # Helpers
├── store/                  # Estado global (Zustand)
├── types/                  # Tipos TypeScript
└── styles/                 # CSS global
```

---

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+
- PostgreSQL (o cuenta en Neon.tech)
- Cuentas en: Cloudinary, Resend, MercadoPago

### 1. Clonar el repositorio

```bash
git clone https://github.com/GriffithFan/tienda_de_ropa_online.git
cd tienda_de_ropa_online
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:

```env
# Base de Datos
DATABASE_URL="postgresql://user:pass@host:5432/db"

# NextAuth
NEXTAUTH_SECRET="tu-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN="..."
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY="..."

# Cloudinary
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# Resend
RESEND_API_KEY="..."
```

### 4. Configurar base de datos

```bash
npx prisma db push
npx prisma db seed
```

### 5. Iniciar desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## 👤 Credenciales de Demo

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@kurostore.com | admin123 |
| Usuario | user@test.com | user123 |

---

## 📱 Páginas Disponibles

### Públicas
| Ruta | Descripción |
|------|-------------|
| `/` | Home con hero, productos destacados, categorías |
| `/productos` | Catálogo completo con filtros |
| `/categoria/[slug]` | Productos por categoría |
| `/producto/[slug]` | Detalle de producto |
| `/ofertas` | Productos en descuento |
| `/contacto` | Formulario de contacto |
| `/guia-de-talles` | Tabla de medidas |
| `/sobre-nosotros` | Historia de la marca |
| `/preguntas-frecuentes` | FAQ |

### Usuario
| Ruta | Descripción |
|------|-------------|
| `/auth/login` | Iniciar sesión |
| `/auth/registro` | Crear cuenta |
| `/cuenta` | Dashboard de usuario |
| `/cuenta/pedidos` | Historial de pedidos |
| `/favoritos` | Lista de deseos |
| `/checkout` | Proceso de compra |

### Administración
| Ruta | Descripción |
|------|-------------|
| `/admin` | Dashboard con métricas |
| `/admin/productos` | Gestión de productos |
| `/admin/pedidos` | Gestión de pedidos |
| `/admin/usuarios` | Gestión de usuarios |
| `/admin/categorias` | Gestión de categorías |

---

## 🔌 API Endpoints

### Productos
```
GET  /api/products          # Lista con filtros y paginación
GET  /api/products/[slug]   # Detalle de producto
```

### Categorías
```
GET  /api/categories        # Lista de categorías
```

### Checkout
```
POST /api/checkout/mercadopago  # Crear preferencia de pago
POST /api/orders/transfer       # Orden por transferencia
```

### Admin (Autenticado)
```
GET/POST   /api/admin/products      # CRUD productos
PUT/DELETE /api/admin/products/[id] # Actualizar/eliminar
GET/PUT    /api/admin/orders/[id]   # Gestión de pedidos
```

### Webhooks
```
POST /api/webhooks/mercadopago  # Notificaciones de pago
```

---

## 🎨 Personalización

### Colores (tailwind.config.ts)

```typescript
theme: {
  extend: {
    colors: {
      background: '#0a0a0a',  // Fondo principal
      surface: '#141414',     // Superficies
      accent: '#fafafa',      // Acentos
    }
  }
}
```

### Tipografías

- **Inter** - Texto general
- **Space Grotesk** - Títulos

### Logo

Reemplazar en `public/logos/` y actualizar referencias en componentes.

---

## 📦 Build & Deploy

### Producción

```bash
npm run build
npm run start
```

### Vercel (Recomendado)

1. Conectar repositorio en [vercel.com](https://vercel.com)
2. Configurar variables de entorno
3. Deploy automático en cada push

### Variables de Producción

Asegurarse de configurar:
- `NEXTAUTH_URL` con el dominio de producción
- `DATABASE_URL` con la base de datos de producción
- Credenciales de producción de MercadoPago

---

## 📄 Licencia

Este proyecto está disponible para uso comercial bajo licencia MIT.

---

## 🤝 Soporte & Contacto

¿Interesado en adquirir o personalizar esta plataforma?

- 📧 Email: contacto@ejemplo.com
- 💼 Portfolio: tu-portfolio.com
- 🐙 GitHub: [@GriffithFan](https://github.com/GriffithFan)

---

<div align="center">

**Desarrollado con ❤️ usando Next.js 14**

⭐ Si te gusta este proyecto, no olvides darle una estrella!

</div>
