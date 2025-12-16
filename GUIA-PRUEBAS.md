# Guía de Pruebas

Documentación para testing del flujo completo de la tienda.

---

## Credenciales de Acceso

### Administrador
- Email: `admin@kurostore.com`
- Password: `admin123`
- Rol: ADMIN
- Acceso: Panel completo de administración en `/admin`

### MercadoPago (Modo Sandbox)
- Public Key: `TEST-5fb1d798-b6f1-42aa-bfec-012326706ee3`
- Access Token: Configurado en `.env`

### Tarjetas de Prueba

| Tipo | Número | CVV | Vencimiento | Resultado |
|------|--------|-----|-------------|-----------|
| Visa | 4509 9535 6623 3704 | 123 | 11/25 | Aprobada |
| Mastercard | 5031 7557 3453 0604 | 123 | 11/25 | Aprobada |
| American Express | 3711 803032 57522 | 1234 | 11/25 | Aprobada |

Datos adicionales para el formulario de pago:
- Nombre del titular: APRO (para aprobar) o OTHE (para rechazar)
- DNI: Cualquier número de 7-8 dígitos
- Email: test@test.com

---

## Checklist de Pruebas

### 1. Autenticación

#### Registro
- [ ] Acceder a `/auth/registro`
- [ ] Completar formulario con datos válidos
- [ ] Verificar redirección al home
- [ ] Confirmar que la sesión está activa

#### Login
- [ ] Acceder a `/auth/login`
- [ ] Ingresar con credenciales de admin
- [ ] Verificar acceso al panel `/admin`
- [ ] Cerrar sesión
- [ ] Ingresar con usuario normal
- [ ] Verificar que no tiene acceso a `/admin`

---

### 2. Navegación de la Tienda

#### Home
- [ ] Verificar carga del banner principal
- [ ] Revisar sección de categorías
- [ ] Verificar productos destacados
- [ ] Verificar productos nuevos
- [ ] Comprobar funcionamiento de animaciones

#### Catálogo de Productos
- [ ] Acceder a `/productos`
- [ ] Probar filtro por categoría
- [ ] Probar filtro por rango de precios
- [ ] Probar filtro por talle
- [ ] Probar filtro por color
- [ ] Probar búsqueda por texto
- [ ] Probar ordenamiento (precio, nombre, fecha)

#### Detalle de Producto
- [ ] Acceder a un producto específico
- [ ] Verificar galería de imágenes
- [ ] Seleccionar talle
- [ ] Seleccionar color
- [ ] Modificar cantidad
- [ ] Agregar al carrito
- [ ] Verificar productos relacionados

---

### 3. Carrito de Compras

- [ ] Abrir drawer del carrito desde el header
- [ ] Verificar productos agregados
- [ ] Modificar cantidades
- [ ] Eliminar un producto
- [ ] Verificar actualización del total
- [ ] Proceder al checkout

---

### 4. Proceso de Checkout

#### Paso 1: Información Personal
- [ ] Completar nombre y apellido
- [ ] Ingresar email válido
- [ ] Ingresar teléfono
- [ ] Completar dirección de envío
- [ ] Avanzar al siguiente paso

#### Paso 2: Método de Envío
- [ ] Seleccionar envío estándar
- [ ] Verificar cálculo del costo
- [ ] Avanzar al siguiente paso

#### Paso 3: Método de Pago
- [ ] Seleccionar pago con MercadoPago
- [ ] Verificar redirección a checkout de MercadoPago
- [ ] Completar pago con tarjeta de prueba
- [ ] Verificar retorno a página de confirmación

#### Alternativa: Transferencia Bancaria
- [ ] Seleccionar pago por transferencia
- [ ] Verificar aplicación del descuento del 25%
- [ ] Confirmar pedido
- [ ] Verificar instrucciones de transferencia

---

### 5. Panel de Administración

#### Dashboard
- [ ] Verificar estadísticas generales
- [ ] Revisar ventas del período
- [ ] Verificar productos más vendidos

#### Productos
- [ ] Listar productos existentes
- [ ] Crear nuevo producto con imágenes
- [ ] Editar producto existente
- [ ] Eliminar producto

#### Pedidos
- [ ] Listar pedidos
- [ ] Ver detalle de un pedido
- [ ] Cambiar estado del pedido

#### Usuarios
- [ ] Listar usuarios registrados
- [ ] Ver detalle de un usuario
- [ ] Modificar rol de usuario

---

### 6. Funcionalidades Adicionales

#### Favoritos
- [ ] Agregar producto a favoritos
- [ ] Acceder a `/favoritos`
- [ ] Verificar persistencia al recargar
- [ ] Eliminar de favoritos

#### Búsqueda
- [ ] Abrir modal de búsqueda
- [ ] Buscar producto por nombre
- [ ] Verificar resultados
- [ ] Acceder a producto desde resultado

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

### Imágenes no se cargan
- Verificar credenciales de Cloudinary en `.env`
- Verificar que el usuario tiene rol ADMIN

### Error de autenticación
- Verificar `NEXTAUTH_SECRET` en `.env`
- Verificar `NEXTAUTH_URL` en `.env`
- Limpiar cookies del navegador
