# Configuración del Proyecto

Estado actual y configuración de todos los servicios integrados.

---

## Estado de Servicios

### Base de Datos
- Proveedor: Neon PostgreSQL 17
- Región: AWS São Paulo (sa-east-1)
- Estado: Conectada y migrada
- Datos: Seed ejecutado con productos, categorías y usuarios de demo

### Autenticación (NextAuth.js)
- Provider: Credentials + Google OAuth
- NEXTAUTH_SECRET: Configurado
- URL base: http://localhost:3000 (desarrollo)

Credenciales de administrador:
- Email: admin@kurostore.com
- Password: admin123

### Emails (Resend)
- API Key: Configurada
- Remitente: onboarding@resend.dev
- Templates disponibles:
  - Confirmación de pedido
  - Pedido enviado
  - Pedido entregado
  - Bienvenida
  - Recuperación de contraseña

### Imágenes (Cloudinary)
- Cloud Name: dk0cas6co
- API Key: Configurada
- API Secret: Configurada
- Estado: Operativo

### Pagos (MercadoPago)
- Modo: Sandbox (TEST)
- Public Key: Configurada
- Access Token: Configurado

---

## Panel de Administración

### Páginas Disponibles

| Página | Ruta | Funcionalidades |
|--------|------|-----------------|
| Dashboard | `/admin` | Estadísticas, ventas, gráficos |
| Productos | `/admin/productos` | CRUD completo, gestión de stock, imágenes |
| Categorías | `/admin/categorias` | CRUD, ordenamiento, imágenes |
| Inventario | `/admin/inventario` | Control de stock por variante, alertas |
| Pedidos | `/admin/pedidos` | Gestión de órdenes, cambio de estado |
| Usuarios | `/admin/usuarios` | Gestión de roles, historial |
| Configuración | `/admin/configuracion` | General, Apariencia, E-commerce, Envío, Pagos, Email, SEO |

### Características
- Componente ImageUploader con drag-and-drop
- Protección por rol ADMIN
- Diseño responsive
- Tema dark con colores zinc/negro
- Notificaciones toast
- Animaciones con Framer Motion

---

## Comandos de Desarrollo

### Servidor
```bash
npm run dev          # Iniciar desarrollo
npm run build        # Compilar producción
npm run start        # Ejecutar producción
npm run lint         # Ejecutar linter
```

### Base de Datos
```bash
npx prisma studio           # Interfaz visual
npx prisma db push          # Sincronizar schema
npx prisma migrate dev      # Nueva migración
npx prisma db seed          # Ejecutar seed
npx prisma generate         # Regenerar cliente
```

### Git
```bash
git add .
git commit -m "descripcion del cambio"
git push origin main
```

---

## Estructura de Archivos Clave

```
src/
├── app/
│   ├── admin/              # Panel de administración
│   ├── api/                # API Routes
│   │   ├── admin/          # Endpoints protegidos
│   │   ├── products/       # API de productos
│   │   ├── checkout/       # API de pagos
│   │   └── webhooks/       # Webhooks
│   └── auth/               # Páginas de autenticación
├── components/
│   ├── admin/              # Componentes del admin
│   └── layout/             # Header, Footer
├── lib/
│   ├── cloudinary.ts       # Utilidades de Cloudinary
│   ├── email.ts            # Sistema de emails
│   ├── prisma.ts           # Cliente Prisma
│   └── constants.ts        # Constantes del sitio
└── types/
    └── index.ts            # Interfaces TypeScript
```

---

## URLs de Desarrollo

| Página | URL |
|--------|-----|
| Tienda | http://localhost:3000 |
| Login | http://localhost:3000/auth/login |
| Registro | http://localhost:3000/auth/registro |
| Admin | http://localhost:3000/admin |
| Productos | http://localhost:3000/productos |
| Prisma Studio | http://localhost:5555 |

---

## Dependencias Principales

### Core
- next@14.2.33
- react@18.3.1
- prisma@6.19.0
- next-auth@4.24.10

### UI/UX
- framer-motion
- react-hot-toast
- lucide-react
- swiper

### Backend
- cloudinary
- resend
- zod
- mercadopago

### Estado
- zustand

---

## Variables de Entorno

```env
# Base de Datos
DATABASE_URL="postgresql://..."

# Autenticación
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (opcional)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Pagos
MERCADOPAGO_ACCESS_TOKEN="..."
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY="..."

# Imágenes
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# Emails
RESEND_API_KEY="..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## Configuración de MercadoPago

1. Acceder a https://www.mercadopago.com.ar/developers
2. Crear una aplicación
3. Copiar credenciales (Access Token y Public Key)
4. Agregar al archivo `.env`

Para modo producción:
- Usar credenciales de producción (sin prefijo TEST-)
- Actualizar `NEXT_PUBLIC_APP_URL` con el dominio real

---

## Configuración de Google OAuth (Opcional)

1. Acceder a https://console.cloud.google.com/apis/credentials
2. Crear credenciales OAuth 2.0
3. Configurar:
   - Origen autorizado: http://localhost:3000
   - URI de redirección: http://localhost:3000/api/auth/callback/google
4. Agregar Client ID y Secret al `.env`

---

## Solución de Problemas

### El servidor no inicia
```bash
Remove-Item -Recurse -Force .next
npm run dev
```

### Error de Prisma Client
```bash
npx prisma generate
```

### Imágenes no se suben
- Verificar credenciales de Cloudinary
- Confirmar que el usuario tiene rol ADMIN

### Error de autenticación
- Verificar NEXTAUTH_SECRET
- Verificar NEXTAUTH_URL
- Limpiar cookies del navegador

---

## Métricas del Proyecto

- Archivos: ~150+
- Componentes: ~40+
- API Routes: ~20+
- Páginas: ~25+

---

Última actualización: 16 de diciembre de 2025
Versión: 1.0.0
