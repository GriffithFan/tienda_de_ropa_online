import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'KURO Store <pedidos@kuro.com.ar>';
const STORE_NAME = 'KURO';

/**
 * Template base para emails
 */
function emailTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${STORE_NAME}</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #0a0a0a;
      color: #ffffff;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      letter-spacing: 4px;
      font-weight: 700;
    }
    .content {
      padding: 40px 30px;
    }
    .footer {
      background-color: #f5f5f5;
      padding: 30px;
      text-align: center;
      font-size: 12px;
      color: #666666;
    }
    .btn {
      display: inline-block;
      background-color: #0a0a0a;
      color: #ffffff;
      padding: 14px 28px;
      text-decoration: none;
      font-weight: 600;
      margin: 20px 0;
    }
    .order-box {
      background-color: #f5f5f5;
      padding: 20px;
      margin: 20px 0;
      border-left: 4px solid #0a0a0a;
    }
    .product-row {
      display: flex;
      padding: 15px 0;
      border-bottom: 1px solid #eee;
    }
    .product-img {
      width: 80px;
      height: 80px;
      object-fit: cover;
    }
    .product-info {
      flex: 1;
      padding-left: 15px;
    }
    .total-row {
      font-size: 18px;
      font-weight: bold;
      padding: 20px 0;
      border-top: 2px solid #0a0a0a;
      margin-top: 10px;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .status-pending { background-color: #fef3c7; color: #92400e; }
    .status-confirmed { background-color: #dbeafe; color: #1e40af; }
    .status-shipped { background-color: #d1fae5; color: #065f46; }
    .status-delivered { background-color: #dcfce7; color: #166534; }
    @media only screen and (max-width: 600px) {
      .content { padding: 20px 15px; }
      .header { padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${STORE_NAME}</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>Este email fue enviado por ${STORE_NAME}</p>
      <p>Si tienes alguna consulta, respondenos a este email o escribinos por WhatsApp</p>
      <p>&copy; ${new Date().getFullYear()} ${STORE_NAME}. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>
  `;
}

interface OrderItem {
  name: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
  image?: string;
}

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  trackingNumber?: string;
}

/**
 * Email de confirmacion de pedido
 */
export async function sendOrderConfirmation(data: OrderEmailData) {
  const itemsHtml = data.items.map((item) => `
    <tr>
      <td style="padding: 15px 0; border-bottom: 1px solid #eee;">
        ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover;">` : ''}
      </td>
      <td style="padding: 15px 10px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong><br>
        <span style="color: #666; font-size: 14px;">Talle: ${item.size} | Color: ${item.color}</span>
      </td>
      <td style="padding: 15px 0; border-bottom: 1px solid #eee; text-align: center;">
        x${item.quantity}
      </td>
      <td style="padding: 15px 0; border-bottom: 1px solid #eee; text-align: right;">
        $${item.price.toLocaleString('es-AR')}
      </td>
    </tr>
  `).join('');

  const content = `
    <h2 style="margin-top: 0;">¡Gracias por tu compra, ${data.customerName}!</h2>
    
    <p>Tu pedido ha sido recibido y esta siendo procesado. Te enviaremos un email cuando sea despachado.</p>
    
    <div class="order-box">
      <strong>Numero de orden:</strong><br>
      <span style="font-size: 24px; font-family: monospace; letter-spacing: 2px;">${data.orderNumber}</span>
    </div>
    
    <h3>Detalle del pedido</h3>
    <table style="width: 100%; border-collapse: collapse;">
      ${itemsHtml}
    </table>
    
    <table style="width: 100%; margin-top: 20px;">
      <tr>
        <td style="padding: 8px 0;">Subtotal</td>
        <td style="text-align: right;">$${data.subtotal.toLocaleString('es-AR')}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0;">Envio</td>
        <td style="text-align: right;">${data.shipping === 0 ? 'GRATIS' : '$' + data.shipping.toLocaleString('es-AR')}</td>
      </tr>
      ${data.discount > 0 ? `
      <tr>
        <td style="padding: 8px 0; color: #16a34a;">Descuento</td>
        <td style="text-align: right; color: #16a34a;">-$${data.discount.toLocaleString('es-AR')}</td>
      </tr>
      ` : ''}
      <tr class="total-row">
        <td style="padding: 15px 0; border-top: 2px solid #0a0a0a;"><strong>Total</strong></td>
        <td style="text-align: right; padding: 15px 0; border-top: 2px solid #0a0a0a;"><strong>$${data.total.toLocaleString('es-AR')}</strong></td>
      </tr>
    </table>
    
    <h3>Direccion de envio</h3>
    <p style="background-color: #f5f5f5; padding: 15px;">
      ${data.shippingAddress.street}<br>
      ${data.shippingAddress.city}, ${data.shippingAddress.province}<br>
      CP: ${data.shippingAddress.postalCode}
    </p>
    
    <p style="text-align: center; margin-top: 30px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/cuenta/pedidos" class="btn">Ver mi pedido</a>
    </p>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Pedido confirmado #${data.orderNumber}`,
      html: emailTemplate(content),
    });
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Error enviando email de confirmacion:', error);
    return { success: false, error };
  }
}

/**
 * Email de pedido enviado
 */
export async function sendOrderShipped(data: OrderEmailData) {
  const content = `
    <h2 style="margin-top: 0;">¡Tu pedido esta en camino!</h2>
    
    <p>Hola ${data.customerName},</p>
    
    <p>Tu pedido <strong>#${data.orderNumber}</strong> ha sido despachado y esta en camino a tu direccion.</p>
    
    ${data.trackingNumber ? `
    <div class="order-box">
      <strong>Numero de seguimiento:</strong><br>
      <span style="font-size: 20px; font-family: monospace; letter-spacing: 2px;">${data.trackingNumber}</span>
    </div>
    ` : ''}
    
    <h3>Direccion de entrega</h3>
    <p style="background-color: #f5f5f5; padding: 15px;">
      ${data.shippingAddress.street}<br>
      ${data.shippingAddress.city}, ${data.shippingAddress.province}<br>
      CP: ${data.shippingAddress.postalCode}
    </p>
    
    <p>Tiempo estimado de entrega: <strong>3-5 dias habiles</strong></p>
    
    <p style="text-align: center; margin-top: 30px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/cuenta/pedidos" class="btn">Seguir mi pedido</a>
    </p>
    
    <p style="color: #666; font-size: 14px;">
      Si tenes alguna consulta sobre tu envio, no dudes en contactarnos.
    </p>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Tu pedido #${data.orderNumber} fue enviado`,
      html: emailTemplate(content),
    });
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Error enviando email de envio:', error);
    return { success: false, error };
  }
}

/**
 * Email de pedido entregado
 */
export async function sendOrderDelivered(data: OrderEmailData) {
  const content = `
    <h2 style="margin-top: 0;">¡Tu pedido fue entregado!</h2>
    
    <p>Hola ${data.customerName},</p>
    
    <p>Tu pedido <strong>#${data.orderNumber}</strong> ha sido entregado exitosamente.</p>
    
    <p>Esperamos que disfrutes tu compra. Si tenes algun inconveniente, no dudes en contactarnos.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <p style="color: #666;">¿Te gusto tu compra?</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/productos" class="btn">Seguir comprando</a>
    </div>
    
    <p style="color: #666; font-size: 14px; text-align: center;">
      ¡Gracias por elegirnos!
    </p>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Pedido entregado #${data.orderNumber}`,
      html: emailTemplate(content),
    });
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Error enviando email de entrega:', error);
    return { success: false, error };
  }
}

/**
 * Email de bienvenida para nuevos usuarios
 */
export async function sendWelcomeEmail(email: string, name: string) {
  const content = `
    <h2 style="margin-top: 0;">¡Bienvenido a ${STORE_NAME}!</h2>
    
    <p>Hola ${name},</p>
    
    <p>Gracias por registrarte en ${STORE_NAME}. Ahora sos parte de nuestra comunidad de streetwear y moda alternativa.</p>
    
    <div class="order-box">
      <strong>Tu cuenta esta lista</strong><br>
      <span style="font-size: 14px;">Ya podes empezar a comprar y acceder a ofertas exclusivas</span>
    </div>
    
    <h3>¿Que podes hacer ahora?</h3>
    <ul>
      <li>Explorar nuestra coleccion de ropa alternativa</li>
      <li>Guardar productos en tus favoritos</li>
      <li>Recibir notificaciones de ofertas exclusivas</li>
      <li>Acceder a lanzamientos anticipados</li>
    </ul>
    
    <p style="text-align: center; margin-top: 30px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/productos" class="btn">Explorar tienda</a>
    </p>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Bienvenido a ${STORE_NAME}`,
      html: emailTemplate(content),
    });
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Error enviando email de bienvenida:', error);
    return { success: false, error };
  }
}

/**
 * Email de recuperacion de contrasena
 */
export async function sendPasswordResetEmail(email: string, name: string, resetUrl: string) {
  const content = `
    <h2 style="margin-top: 0;">Recuperar contrasena</h2>
    
    <p>Hola ${name},</p>
    
    <p>Recibimos una solicitud para restablecer la contrasena de tu cuenta en ${STORE_NAME}.</p>
    
    <p style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" class="btn">Restablecer contrasena</a>
    </p>
    
    <p style="color: #666; font-size: 14px;">
      Este enlace expirara en 1 hora por motivos de seguridad.
    </p>
    
    <p style="color: #666; font-size: 14px;">
      Si no solicitaste este cambio, podes ignorar este email. Tu contrasena permanecera sin cambios.
    </p>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Restablecer contrasena - ${STORE_NAME}`,
      html: emailTemplate(content),
    });
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Error enviando email de recuperacion:', error);
    return { success: false, error };
  }
}

/**
 * Email de contacto recibido
 */
export async function sendContactNotification(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@kuro.com.ar';
  
  const content = `
    <h2 style="margin-top: 0;">Nuevo mensaje de contacto</h2>
    
    <div class="order-box">
      <p><strong>De:</strong> ${data.name} (${data.email})</p>
      <p><strong>Asunto:</strong> ${data.subject}</p>
    </div>
    
    <h3>Mensaje:</h3>
    <p style="background-color: #f5f5f5; padding: 20px; white-space: pre-wrap;">${data.message}</p>
    
    <p style="color: #666; font-size: 14px;">
      Responde directamente a este email para contactar al cliente.
    </p>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: adminEmail,
      replyTo: data.email,
      subject: `Contacto: ${data.subject}`,
      html: emailTemplate(content),
    });
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Error enviando notificacion de contacto:', error);
    return { success: false, error };
  }
}
