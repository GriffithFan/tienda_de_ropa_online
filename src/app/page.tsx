import {
  HeroBanner,
  ProductCarousel,
  CategoryGrid,
  FeaturesSection,
} from '@/components/home';
import {
  bannerSlides,
  categories,
  getFeaturedProducts,
  getNewProducts,
  getSaleProducts,
} from '@/data/products';

/**
 * Pagina de inicio de la tienda
 * Muestra banner, productos destacados, categorias y beneficios
 */
export default function HomePage() {
  const featuredProducts = getFeaturedProducts();
  const newProducts = getNewProducts();
  const saleProducts = getSaleProducts();

  return (
    <>
      {/* Banner principal con carrusel */}
      <HeroBanner slides={bannerSlides} />

      {/* Productos nuevos */}
      <ProductCarousel
        title="Novedades"
        subtitle="Los ultimos disenos de nuestra coleccion"
        products={newProducts}
        viewAllLink="/productos?filter=new"
      />

      {/* Grid de categorias */}
      <CategoryGrid categories={categories} />

      {/* Productos destacados */}
      <ProductCarousel
        title="Destacados"
        subtitle="Los mas elegidos por nuestra comunidad"
        products={featuredProducts}
        viewAllLink="/productos?filter=featured"
      />

      {/* Seccion de beneficios */}
      <FeaturesSection />

      {/* Ofertas */}
      {saleProducts.length > 0 && (
        <ProductCarousel
          title="Ofertas"
          subtitle="Aprovecha los mejores descuentos"
          products={saleProducts}
          viewAllLink="/productos?filter=sale"
        />
      )}
    </>
  );
}
