# GUÍA DE PRUEBAS - TIENDA UNDER

## Credenciales Configuradas

### Administrador
- **Email:** `admin@kirastore.com`
- **Password:** `admin123`
- **Rol:** ADMIN
- **Acceso:** Panel completo de administración

### MercadoPago (Modo Test)
- **Public Key:** `TEST-5fb1d798-b6f1-42aa-bfec-012326706ee3`
- **Access Token:** `TEST-6824798983391326-121013-bb6f0a323a8451abb53820a3b10951d6-159756353`
- **Estado:**  Configurado

### Tarjetas de Prueba MercadoPago

| Tarjeta | Número | CVV | Vencimiento | Resultado |
|---------|--------|-----|-------------|-----------|
| Visa | 4509 9535 6623 3704 | 123 | 11/25 | Aprobada |
| Mastercard | 5031 7557 3453 0604 | 123 | 11/25 | Aprobada |
| American Express | 3711 803032 57522 | 1234 | 11/25 | Aprobada |
| Visa (Rechazada) | 4509 9535 6623 3704 | 123 | 11/25 | Fondos insuficientes |

Datos adicionales para el pago:
- Nombre: APRO (para aprobado) o OTHE (para rechazado)
- DNI/CPF: Cualquier número de 7-8 dígitos
- Email: test@test.com

---

## Checklist de Pruebas Completas

### 1. Autenticación y Usuarios

#### Registro de Usuario
- [ ] Ir a `/auth/registro`
- [ ] Crear cuenta con email único
- [ ] Verificar redirección a home
- [ ] Confirmar sesión activa

#### Login
- [ ] Ir a `/auth/login`
- [ ] Login con admin: `admin@kirastore.com` / `admin123`
- [ ] Verificar acceso al panel admin
- [ ] Logout y login con usuario normal
- [ ] Verificar NO tiene acceso a `/admin`

#### Recuperación de Contraseña
- [ ] Click en "¿Olvidaste tu contraseña?"
- [ ] Ingresar email
- [ ] Verificar mensaje de confirmación
- [ ] **Nota:** El email se enviará por Resend (si está configurado)

---

### 2. Navegación de Tienda (Usuario)

#### Home Page
- [ ] Ver banner principal (carousel)
- [ ] Ver categorías destacadas
- [ ] Ver productos destacados
- [ ] Ver productos nuevos
- [ ] Animaciones fluidas

#### Productos
- [ ] Ir a /productos
- [ ] Probar filtros por categoría
- [ ] Probar filtros por precio
- [ ] Probar filtros por talla
- [ ] Probar filtros por color
- [ ] Búsqueda de productos
- [ ] Ordenar por: precio, nombre, fecha

#### Detalle de Producto
- [ ] Click en un producto
- [ ] Ver galería de imágenes (zoom)
- [ ] Seleccionar talla
- [ ] Seleccionar color
- [ ] Cambiar cantidad
- [ ] Agregar al carrito
- [ ] Ver productos relacionados

#### Carrito
- [ ] Abrir carrito (ícono en header)
- [ ] Ver productos agregados
- [ ] Cambiar cantidades
- [ ] Eliminar productos
- [ ] Ver total actualizado
- [ ] Aplicar código de descuento (si existe)
- [ ] Proceder al checkout

---

### 3. Proceso de Compra

#### Checkout - Paso 1: Información Personal
- [ ] Ir a `/checkout`
- [ ] Completar formulario:
  - Nombre y Apellido
  - Email
  - Teléfono
- [ ] Validación de campos
- [ ] Continuar al siguiente paso

#### Checkout - Paso 2: Dirección de Envío
- [ ] Completar dirección:
  - Calle y número
  - Colonia/Barrio
  - Ciudad
  - Estado
  - Código postal
  - País
- [ ] Guardar dirección (si está logueado)
- [ ] Continuar al siguiente paso

#### Checkout - Paso 3: Método de Pago

**Opción A: MercadoPago**
- [ ] Seleccionar MercadoPago
- [ ] Click en "Pagar con MercadoPago"
- [ ] Redirige a página de MercadoPago
- [ ] Usar tarjeta de prueba:
  - **Número:** 4509 9535 6623 3704
  - **Nombre:** APRO
  - **CVV:** 123
  - **Vencimiento:** 11/25
- [ ] Completar pago
- [ ] Verificar redirección a página de éxito
- [ ] Verificar orden creada

**Opción B: Transferencia Bancaria**
- [ ] Seleccionar Transferencia
- [ ] Ver datos bancarios
- [ ] Confirmar pedido
- [ ] Subir comprobante (si aplica)
- [ ] Verificar orden con estado PENDING

#### Confirmación
- [ ] Ver página de éxito
- [ ] Ver número de orden
- [ ] Ver resumen del pedido
- [ ] Recibir email de confirmación (si Resend está configurado)

---

### 4. Cuenta de Usuario

#### Perfil
- [ ] Ir a `/cuenta/perfil`
- [ ] Editar información personal
- [ ] Cambiar contraseña
- [ ] Subir foto de perfil

#### Mis Pedidos
- [ ] Ir a `/cuenta/pedidos`
- [ ] Ver listado de pedidos
- [ ] Ver detalles de cada pedido
- [ ] Ver estado de envío
- [ ] Rastrear pedido (si tiene tracking)

#### Direcciones
- [ ] Ir a `/cuenta/direcciones`
- [ ] Agregar nueva dirección
- [ ] Editar dirección existente
- [ ] Eliminar dirección
- [ ] Marcar como predeterminada

#### Favoritos
- [ ] Ir a `/favoritos`
- [ ] Ver productos guardados
- [ ] Agregar a carrito desde favoritos
- [ ] Eliminar de favoritos

---

### 5. Panel de Administración

#### Dashboard
- [ ] Login como admin
- [ ] Ir a `/admin`
- [ ] Ver estadísticas:
  - Ingresos totales
  - Total de pedidos
  - Total de productos
  - Total de usuarios
- [ ] Ver gráfico de ventas
- [ ] Ver pedidos recientes
- [ ] Ver productos con stock bajo
- [ ] Ver productos más vendidos

#### Productos
- [ ] Ir a `/admin/productos`
- [ ] Ver lista de productos
- [ ] **Crear nuevo producto:**
  - [ ] Click en "Nuevo Producto"
  - [ ] Completar información básica
  - [ ] Subir imágenes (Cloudinary)
  - [ ] Seleccionar categoría
  - [ ] Agregar tallas
  - [ ] Agregar colores
  - [ ] Establecer stock
  - [ ] Marcar como nuevo/destacado
  - [ ] Guardar
- [ ] **Editar producto:**
  - [ ] Click en ícono de editar
  - [ ] Modificar información
  - [ ] Guardar cambios
- [ ] **Eliminar producto:**
  - [ ] Click en ícono de eliminar
  - [ ] Confirmar eliminación
- [ ] Buscar productos
- [ ] Filtrar por categoría

#### Categorías
- [ ] Ir a `/admin/categorias`
- [ ] Ver lista de categorías
- [ ] **Crear categoría:**
  - [ ] Nombre
  - [ ] Slug
  - [ ] Descripción
  - [ ] Subir imagen
  - [ ] Guardar
- [ ] **Reordenar categorías:**
  - [ ] Drag and drop para cambiar orden
  - [ ] Verificar orden en tienda
- [ ] Editar categoría
- [ ] Eliminar categoría (si no tiene productos)

#### Inventario
- [ ] Ir a `/admin/inventario`
- [ ] Ver stock por producto y variante
- [ ] Ver alertas de stock bajo
- [ ] Ver productos agotados
- [ ] **Actualizar stock:**
  - [ ] Expandir producto
  - [ ] Click en editar variante
  - [ ] Cambiar cantidad
  - [ ] Guardar
- [ ] Exportar inventario a CSV
- [ ] Filtrar por estado (en stock, bajo, agotado)

#### Pedidos
- [ ] Ir a `/admin/pedidos`
- [ ] Ver lista de pedidos
- [ ] Filtrar por estado
- [ ] Buscar por número de orden o cliente
- [ ] **Ver detalle de pedido:**
  - [ ] Click en pedido
  - [ ] Ver información del cliente
  - [ ] Ver productos
  - [ ] Ver dirección de envío
  - [ ] Ver estado de pago
- [ ] **Cambiar estado de pedido:**
  - [ ] Seleccionar nuevo estado
  - [ ] Guardar
  - [ ] Verificar email enviado al cliente
- [ ] Agregar número de rastreo
- [ ] Imprimir orden

#### Usuarios
- [ ] Ir a `/admin/usuarios`
- [ ] Ver lista de usuarios
- [ ] Buscar usuarios
- [ ] Filtrar por rol
- [ ] **Ver detalle de usuario:**
  - [ ] Click en usuario
  - [ ] Ver información completa
  - [ ] Ver historial de pedidos
  - [ ] Ver direcciones
  - [ ] Ver total gastado
- [ ] Cambiar rol (USER  ADMIN)
- [ ] Editar información
- [ ] Eliminar usuario

#### Configuración
- [ ] Ir a `/admin/configuracion`
- [ ] **General:**
  - [ ] Cambiar nombre del sitio
  - [ ] Cambiar descripción
  - [ ] Cambiar contacto
  - [ ] Subir logo/favicon
- [ ] **Apariencia:**
  - [ ] Cambiar colores
  - [ ] Activar/desactivar modo oscuro
  - [ ] Configurar barra de anuncio
- [ ] **E-commerce:**
  - [ ] Configurar moneda
  - [ ] Establecer IVA
  - [ ] Configurar envío gratis
  - [ ] Opciones de checkout
- [ ] **Envío:**
  - [ ] Costo de envío
  - [ ] Días estimados
  - [ ] Recolección en tienda
- [ ] **Pagos:**
  - [ ] Activar/desactivar MercadoPago
  - [ ] Activar transferencia
  - [ ] Configurar datos bancarios
  - [ ] Pago contra entrega
- [ ] **Email:**
  - [ ] Configurar emails automáticos
  - [ ] Remitente
- [ ] **Redes Sociales:**
  - [ ] Agregar enlaces
- [ ] **SEO:**
  - [ ] Meta título
  - [ ] Meta descripción
  - [ ] Keywords
  - [ ] Imagen OG
- [ ] Guardar cambios

---

### 6. Pruebas de Sistema

#### Responsive Design
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Mobile landscape

#### Navegadores
- [ ] Chrome
- [ ] Firefox
- [ ] Edge
- [ ] Safari (si tienes Mac/iPhone)

#### Performance
- [ ] Tiempo de carga inicial < 3s
- [ ] Animaciones fluidas (60fps)
- [ ] Imágenes optimizadas
- [ ] Sin errores en consola

#### Seguridad
- [ ] Rutas protegidas funcionan
- [ ] No se puede acceder a `/admin` sin ser admin
- [ ] Tokens de sesión funcionan
- [ ] CORS configurado correctamente

---

## Errores Conocidos y Soluciones

### "Cannot read properties of undefined"
**Solución:** Recargar página con Ctrl+F5

### Error de Prisma Client
**Solución:** 
```bash
npx prisma generate
```

### Imágenes no se suben a Cloudinary
**Verificar:**
1. Credenciales en `.env`
2. Usuario es ADMIN
3. Consola del navegador para errores

### Emails no se envían
**Verificar:**
1. RESEND_API_KEY en `.env`
2. Revisar terminal para logs

### Pagos no funcionan
**Verificar:**
1. Credenciales de MercadoPago en `.env`
2. Usar tarjetas de prueba correctas
3. Modo test activado

---

## Metricas de Exito

### Performance
-  Lighthouse Score > 90
-  First Contentful Paint < 1.5s
-  Time to Interactive < 3s

### Funcionalidad
-  100% de features implementadas
-  0 errores críticos
-  Responsive en todos los dispositivos

### UX/UI
-  Animaciones fluidas
-  Feedback visual en todas las acciones
-  Mensajes de error claros

---

## Proximos Pasos (Produccion)

### Antes de Desplegar

1. **Variables de Entorno de Producción:**
   ```env
   DATABASE_URL=postgresql://... (producción)
   NEXTAUTH_URL=https://tudominio.com
   NEXTAUTH_SECRET=nuevo-secret-super-seguro
   MERCADOPAGO_ACCESS_TOKEN=prod-xxx (real)
   MERCADOPAGO_PUBLIC_KEY=prod-xxx (real)
   CLOUDINARY_CLOUD_NAME=xxx (cuenta real)
   RESEND_API_KEY=re_xxx (cuenta real)
   ```

2. **Build de Producción:**
   ```bash
   npm run build
   npm run start
   ```

3. **Migración de Base de Datos:**
   ```bash
   npx prisma migrate deploy
   npx prisma db seed # (opcional)
   ```

4. **Configurar Dominio:**
   - Vercel, Netlify, o Railway
   - Configurar DNS
   - SSL/HTTPS automático

5. **Monitoreo:**
   - Configurar logs
   - Error tracking (Sentry)
   - Analytics (Google Analytics)

---

## Checklist de Pruebas Rapidas

Para una prueba rápida de 15 minutos:

1.  Login como admin
2.  Crear un producto con imagen
3.  Ver producto en la tienda
4.  Agregar al carrito
5.  Completar checkout con tarjeta de prueba
6.  Verificar orden en admin
7.  Cambiar estado de orden
8.  Actualizar stock en inventario
9.  Crear una categoría
10.  Cambiar configuración del sitio

---

**Última actualización:** 10 de diciembre de 2025
**Versión:** 1.0.0
