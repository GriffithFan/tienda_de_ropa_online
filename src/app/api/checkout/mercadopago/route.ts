import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

/**
 * Inicializacion del cliente de MercadoPago
 * El access token debe configurarse en las variables de entorno
 */
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

/**
 * Interfaz para los items del carrito
 */
interface CartItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  picture_url?: string;
}

/**
 * Interfaz para los datos del comprador
 */
interface PayerData {
  name: string;
  surname: string;
  email: string;
  phone: {
    area_code: string;
    number: string;
  };
  identification: {
    type: string;
    number: string;
  };
  address: {
    street_name: string;
    street_number: string;
    zip_code: string;
  };
}

/**
 * POST /api/checkout/mercadopago
 * Crea una preferencia de pago en MercadoPago
 * 
 * @param request - Request con los items del carrito y datos del comprador
 * @returns URL de checkout de MercadoPago
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, payer, orderId } = body as {
      items: CartItem[];
      payer: PayerData;
      orderId: string;
    };

    // Determinar la URL base
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000';
    
    console.log('=== MercadoPago Debug ===');
    console.log('Base URL:', baseUrl);
    console.log('Items recibidos:', JSON.stringify(items, null, 2));
    console.log('Payer:', JSON.stringify(payer, null, 2));

    // Validacion basica de datos
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No hay items en el carrito' },
        { status: 400 }
      );
    }

    if (!payer || !payer.email) {
      return NextResponse.json(
        { error: 'Datos del comprador incompletos' },
        { status: 400 }
      );
    }

    // Validar y preparar items
    const validatedItems = items.map((item) => ({
      id: String(item.id),
      title: String(item.title || 'Producto'),
      quantity: Number(item.quantity) || 1,
      unit_price: Number(item.unit_price) || 0,
      currency_id: 'ARS' as const,
    }));

    console.log('Items validados:', JSON.stringify(validatedItems, null, 2));

    // Verificar que unit_price sea un número válido
    for (const item of validatedItems) {
      if (isNaN(item.unit_price) || item.unit_price <= 0) {
        console.error('Precio inválido para item:', item);
        return NextResponse.json(
          { error: `Precio inválido para: ${item.title}` },
          { status: 400 }
        );
      }
    }

    // Crear la preferencia de pago
    const preference = new Preference(client);

    // En desarrollo (localhost), no usar auto_return ya que MercadoPago no lo soporta
    const isLocalhost = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1');
    
    const preferenceBody: Record<string, unknown> = {
      items: validatedItems,
      payer: {
        name: payer.name,
        surname: payer.surname,
        email: payer.email,
      },
      external_reference: orderId,
      statement_descriptor: 'KURO STORE',
    };

    // Solo agregar back_urls y auto_return si NO es localhost
    if (!isLocalhost) {
      preferenceBody.back_urls = {
        success: `${baseUrl}/checkout/confirmacion`,
        failure: `${baseUrl}/checkout?error=payment_failed`,
        pending: `${baseUrl}/checkout/pendiente`,
      };
      preferenceBody.auto_return = 'approved';
    }

    console.log('Is localhost:', isLocalhost);
    console.log('Preference body:', JSON.stringify(preferenceBody, null, 2));

    const preferenceData = await preference.create({ body: preferenceBody as Parameters<typeof preference.create>[0]['body'] });

    return NextResponse.json({
      id: preferenceData.id,
      init_point: preferenceData.init_point,
      sandbox_init_point: preferenceData.sandbox_init_point,
    });
  } catch (error: unknown) {
    console.error('Error creando preferencia de MercadoPago:', error);

    // Detectar errores específicos de MercadoPago
    const mpError = error as { code?: string; message?: string };
    
    if (mpError?.code === 'unauthorized' || mpError?.message?.includes('invalid access token')) {
      return NextResponse.json(
        { error: 'Credenciales de MercadoPago inválidas o expiradas. Contacta al administrador.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Error al procesar el pago. Intenta nuevamente.' },
      { status: 500 }
    );
  }
}
