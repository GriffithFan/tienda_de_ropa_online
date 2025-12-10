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

    // Crear la preferencia de pago
    const preference = new Preference(client);

    const preferenceData = await preference.create({
      body: {
        // Items del carrito
        items: items.map((item) => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          currency_id: 'ARS',
          picture_url: item.picture_url,
        })),

        // Datos del comprador
        payer: {
          name: payer.name,
          surname: payer.surname,
          email: payer.email,
          phone: payer.phone,
          identification: payer.identification,
          address: payer.address,
        },

        // URLs de retorno
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/confirmacion`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?error=payment_failed`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pendiente`,
        },

        // Redireccion automatica
        auto_return: 'approved',

        // Referencia externa para identificar la orden
        external_reference: orderId,

        // Configuracion de pagos
        payment_methods: {
          // Excluir ciertos metodos si es necesario
          excluded_payment_types: [],
          excluded_payment_methods: [],
          installments: 12, // Maximo de cuotas
          default_installments: 1,
        },

        // Modo binario: pago aprobado o rechazado, sin pendientes
        binary_mode: false,

        // Expiracion de la preferencia (24 horas)
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ).toISOString(),

        // Configuracion de notificaciones
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,

        // Statement descriptor (nombre que aparece en el resumen de tarjeta)
        statement_descriptor: 'KIRA STORE',
      },
    });

    return NextResponse.json({
      id: preferenceData.id,
      init_point: preferenceData.init_point,
      sandbox_init_point: preferenceData.sandbox_init_point,
    });
  } catch (error) {
    console.error('Error creando preferencia de MercadoPago:', error);

    return NextResponse.json(
      { error: 'Error al procesar el pago' },
      { status: 500 }
    );
  }
}
