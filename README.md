# KURO E-commerce Platform

Plataforma de e-commerce completa para tienda de ropa alternativa y streetwear japonés. Desarrollada con Next.js 14, TypeScript y PostgreSQL.

**Demo:** [tienda-de-ropa-online.vercel.app](https://tienda-de-ropa-online.vercel.app)

---

## Stack Tecnológico

| Categoría | Tecnología |
|-----------|------------|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript 5 |
| Estilos | Tailwind CSS 3 |
| Base de Datos | PostgreSQL 17 (Neon) |
| ORM | Prisma 6 |
| Autenticación | NextAuth.js 4 |
| Pagos | MercadoPago SDK |
| Emails | Resend |
| Imágenes | Cloudinary |
| Estado | Zustand |
| Animaciones | Framer Motion |

---

## Características

### Frontend
- Diseño dark minimalista con paleta de colores zinc/negro
- Diseño responsive para móvil, tablet y desktop
- Renderizado híbrido SSR/SSG para SEO y performance
- Animaciones fluidas con Framer Motion

### E-commerce
- Catálogo de productos con categorías, variantes de talle y color
- Carrito persistente en localStorage
- Checkout multi-paso: Datos, Envío, Pago, Confirmación
- Sistema de favoritos
- Filtros avanzados por categoría, precio, talle, color

### Pagos
- Integración completa con MercadoPago
- Soporte para tarjetas de crédito/débito
- Transferencia bancaria con descuento del 25%
- Webhooks para notificaciones automáticas de pago

### Usuarios
- Autenticación con NextAuth.js
- Login con email/contraseña
- OAuth con Google
- Perfiles de usuario con historial de pedidos
- Sistema de roles (Usuario/Admin)

### Panel de Administración
- Dashboard con métricas y estadísticas
- CRUD completo de productos con imágenes
- Gestión de categorías
- Control de inventario por variante
- Gestión de pedidos con estados
- Gestión de usuarios y roles

### Comunicaciones
- Emails transaccionales con Resend
- Confirmación de pedido
- Notificaciones de envío
- Formulario de contacto

---

## Estructura del Proyecto

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── admin/              # Panel de administración
│   │   ├── productos/      # CRUD de productos
│   │   ├── pedidos/        # Gestión de pedidos
│   │   ├── usuarios/       # Gestión de usuarios
│   │   └── categorias/     # Gestión de categorías
│   ├── api/                # API Routes
│   │   ├── admin/          # Endpoints protegidos
│   │   ├── auth/           # NextAuth endpoints
│   │   ├── products/       # Productos públicos
│   │   ├── checkout/       # Proceso de pago
│   │   └── webhooks/       # MercadoPago webhooks
│   ├── auth/               # Login / Registro
│   ├── checkout/           # Flujo de compra
│   ├── cuenta/             # Área de usuario
│   ├── categoria/[slug]/   # Páginas de categoría
│   └── producto/[slug]/    # Páginas de producto
├── components/             # Componentes React
│   ├── cart/               # Carrito de compras
│   ├── home/               # Componentes del home
│   ├── layout/             # Header, Footer
│   ├── products/           # Cards, grids, filtros
│   └── admin/              # Componentes del admin
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

## Instalación

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

Editar `.env` con las credenciales correspondientes:

```env
# Base de Datos
DATABASE_URL="postgresql://user:pass@host:5432/db"

# NextAuth
NEXTAUTH_SECRET="secret-key-generada"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (opcional)
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

### 5. Iniciar servidor de desarrollo

```bash
npm run dev
```

Acceder a [http://localhost:3000](http://localhost:3000)

---

## Credenciales de Demo

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | admin@kurostore.com | admin123 |

---

## Páginas Disponibles

### Públicas
| Ruta | Descripción |
|------|-------------|
| `/` | Página principal |
| `/productos` | Catálogo con filtros |
| `/categoria/[slug]` | Productos por categoría |
| `/producto/[slug]` | Detalle de producto |
| `/ofertas` | Productos en descuento |
| `/contacto` | Formulario de contacto |
| `/guia-de-talles` | Tabla de medidas |

### Usuario
| Ruta | Descripción |
|------|-------------|
| `/auth/login` | Iniciar sesión |
| `/auth/registro` | Crear cuenta |
| `/perfil` | Perfil de usuario |
| `/favoritos` | Lista de favoritos |
| `/checkout` | Proceso de compra |

### Administración
| Ruta | Descripción |
|------|-------------|
| `/admin` | Dashboard |
| `/admin/productos` | Gestión de productos |
| `/admin/pedidos` | Gestión de pedidos |
| `/admin/usuarios` | Gestión de usuarios |
| `/admin/categorias` | Gestión de categorías |

---

## API Endpoints

### Productos
```
GET  /api/products          # Lista con filtros y paginación
GET  /api/products/[slug]   # Detalle de producto
```

### Checkout
```
POST /api/checkout/mercadopago  # Crear preferencia de pago
POST /api/orders/transfer       # Orden por transferencia
```

### Admin (requiere autenticación)
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

## Build y Deploy

### Producción local

```bash
npm run build
npm run start
```

### Vercel

1. Conectar repositorio en vercel.com
2. Configurar variables de entorno en el dashboard
3. Deploy automático en cada push a main

Variables requeridas en producción:
- `NEXTAUTH_URL` con el dominio de producción
- `DATABASE_URL` con la base de datos de producción
- Credenciales de producción de MercadoPago

---

## Personalización

### Colores (tailwind.config.ts)

```typescript
colors: {
  background: { DEFAULT: '#0a0a0a', secondary: '#141414' },
  surface: { DEFAULT: '#1a1a1a', hover: '#252525' },
  accent: { DEFAULT: '#ffffff', muted: '#a0a0a0' },
}
```

### Tipografías

- **Inter** - Texto general
- **Space Grotesk** - Títulos y logo

---

## Licencia

MIT License - Disponible para uso comercial.

---

## Contacto

- GitHub: [@GriffithFan](https://github.com/GriffithFan)
