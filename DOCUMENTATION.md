# Documentación Técnica

Referencia técnica del proyecto KURO E-commerce.

---

## Índice

1. [Estructura del Proyecto](#estructura-del-proyecto)
2. [Configuración](#configuración)
3. [Sistema de Tipos](#sistema-de-tipos)
4. [Componentes](#componentes)
5. [API Routes](#api-routes)
6. [Estado Global](#estado-global)
7. [Base de Datos](#base-de-datos)

---

## Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js 14
│   ├── api/               # API Routes
│   ├── admin/             # Panel de administración
│   ├── auth/              # Autenticación
│   ├── checkout/          # Flujo de checkout
│   ├── categoria/         # Páginas de categoría
│   ├── producto/          # Páginas de producto
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Homepage
├── components/            # Componentes React
│   ├── admin/            # Componentes del admin
│   ├── cart/             # Carrito de compras
│   ├── home/             # Componentes del home
│   ├── layout/           # Header, Footer
│   ├── products/         # Tarjetas y grids
│   └── search/           # Modal de búsqueda
├── lib/                   # Utilidades y configuración
├── store/                 # Estado global (Zustand)
├── styles/               # Estilos globales
└── types/                # Definiciones TypeScript
```

---

## Configuración

### package.json
Dependencias principales:
- Next.js 14: Framework React con SSR/SSG
- TypeScript: Tipado estático
- Tailwind CSS: Framework de utilidades CSS
- Prisma: ORM para PostgreSQL
- NextAuth.js: Autenticación
- Zustand: Estado global
- Framer Motion: Animaciones
- MercadoPago SDK: Pagos
- Resend: Emails transaccionales
- Cloudinary: Gestión de imágenes

### tsconfig.json
- Path aliases: `@/` mapea a `src/`
- Strict mode habilitado
- Target: ES2022

### tailwind.config.ts
Tema personalizado:
- Paleta de colores dark (zinc/neutral)
- Tipografías: Inter (texto), Space Grotesk (títulos)
- Animaciones personalizadas
- Breakpoints responsive

### Variables de Entorno

```env
# Base de Datos
DATABASE_URL

# Autenticación
NEXTAUTH_SECRET
NEXTAUTH_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET

# Pagos
MERCADOPAGO_ACCESS_TOKEN
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY

# Imágenes
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET

# Emails
RESEND_API_KEY
```

---

## Sistema de Tipos

### Product
```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: Category;
  categoryId: string;
  variants: ProductVariant[];
  isNew: boolean;
  isFeatured: boolean;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### CartItem
```typescript
interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  size: string;
  color: string;
}
```

### Order
```typescript
interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  shippingAddress: Address;
  paymentMethod: string;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Componentes

### Layout
| Componente | Descripción |
|------------|-------------|
| Header | Navegación principal con menú responsive |
| Footer | Footer con enlaces y newsletter |
| AnnouncementBar | Cinta animada con promociones |

### Productos
| Componente | Descripción |
|------------|-------------|
| ProductCard | Tarjeta de producto con badges |
| ProductGrid | Grid con paginación |
| ProductFilters | Filtros laterales colapsables |
| ProductGallery | Galería de imágenes con zoom |

### Carrito
| Componente | Descripción |
|------------|-------------|
| CartDrawer | Panel lateral del carrito |
| CartItem | Item individual del carrito |

### Admin
| Componente | Descripción |
|------------|-------------|
| ImageUploader | Drag-and-drop para imágenes |
| DataTable | Tabla con ordenamiento y búsqueda |
| StatsCard | Tarjeta de estadísticas |

---

## API Routes

### Públicas

```
GET  /api/products              # Lista de productos
     Query params: category, minPrice, maxPrice, size, color, sort, page, limit

GET  /api/products/[slug]       # Detalle de producto

GET  /api/categories            # Lista de categorías
```

### Checkout

```
POST /api/checkout/mercadopago  # Crear preferencia de pago
     Body: { items, shippingAddress, shippingCost }

POST /api/orders/transfer       # Crear orden por transferencia
     Body: { items, shippingAddress, total }
```

### Webhooks

```
POST /api/webhooks/mercadopago  # Notificación de pago
     Body: { type, data }
```

### Admin (requiere rol ADMIN)

```
GET    /api/admin/products          # Listar productos
POST   /api/admin/products          # Crear producto
PUT    /api/admin/products/[id]     # Actualizar producto
DELETE /api/admin/products/[id]     # Eliminar producto

GET    /api/admin/orders            # Listar pedidos
GET    /api/admin/orders/[id]       # Detalle de pedido
PUT    /api/admin/orders/[id]       # Actualizar estado

GET    /api/admin/users             # Listar usuarios
PUT    /api/admin/users/[id]        # Actualizar usuario

POST   /api/admin/upload            # Subir imagen a Cloudinary
```

---

## Estado Global

### Cart Store (Zustand)

```typescript
interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}
```

### Favorites Store (Zustand)

```typescript
interface FavoritesStore {
  favorites: string[];
  addFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}
```

Ambos stores persisten en localStorage.

---

## Base de Datos

### Modelos Prisma

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String?
  role      Role     @default(USER)
  orders    Order[]
  createdAt DateTime @default(now())
}

model Product {
  id            String    @id @default(cuid())
  name          String
  slug          String    @unique
  description   String
  price         Float
  originalPrice Float?
  images        String[]
  category      Category  @relation(...)
  variants      ProductVariant[]
  isNew         Boolean   @default(false)
  isFeatured    Boolean   @default(false)
  stock         Int       @default(0)
}

model Order {
  id              String      @id @default(cuid())
  user            User        @relation(...)
  items           OrderItem[]
  status          OrderStatus @default(PENDING)
  total           Float
  shippingAddress Json
  paymentMethod   String
  paymentId       String?
}
```

### Comandos Útiles

```bash
npx prisma studio           # Interfaz visual de la DB
npx prisma db push          # Sincronizar schema
npx prisma migrate dev      # Crear migración
npx prisma db seed          # Ejecutar seed
npx prisma generate         # Regenerar cliente
```
