# KIRA Store

Tienda online de ropa alternativa y estilo japones under

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)
![MercadoPago](https://img.shields.io/badge/MercadoPago-Integrated-00a0e4?style=flat-square)

## Descripcion

KIRA Store es una plataforma de e-commerce moderna y minimalista, especializada en ropa alternativa con estetica japonesa under. Desarrollada con las tecnologias mas avanzadas para ofrecer una experiencia de compra fluida y responsive.

### Caracteristicas Principales

- Diseno Dark y Minimalista con paleta de colores oscura
- 100% Responsive para todos los dispositivos
- Animaciones fluidas con Framer Motion
- Carrito persistente con localStorage
- Integracion con MercadoPago
- Busqueda en tiempo real
- Filtros dinamicos por categoria, talle, color y precio

## Tecnologias

| Categoria | Tecnologia |
|-----------|------------|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS |
| Animaciones | Framer Motion |
| Estado Global | Zustand |
| Formularios | React Hook Form + Zod |
| Carruseles | Swiper |
| Iconos | Lucide React |
| Pagos | MercadoPago SDK |

## Estructura del Proyecto

```
kira-store/
├── src/
│   ├── app/                 # Rutas y paginas (App Router)
│   │   ├── api/            # API Routes
│   │   ├── checkout/       # Flujo de checkout
│   │   ├── categoria/      # Paginas por categoria
│   │   ├── producto/       # Paginas de producto
│   │   └── ...
│   ├── components/         # Componentes React
│   │   ├── cart/          # Carrito de compras
│   │   ├── home/          # Componentes del home
│   │   ├── layout/        # Header, Footer, etc.
│   │   ├── products/      # Cards y grids
│   │   └── search/        # Busqueda
│   ├── data/              # Datos mock
│   ├── lib/               # Utilidades
│   ├── store/             # Estado Zustand
│   ├── styles/            # Estilos globales
│   └── types/             # Tipos TypeScript
├── public/                # Assets estaticos
└── ...config files
```

## Instalacion

### Prerrequisitos

- Node.js 18+
- npm o pnpm

### Pasos

1. Clonar el repositorio
```bash
git clone https://github.com/GriffithFan/tienda_de_ropa_online.git
cd tienda_de_ropa_online
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno
```bash
cp .env.example .env.local
```

Editar `.env.local` con tus credenciales:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
MERCADOPAGO_ACCESS_TOKEN=tu_access_token
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=tu_public_key
```

4. Iniciar el servidor de desarrollo
```bash
npm run dev
```

5. Abrir en el navegador
```
http://localhost:3000
```

## Paginas Disponibles

| Ruta | Descripcion |
|------|-------------|
| `/` | Pagina principal |
| `/productos` | Catalogo completo |
| `/categoria/[slug]` | Productos por categoria |
| `/producto/[slug]` | Detalle de producto |
| `/checkout` | Proceso de compra |
| `/contacto` | Formulario de contacto |
| `/guia-de-talles` | Tablas de medidas |

## API Endpoints

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/api/products` | Lista productos con filtros |
| GET | `/api/products/[slug]` | Detalle de producto |
| GET | `/api/categories` | Lista categorias |
| POST | `/api/checkout/mercadopago` | Crear preferencia de pago |
| POST | `/api/orders/transfer` | Crear orden por transferencia |
| POST | `/api/contact` | Enviar mensaje de contacto |

## Metodos de Pago

1. **MercadoPago**
   - Tarjetas de credito (hasta 12 cuotas)
   - Tarjetas de debito
   - Pago Facil / Rapipago

2. **Transferencia Bancaria**
   - 10% de descuento
   - Enviar comprobante por WhatsApp/Email

3. **Efectivo**
   - Al retirar en el local
   - 10% de descuento

## Personalizacion

### Colores

Editar `tailwind.config.ts`:

```typescript
colors: {
  background: '#0a0a0a',  // Fondo principal
  surface: '#141414',      // Superficies elevadas
  accent: '#fafafa',       // Texto y acentos
  primary: '#dc2626',      // Color primario (rojo)
}
```

### Tipografias

El proyecto usa:
- **Inter** - Para texto general
- **Space Grotesk** - Para titulos

## Build para Produccion

```bash
npm run build
npm run start
```

## Deploy

### Vercel (Recomendado)

1. Conectar repositorio en [Vercel](https://vercel.com)
2. Configurar variables de entorno
3. Deploy automatico en cada push

### Docker

```dockerfile
docker build -t kira-store .
docker run -p 3000:3000 kira-store
```

## Documentacion Adicional

- [DOCUMENTATION.md](./DOCUMENTATION.md) - Documentacion tecnica detallada
- [CHECKLIST.md](./CHECKLIST.md) - Estado del desarrollo

## Contribuir

1. Fork del repositorio
2. Crear branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## Licencia

Este proyecto es privado y propietario de KIRA Store.
