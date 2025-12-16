import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Crear usuario admin
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kurostore.com' },
    update: {},
    create: {
      email: 'admin@kurostore.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'KURO',
      role: 'ADMIN',
    },
  });
  console.log('Admin user created:', admin.email);

  // Crear categorias
  const categoriesData = [
    { name: 'Remeras', slug: 'remeras', description: 'Remeras con disenos unicos', order: 1 },
    { name: 'Hoodies', slug: 'hoodies', description: 'Hoodies y buzos oversize', order: 2 },
    { name: 'Pants', slug: 'pants', description: 'Pantalones cargo y joggers', order: 3 },
    { name: 'Shorts', slug: 'shorts', description: 'Shorts y bermudas', order: 4 },
    { name: 'Accesorios', slug: 'accesorios', description: 'Gorras, bolsos y mas', order: 5 },
    { name: 'Calzado', slug: 'calzado', description: 'Zapatillas y botas', order: 6 },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log('Categories created');

  // Obtener categoria de remeras
  const remerasCategory = await prisma.category.findUnique({ where: { slug: 'remeras' } });
  const hoodiesCategory = await prisma.category.findUnique({ where: { slug: 'hoodies' } });

  if (remerasCategory) {
    // Crear productos de ejemplo
    const productsData = [
      {
        name: 'Remera Dragon Spirit',
        slug: 'remera-dragon-spirit',
        description: 'Remera oversize con estampado de dragon japones. Algodon 100%, ideal para un look streetwear autentico.',
        price: 25000,
        compareAtPrice: 32000,
        categoryId: remerasCategory.id,
        stock: 50,
        isNew: true,
        isFeatured: true,
        isOnSale: true,
        tags: ['dragon', 'japones', 'oversize'],
      },
      {
        name: 'Remera Kanji Dark',
        slug: 'remera-kanji-dark',
        description: 'Remera negra con kanjis en blanco. Corte relajado, perfecta para combinar con cualquier outfit.',
        price: 22000,
        categoryId: remerasCategory.id,
        stock: 35,
        isNew: true,
        tags: ['kanji', 'minimalista'],
      },
      {
        name: 'Remera Oni Mask',
        slug: 'remera-oni-mask',
        description: 'Remera con estampado de mascara Oni tradicional. Diseno exclusivo, edicion limitada.',
        price: 28000,
        categoryId: remerasCategory.id,
        stock: 20,
        isFeatured: true,
        tags: ['oni', 'mascara', 'tradicional'],
      },
    ];

    for (const prod of productsData) {
      const product = await prisma.product.upsert({
        where: { slug: prod.slug },
        update: prod,
        create: prod,
      });

      // Agregar imagenes
      await prisma.productImage.createMany({
        data: [
          { productId: product.id, url: '/products/placeholder-1.jpg', order: 0 },
          { productId: product.id, url: '/products/placeholder-2.jpg', order: 1 },
        ],
        skipDuplicates: true,
      });

      // Agregar talles
      const sizes = ['XS', 'S', 'M', 'L', 'XL'];
      for (const size of sizes) {
        await prisma.productSize.upsert({
          where: { id: `${product.id}-${size}` },
          update: { stock: 10 },
          create: { id: `${product.id}-${size}`, productId: product.id, size, stock: 10 },
        });
      }

      // Agregar colores
      const colors = [
        { name: 'Negro', hex: '#000000' },
        { name: 'Blanco', hex: '#FFFFFF' },
      ];
      for (const color of colors) {
        await prisma.productColor.upsert({
          where: { id: `${product.id}-${color.name}` },
          update: color,
          create: { id: `${product.id}-${color.name}`, productId: product.id, ...color },
        });
      }
    }
    console.log('Products created');
  }

  // Crear banners
  await prisma.banner.createMany({
    data: [
      {
        title: 'Nueva Coleccion',
        subtitle: 'Descubre los nuevos disenos de temporada',
        buttonText: 'Ver Coleccion',
        buttonLink: '/productos',
        image: '/banners/banner-1.jpg',
        order: 0,
      },
      {
        title: 'Ofertas de Invierno',
        subtitle: 'Hasta 40% OFF en hoodies y buzos',
        buttonText: 'Ver Ofertas',
        buttonLink: '/ofertas',
        image: '/banners/banner-2.jpg',
        order: 1,
      },
    ],
    skipDuplicates: true,
  });
  console.log('Banners created');

  // Crear anuncios
  await prisma.announcement.createMany({
    data: [
      { text: 'ENVIOS GRATIS A TODO EL PAIS EN COMPRAS MAYORES A $150.000', order: 0 },
      { text: '10% OFF PAGANDO POR TRANSFERENCIA', order: 1 },
      { text: '3 CUOTAS SIN INTERES CON TODAS LAS TARJETAS', order: 2 },
    ],
    skipDuplicates: true,
  });
  console.log('Announcements created');

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
