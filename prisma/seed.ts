import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Unsplash image URLs for product categories
 * Using specific photo IDs for consistency
 */
const IMAGES = {
  products: {
    remeras: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80',
    ],
    hoodies: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
      'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&q=80',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
      'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800&q=80',
    ],
    pants: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80',
    ],
    shorts: [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80',
      'https://images.unsplash.com/photo-1598522325074-042db73aa4e6?w=800&q=80',
    ],
    accesorios: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80',
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    ],
    calzado: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
    ],
  },
  banners: [
    'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&q=80',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80',
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80',
  ],
  categories: [
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80',
  ],
};

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
    { name: 'Remeras', slug: 'remeras', description: 'Remeras con disenos unicos', order: 1, image: IMAGES.categories[0] },
    { name: 'Hoodies', slug: 'hoodies', description: 'Hoodies y buzos oversize', order: 2, image: IMAGES.categories[1] },
    { name: 'Pants', slug: 'pants', description: 'Pantalones cargo y joggers', order: 3, image: IMAGES.categories[2] },
    { name: 'Shorts', slug: 'shorts', description: 'Shorts y bermudas', order: 4, image: IMAGES.categories[3] },
    { name: 'Accesorios', slug: 'accesorios', description: 'Gorras, bolsos y mas', order: 5, image: IMAGES.categories[4] },
    { name: 'Calzado', slug: 'calzado', description: 'Zapatillas y botas', order: 6, image: IMAGES.categories[5] },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log('Categories created');

  // Obtener categorias
  const remerasCategory = await prisma.category.findUnique({ where: { slug: 'remeras' } });
  const hoodiesCategory = await prisma.category.findUnique({ where: { slug: 'hoodies' } });
  const pantsCategory = await prisma.category.findUnique({ where: { slug: 'pants' } });
  const shortsCategory = await prisma.category.findUnique({ where: { slug: 'shorts' } });
  const accesoriosCategory = await prisma.category.findUnique({ where: { slug: 'accesorios' } });
  const calzadoCategory = await prisma.category.findUnique({ where: { slug: 'calzado' } });

  if (remerasCategory && hoodiesCategory && pantsCategory && shortsCategory && accesoriosCategory && calzadoCategory) {
    // Productos de Remeras
    const remerasProducts = [
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
        images: [IMAGES.products.remeras[0], IMAGES.products.remeras[1]],
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
        images: [IMAGES.products.remeras[2], IMAGES.products.remeras[3]],
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
        images: [IMAGES.products.remeras[4], IMAGES.products.remeras[5]],
      },
    ];

    // Productos de Hoodies
    const hoodiesProducts = [
      {
        name: 'Hoodie Shadow Black',
        slug: 'hoodie-shadow-black',
        description: 'Hoodie oversize negro con capucha doble. Interior afelpado, ideal para el invierno.',
        price: 45000,
        compareAtPrice: 55000,
        categoryId: hoodiesCategory.id,
        stock: 30,
        isNew: true,
        isFeatured: true,
        isOnSale: true,
        tags: ['oversize', 'negro', 'invierno'],
        images: [IMAGES.products.hoodies[0], IMAGES.products.hoodies[1]],
      },
      {
        name: 'Hoodie Street Art',
        slug: 'hoodie-street-art',
        description: 'Hoodie con estampado de graffiti en la espalda. Algodon premium, ajuste regular.',
        price: 42000,
        categoryId: hoodiesCategory.id,
        stock: 25,
        tags: ['graffiti', 'urbano'],
        images: [IMAGES.products.hoodies[2], IMAGES.products.hoodies[3]],
      },
    ];

    // Productos de Pants
    const pantsProducts = [
      {
        name: 'Cargo Pants Tactical',
        slug: 'cargo-pants-tactical',
        description: 'Pantalon cargo con multiples bolsillos. Tela resistente, perfecto para el dia a dia.',
        price: 38000,
        categoryId: pantsCategory.id,
        stock: 40,
        isNew: true,
        isFeatured: true,
        tags: ['cargo', 'tactico', 'streetwear'],
        images: [IMAGES.products.pants[0], IMAGES.products.pants[1]],
      },
      {
        name: 'Jogger Urban Fit',
        slug: 'jogger-urban-fit',
        description: 'Jogger con ajuste en los tobillos. Tela elastizada, comodidad maxima.',
        price: 32000,
        compareAtPrice: 38000,
        categoryId: pantsCategory.id,
        stock: 35,
        isOnSale: true,
        tags: ['jogger', 'comodo'],
        images: [IMAGES.products.pants[1], IMAGES.products.pants[2]],
      },
    ];

    // Productos de Shorts
    const shortsProducts = [
      {
        name: 'Short Mesh Basketball',
        slug: 'short-mesh-basketball',
        description: 'Short de malla estilo basketball. Ligero y transpirable.',
        price: 18000,
        categoryId: shortsCategory.id,
        stock: 45,
        isNew: true,
        tags: ['basketball', 'deportivo'],
        images: [IMAGES.products.shorts[0], IMAGES.products.shorts[1]],
      },
    ];

    // Productos de Accesorios
    const accesoriosProducts = [
      {
        name: 'Gorra Snapback Classic',
        slug: 'gorra-snapback-classic',
        description: 'Gorra snapback con logo bordado. Ajuste universal.',
        price: 12000,
        categoryId: accesoriosCategory.id,
        stock: 60,
        isFeatured: true,
        tags: ['gorra', 'snapback'],
        images: [IMAGES.products.accesorios[0], IMAGES.products.accesorios[1]],
      },
      {
        name: 'Mochila Urban Carrier',
        slug: 'mochila-urban-carrier',
        description: 'Mochila con compartimento para laptop. Resistente al agua.',
        price: 35000,
        categoryId: accesoriosCategory.id,
        stock: 20,
        isNew: true,
        tags: ['mochila', 'laptop'],
        images: [IMAGES.products.accesorios[2], IMAGES.products.accesorios[0]],
      },
    ];

    // Productos de Calzado
    const calzadoProducts = [
      {
        name: 'Sneakers Urban Runner',
        slug: 'sneakers-urban-runner',
        description: 'Zapatillas urbanas con suela chunky. Comodidad y estilo.',
        price: 55000,
        compareAtPrice: 68000,
        categoryId: calzadoCategory.id,
        stock: 25,
        isFeatured: true,
        isOnSale: true,
        tags: ['sneakers', 'chunky'],
        images: [IMAGES.products.calzado[0], IMAGES.products.calzado[1]],
      },
      {
        name: 'High Tops Street',
        slug: 'high-tops-street',
        description: 'Zapatillas bota alta estilo street. Cuero sintetico premium.',
        price: 48000,
        categoryId: calzadoCategory.id,
        stock: 30,
        isNew: true,
        tags: ['high-tops', 'bota'],
        images: [IMAGES.products.calzado[2], IMAGES.products.calzado[0]],
      },
    ];

    const allProducts = [
      ...remerasProducts,
      ...hoodiesProducts,
      ...pantsProducts,
      ...shortsProducts,
      ...accesoriosProducts,
      ...calzadoProducts,
    ];

    for (const prod of allProducts) {
      const { images, ...productData } = prod;
      const product = await prisma.product.upsert({
        where: { slug: prod.slug },
        update: productData,
        create: productData,
      });

      // Agregar imagenes
      await prisma.productImage.deleteMany({ where: { productId: product.id } });
      await prisma.productImage.createMany({
        data: images.map((url, index) => ({
          productId: product.id,
          url,
          order: index,
        })),
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
    console.log('Products created: ' + allProducts.length + ' items');
  }

  // Crear banners
  await prisma.banner.deleteMany({});
  await prisma.banner.createMany({
    data: [
      {
        title: 'Nueva Coleccion',
        subtitle: 'Descubre los nuevos disenos de temporada',
        buttonText: 'Ver Coleccion',
        buttonLink: '/productos',
        image: IMAGES.banners[0],
        order: 0,
      },
      {
        title: 'Ofertas de Invierno',
        subtitle: 'Hasta 40% OFF en hoodies y buzos',
        buttonText: 'Ver Ofertas',
        buttonLink: '/ofertas',
        image: IMAGES.banners[1],
        order: 1,
      },
      {
        title: 'Streetwear Premium',
        subtitle: 'Estilo urbano con la mejor calidad',
        buttonText: 'Explorar',
        buttonLink: '/productos',
        image: IMAGES.banners[2],
        order: 2,
      },
    ],
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
