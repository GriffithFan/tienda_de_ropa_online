import Link from 'next/link';
import Image from 'next/image';

/**
 * Pagina de guia de talles
 * Muestra tablas de medidas para cada tipo de prenda
 */
export default function SizeGuidePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="container-custom py-8">
          <nav className="text-sm text-accent-muted mb-4">
            <Link href="/" className="hover:text-accent">
              Inicio
            </Link>
            <span className="mx-2">/</span>
            <span className="text-accent">Guia de Talles</span>
          </nav>
          <h1 className="section-title">Guia de Talles</h1>
          <p className="section-subtitle mt-2">
            Encontra tu talle ideal con nuestras tablas de medidas
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Como medir */}
          <section>
            <h2 className="font-display font-bold text-2xl mb-6 text-center">
              Como tomar tus medidas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MeasurementTip
                number={1}
                title="Ancho"
                description="Medi de axila a axila con la prenda extendida sobre una superficie plana."
              />
              <MeasurementTip
                number={2}
                title="Largo"
                description="Medi desde el punto mas alto del hombro hasta el borde inferior de la prenda."
              />
              <MeasurementTip
                number={3}
                title="Manga"
                description="Medi desde la costura del hombro hasta el final de la manga."
              />
            </div>
          </section>

          {/* Remeras Corte Regular */}
          <section>
            <h2 className="font-display font-bold text-2xl mb-6">
              Remeras - Corte Regular
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-medium">Talle</th>
                    <th className="text-center py-4 px-4 font-medium">Ancho (cm)</th>
                    <th className="text-center py-4 px-4 font-medium">Largo (cm)</th>
                    <th className="text-center py-4 px-4 font-medium">Manga (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <SizeRow talle="S" ancho={47} largo={67} manga={18} />
                  <SizeRow talle="M" ancho={50} largo={70} manga={19} />
                  <SizeRow talle="L" ancho={53} largo={73} manga={20} />
                  <SizeRow talle="XL" ancho={56} largo={76} manga={21} />
                  <SizeRow talle="XXL" ancho={59} largo={80} manga={22} />
                  <SizeRow talle="XXXL" ancho={62} largo={84} manga={23} />
                </tbody>
              </table>
            </div>
          </section>

          {/* Remeras Corte Oversize */}
          <section>
            <h2 className="font-display font-bold text-2xl mb-6">
              Remeras - Corte Oversize
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-medium">Talle</th>
                    <th className="text-center py-4 px-4 font-medium">Ancho (cm)</th>
                    <th className="text-center py-4 px-4 font-medium">Largo (cm)</th>
                    <th className="text-center py-4 px-4 font-medium">Manga (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <SizeRow talle="S" ancho={57} largo={70} manga={26} />
                  <SizeRow talle="M" ancho={60} largo={73} manga={27} />
                  <SizeRow talle="L" ancho={62} largo={76} manga={28} />
                  <SizeRow talle="XL" ancho={63} largo={78} manga={29} />
                  <SizeRow talle="XXL" ancho={65} largo={80} manga={30} />
                  <SizeRow talle="XXXL" ancho={67} largo={82} manga={31} />
                </tbody>
              </table>
            </div>
          </section>

          {/* Hoodies */}
          <section>
            <h2 className="font-display font-bold text-2xl mb-6">
              Hoodies / Buzos
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-medium">Talle</th>
                    <th className="text-center py-4 px-4 font-medium">Ancho (cm)</th>
                    <th className="text-center py-4 px-4 font-medium">Largo (cm)</th>
                    <th className="text-center py-4 px-4 font-medium">Manga (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <SizeRow talle="S" ancho={60} largo={70} manga={65} />
                  <SizeRow talle="M" ancho={63} largo={73} manga={67} />
                  <SizeRow talle="L" ancho={66} largo={76} manga={69} />
                  <SizeRow talle="XL" ancho={69} largo={79} manga={71} />
                  <SizeRow talle="XXL" ancho={72} largo={82} manga={73} />
                </tbody>
              </table>
            </div>
          </section>

          {/* Shorts */}
          <section>
            <h2 className="font-display font-bold text-2xl mb-6">
              Shorts
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-medium">Talle</th>
                    <th className="text-center py-4 px-4 font-medium">Cintura (cm)</th>
                    <th className="text-center py-4 px-4 font-medium">Largo (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <SizeRow talle="S" cintura={32} largo={43} />
                  <SizeRow talle="M" cintura={34} largo={44} />
                  <SizeRow talle="L" cintura={36} largo={45} />
                  <SizeRow talle="XL" cintura={38} largo={45} />
                  <SizeRow talle="XXL" cintura={39} largo={46} />
                </tbody>
              </table>
            </div>
            <p className="text-sm text-accent-muted mt-4 text-center">
              * La cintura tiene elastico y cede hasta 20 cm
            </p>
          </section>

          {/* Pants */}
          <section>
            <h2 className="font-display font-bold text-2xl mb-6">
              Pantalones
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-medium">Talle</th>
                    <th className="text-center py-4 px-4 font-medium">Cintura (cm)</th>
                    <th className="text-center py-4 px-4 font-medium">Largo (cm)</th>
                    <th className="text-center py-4 px-4 font-medium">Tiro (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <SizeRow talle="28" cintura={36} largo={100} tiro={28} />
                  <SizeRow talle="30" cintura={38} largo={102} tiro={29} />
                  <SizeRow talle="32" cintura={40} largo={104} tiro={30} />
                  <SizeRow talle="34" cintura={42} largo={106} tiro={31} />
                  <SizeRow talle="36" cintura={44} largo={108} tiro={32} />
                  <SizeRow talle="38" cintura={46} largo={108} tiro={33} />
                </tbody>
              </table>
            </div>
          </section>

          {/* Consejos */}
          <section className="card p-8 text-center">
            <h2 className="font-display font-bold text-xl mb-4">
              No estas seguro de tu talle?
            </h2>
            <p className="text-accent-muted mb-6">
              Escribinos por WhatsApp y te ayudamos a elegir el talle ideal para
              vos. Tambien podes consultarnos sobre las medidas de cualquier
              prenda especifica.
            </p>
            <a
              href="https://wa.me/5491112345678?text=Hola! Necesito ayuda para elegir mi talle"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex"
            >
              Consultar por WhatsApp
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}

/**
 * Componente de tip de medicion
 */
function MeasurementTip({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-accent text-background font-bold text-lg">
        {number}
      </div>
      <h3 className="font-medium mb-2">{title}</h3>
      <p className="text-sm text-accent-muted">{description}</p>
    </div>
  );
}

/**
 * Fila de tabla de talles
 */
function SizeRow({
  talle,
  ancho,
  largo,
  manga,
  cintura,
  tiro,
}: {
  talle: string;
  ancho?: number;
  largo: number;
  manga?: number;
  cintura?: number;
  tiro?: number;
}) {
  return (
    <tr className="border-b border-border hover:bg-surface/50 transition-colors">
      <td className="py-4 px-4 font-medium">{talle}</td>
      {ancho !== undefined && (
        <td className="text-center py-4 px-4">{ancho} cm</td>
      )}
      {cintura !== undefined && (
        <td className="text-center py-4 px-4">{cintura} cm</td>
      )}
      <td className="text-center py-4 px-4">{largo} cm</td>
      {manga !== undefined && (
        <td className="text-center py-4 px-4">{manga} cm</td>
      )}
      {tiro !== undefined && (
        <td className="text-center py-4 px-4">{tiro} cm</td>
      )}
    </tr>
  );
}
