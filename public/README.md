# 📁 Estructura de Assets - KIRA Store

Este directorio contiene todos los assets estaticos de la tienda.

## 📂 Carpetas

### `/images`
Imagenes generales del sitio.

### `/products`
Fotos de productos. Nombrar como: `{slug}-{numero}.jpg`
Ejemplo: `remera-dragon-spirit-1.jpg`, `remera-dragon-spirit-2.jpg`

### `/categories`
Imagenes para las categorias. Nombrar como: `{slug}.jpg`
Ejemplo: `remeras.jpg`, `hoodies.jpg`

### `/banners`
Imagenes para el carousel principal del home.
Resolucion recomendada: 1920x800px

### `/icons`
Iconos personalizados, logos de metodos de pago, etc.

### `/logos`
Logo de la marca en diferentes versiones y formatos.

## 📐 Especificaciones

### Productos
- **Formato**: JPG o WebP (preferido)
- **Tamano**: 800x1067px (ratio 3:4)
- **Peso**: Maximo 200KB por imagen

### Banners
- **Formato**: JPG o WebP
- **Desktop**: 1920x800px
- **Mobile**: 768x600px
- **Peso**: Maximo 300KB

### Categorias
- **Formato**: JPG o WebP
- **Tamano**: 600x800px
- **Peso**: Maximo 150KB

### Iconos
- **Formato**: SVG (preferido) o PNG
- **Tamano**: 64x64px para iconos pequenos
- **Fondo**: Transparente

## 🎨 Optimizacion

Las imagenes seran optimizadas automaticamente por Next.js.
Para mejor rendimiento, subir imagenes ya comprimidas.

Herramientas recomendadas:
- TinyPNG (https://tinypng.com)
- Squoosh (https://squoosh.app)
