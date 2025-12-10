# KIRA Store - Documentacion Tecnica

## Indice

1. [Estructura del Proyecto](#estructura-del-proyecto)
2. [Archivos de Configuracion](#archivos-de-configuracion)
3. [Sistema de Tipos](#sistema-de-tipos)
4. [Componentes](#componentes)
5. [Paginas](#paginas)
6. [API Routes](#api-routes)
7. [Estado Global](#estado-global)
8. [Estilos](#estilos)
9. [Utilidades](#utilidades)

---

## Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js 14
│   ├── api/               # API Routes
│   ├── checkout/          # Flujo de checkout
│   ├── contacto/          # Pagina de contacto
│   ├── categoria/         # Paginas de categoria
│   ├── guia-de-talles/    # Guia de talles
│   ├── producto/          # Paginas de producto
│   ├── productos/         # Catalogo de productos
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Homepage
├── components/            # Componentes React
│   ├── cart/             # Componentes del carrito
│   ├── home/             # Componentes del home
│   ├── layout/           # Header, Footer, etc.
│   ├── products/         # Tarjetas y grids de productos
│   └── search/           # Modal de busqueda
├── data/                  # Datos mock
├── lib/                   # Utilidades y constantes
├── store/                 # Estado global (Zustand)
├── styles/               # Estilos globales
└── types/                # Definiciones TypeScript
```

---

## Archivos de Configuracion

### package.json
Define las dependencias del proyecto:
- Next.js 14: Framework React con SSR/SSG
- TypeScript: Tipado estatico
- Tailwind CSS: Framework de utilidades CSS
- Zustand: Manejo de estado global
- Framer Motion: Animaciones
- React Hook Form + Zod: Validacion de formularios
- MercadoPago SDK: Integracion de pagos
- Swiper: Carruseles
- Lucide React: Iconos

### tsconfig.json
Configuracion de TypeScript con:
- Path aliases (`@/` para `src/`)
- Strict mode habilitado
- Target ES2022
- JSX preserve para Next.js

### next.config.js
Configuracion de Next.js:
- Optimizacion de imagenes (AVIF, WebP)
- Dominios permitidos para imagenes
- Configuracion experimental

### tailwind.config.ts
Tema personalizado:
- Paleta de colores oscura (zinc/neutral)
- Tipografias: Inter (texto), Space Grotesk (titulos)
- Animaciones personalizadas
- Breakpoints responsive

### postcss.config.js
Plugins de PostCSS:
- Tailwind CSS
- Autoprefixer

### .env.example
Variables de entorno requeridas:
- `NEXT_PUBLIC_APP_URL`: URL de la aplicacion
- `MERCADOPAGO_ACCESS_TOKEN`: Token privado de MP
- `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`: Clave publica de MP

---

## Sistema de Tipos

### src/types/index.ts

#### Product
```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  subcategory?: string;
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  stock: number;
  isNew?: boolean;
  isFeatured?: boolean;
  tags?: string[];
}
```

#### CartItem
```typescript
interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  size: string;
  color: string;
}
```

#### Category
```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount: number;
}
```

#### User
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addresses: Address[];
  orders?: Order[];
}
```

---

## Componentes

### Layout Components

#### AnnouncementBar
Ubicacion: `src/components/layout/announcement-bar.tsx`

Cinta superior animada con anuncios desplazandose.
- Animacion CSS infinita
- Pausa en hover
- Contenido duplicado para loop seamless

#### Header
Ubicacion: `src/components/layout/header.tsx`

Navegacion principal de la tienda:
- Logo a la izquierda
- Menu de navegacion central
- Barra de busqueda
- Iconos de usuario y carrito
- Menu hamburguesa para mobile
- Cambio de estilo al hacer scroll

#### Footer
Ubicacion: `src/components/layout/footer.tsx`

Footer completo con:
- Logo y descripcion
- Links de navegacion
- Informacion de contacto
- Newsletter con formulario
- Iconos de metodos de pago
- Redes sociales
- Copyright

### Cart Components

#### CartDrawer
Ubicacion: `src/components/cart/cart-drawer.tsx`

Panel lateral de carrito:
- Slide desde la derecha
- Lista de productos con imagen, nombre, talle, color
- Controles de cantidad (+/-)
- Boton eliminar
- Subtotal calculado
- Link a checkout
- Estado vacio con CTA

### Product Components

#### ProductCard
Ubicacion: `src/components/products/product-card.tsx`

Tarjeta individual de producto:
- Imagen con aspect ratio 3:4
- Overlay con acciones en hover
- Badge de descuento/nuevo
- Nombre y precio
- Precio anterior tachado si hay descuento
- Boton wishlist
- Quick add to cart

#### ProductGrid
Ubicacion: `src/components/products/product-grid.tsx`

Grid responsive de productos:
- 4 columnas en desktop
- 2 columnas en tablet
- 1 columna en mobile
- Infinite scroll con Intersection Observer
- Estado de carga con skeletons
- Estado vacio con mensaje

#### ProductFilters
Ubicacion: `src/components/products/product-filters.tsx`

Panel de filtros lateral:
- Filtro por categoria
- Filtro por talle
- Filtro por color (con muestras visuales)
- Filtro por precio (rango)
- Secciones colapsables
- Animaciones Framer Motion

### Home Components

#### HeroBanner
Ubicacion: `src/components/home/hero-banner.tsx`

Carousel principal:
- Swiper con autoplay
- Navegacion con flechas
- Paginacion con bullets
- Efecto fade entre slides
- CTAs personalizables

#### ProductCarousel
Ubicacion: `src/components/home/product-carousel.tsx`

Carrusel horizontal de productos:
- Titulo de seccion
- Link "Ver todos"
- Navegacion con flechas
- Responsive breakpoints
- Reutiliza ProductCard

#### CategoryGrid
Ubicacion: `src/components/home/category-grid.tsx`

Grid de categorias:
- Layout asimetrico (2 grandes, 4 pequenas)
- Imagenes con overlay
- Nombre y contador de productos
- Links a paginas de categoria

#### FeaturesSection
Ubicacion: `src/components/home/features-section.tsx`

Seccion de caracteristicas:
- Envio gratis a partir de cierto monto
- Pago seguro
- Cambios y devoluciones
- Atencion personalizada
- Iconos animados

### Search Component

#### SearchModal
Ubicacion: `src/components/search/search-modal.tsx`

Modal de busqueda:
- Overlay fullscreen
- Input con autofocus
- Busqueda en tiempo real
- Resultados con thumbnails
- Navegacion con teclado
- Cierre con Escape

---

## Paginas

### Home (/)
Archivo: `src/app/page.tsx`

Pagina principal compuesta por:
1. HeroBanner - Carousel promocional
2. CategoryGrid - Navegacion por categorias
3. ProductCarousel (Destacados) - Productos featured
4. ProductCarousel (Novedades) - Productos nuevos
5. FeaturesSection - Beneficios de comprar

### Productos (/productos)
Archivo: `src/app/productos/page.tsx`

Catalogo completo con:
- Breadcrumbs
- Filtros laterales
- Ordenamiento (precio, novedades)
- Grid de productos
- Paginacion/infinite scroll

### Categoria (/categoria/[slug])
Archivo: `src/app/categoria/[slug]/page.tsx`

Pagina de categoria dinamica:
- Titulo y descripcion de categoria
- Contador de productos
- Misma estructura que catalogo
- Filtros contextuales

### Producto (/producto/[slug])
Archivo: `src/app/producto/[slug]/page.tsx`

Detalle de producto:
- Galeria de imagenes con thumbnails
- Selector de talle
- Selector de color
- Cantidad
- Agregar al carrito
- Calculadora de envio
- Acordeones (descripcion, talles, cuidados)
- Productos relacionados

### Contacto (/contacto)
Archivo: `src/app/contacto/page.tsx`

Formulario de contacto:
- Campos: nombre, email, telefono, asunto, mensaje
- Validacion con Zod
- Informacion de contacto
- Links a WhatsApp
- Horarios de atencion

### Guia de Talles (/guia-de-talles)
Archivo: `src/app/guia-de-talles/page.tsx`

Tablas de medidas:
- Remeras y tops
- Pantalones y shorts
- Calzado
- Accesorios
- Instrucciones de medicion

### Checkout (/checkout)
Archivo: `src/app/checkout/page.tsx`

Proceso de compra multi-paso:
1. Datos personales
2. Direccion de envio
3. Metodo de pago
- Progress bar visual
- Resumen del pedido
- Calculos de totales

### Confirmacion (/checkout/confirmacion)
Archivo: `src/app/checkout/confirmacion/page.tsx`

Confirmacion de pedido:
- Animacion de exito
- Numero de orden
- Proximos pasos
- Datos de contacto
- Links de navegacion

---

## API Routes

### Productos

#### GET /api/products
Lista productos con filtros:
- `category`: Filtrar por categoria
- `size`: Filtrar por talle
- `color`: Filtrar por color
- `minPrice/maxPrice`: Rango de precio
- `sort`: Ordenamiento
- `page/limit`: Paginacion

#### GET /api/products/[slug]
Detalle de producto:
- Datos completos del producto
- Productos relacionados

### Categorias

#### GET /api/categories
Lista todas las categorias.

### Checkout

#### POST /api/checkout/mercadopago
Crea preferencia de MercadoPago:
- Items del carrito
- Datos del comprador
- URLs de retorno
- Configuracion de pagos

### Ordenes

#### POST /api/orders/transfer
Crea orden para pago por transferencia:
- Valida datos con Zod
- Genera ID unico
- Establece expiracion (48hs)

#### GET /api/orders/transfer
Consulta estado de orden.

### Webhooks

#### POST /api/webhooks/mercadopago
Recibe notificaciones de MercadoPago:
- Verifica estado del pago
- Actualiza orden en BD
- Dispara emails

### Contacto

#### POST /api/contact
Procesa formulario de contacto:
- Valida datos
- Envia email

---

## Estado Global

### Cart Store
Archivo: `src/store/cart-store.ts`

Estado del carrito con Zustand:

```typescript
interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}
```

Persistencia con `zustand/middleware`:
- Guarda en localStorage
- Key: `kira-cart-storage`

### Auth Store
Archivo: `src/store/auth-store.ts`

Estado de autenticacion:

```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  addAddress: (address: Address) => void;
  removeAddress: (addressId: string) => void;
}
```

---

## Estilos

### Variables CSS
Archivo: `src/styles/globals.css`

```css
:root {
  --background: #0a0a0a;
  --surface: #141414;
  --border: #262626;
  --accent: #fafafa;
  --accent-muted: #a1a1aa;
  --primary: #dc2626;
  --success: #22c55e;
  --warning: #f59e0b;
  --error: #ef4444;
}
```

### Clases Utilitarias

```css
.btn-primary - Boton principal oscuro
.btn-secondary - Boton con borde
.card - Contenedor con fondo y borde
.badge-discount - Badge rojo para descuentos
.badge-new - Badge para productos nuevos
.input-group - Contenedor de input con label
.container-custom - Contenedor responsivo
.section-title - Titulo de seccion
.divider - Linea divisoria
```

---

## Utilidades

### src/lib/utils.ts

#### cn(...classes)
Combina clases con clsx y tailwind-merge.

#### formatPrice(price)
Formatea numero a precio argentino.
```typescript
formatPrice(15000) // "$15.000"
```

#### calculateDiscount(price, compareAtPrice)
Calcula porcentaje de descuento.

#### generateSlug(text)
Genera slug URL-friendly.

#### calculateTransferPrice(price)
Aplica descuento por transferencia.

### src/lib/constants.ts

#### SITE_CONFIG
Configuracion general del sitio:
- Nombre, descripcion, URL
- Datos de contacto
- Redes sociales

#### NAVIGATION_ITEMS
Items del menu de navegacion.

#### SHIPPING_CONFIG
Configuracion de envios:
- Umbral para envio gratis
- Metodos disponibles

#### PAYMENT_CONFIG
Configuracion de pagos:
- Descuento por transferencia
- Datos bancarios
- Metodos aceptados

---

## Proximos Pasos

1. Base de Datos: Implementar Prisma con PostgreSQL
2. Autenticacion: Agregar NextAuth.js
3. Email: Configurar Resend para notificaciones
4. MercadoPago: Completar integracion con credenciales reales
5. Testing: Agregar tests con Vitest
6. SEO: Implementar metadata dinamica
7. Analytics: Configurar Google Analytics
8. Deploy: Configurar Vercel
