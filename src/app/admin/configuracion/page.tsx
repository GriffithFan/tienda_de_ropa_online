'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Store, Mail, CreditCard, Truck, Globe, Bell, Shield, Palette, Image } from 'lucide-react';
import toast from 'react-hot-toast';

interface SiteSettings {
  general: {
    siteName: string;
    siteDescription: string;
    logo: string;
    favicon: string;
    contactEmail: string;
    contactPhone: string;
    whatsapp: string;
    address: string;
  };
  appearance: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    darkMode: boolean;
    showAnnouncement: boolean;
    announcementText: string;
  };
  ecommerce: {
    currency: string;
    currencySymbol: string;
    taxRate: number;
    freeShippingThreshold: number;
    enableGuestCheckout: boolean;
    enableReviews: boolean;
    enableWishlist: boolean;
  };
  shipping: {
    defaultShippingCost: number;
    estimatedDeliveryDays: string;
    enableLocalPickup: boolean;
    localPickupAddress: string;
  };
  payment: {
    enableMercadoPago: boolean;
    enableBankTransfer: boolean;
    bankDetails: string;
    enableCashOnDelivery: boolean;
  };
  email: {
    enableOrderConfirmation: boolean;
    enableShippingNotification: boolean;
    enableWelcomeEmail: boolean;
    senderName: string;
    senderEmail: string;
  };
  social: {
    instagram: string;
    facebook: string;
    twitter: string;
    tiktok: string;
    pinterest: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    ogImage: string;
  };
}

const defaultSettings: SiteSettings = {
  general: {
    siteName: 'UNDER',
    siteDescription: 'Tienda de ropa alternativa y estilo japonés',
    logo: '/logo.svg',
    favicon: '/favicon.ico',
    contactEmail: 'contacto@under.com',
    contactPhone: '+52 55 1234 5678',
    whatsapp: '+52 55 1234 5678',
    address: 'Ciudad de México, México',
  },
  appearance: {
    primaryColor: '#000000',
    secondaryColor: '#171717',
    accentColor: '#ffffff',
    darkMode: true,
    showAnnouncement: true,
    announcementText: 'Envío gratis en compras mayores a $999',
  },
  ecommerce: {
    currency: 'MXN',
    currencySymbol: '$',
    taxRate: 16,
    freeShippingThreshold: 999,
    enableGuestCheckout: true,
    enableReviews: true,
    enableWishlist: true,
  },
  shipping: {
    defaultShippingCost: 99,
    estimatedDeliveryDays: '3-5',
    enableLocalPickup: false,
    localPickupAddress: '',
  },
  payment: {
    enableMercadoPago: true,
    enableBankTransfer: true,
    bankDetails: 'BBVA\nClabe: 0123456789012345678\nNombre: UNDER CLOTHING SA DE CV',
    enableCashOnDelivery: false,
  },
  email: {
    enableOrderConfirmation: true,
    enableShippingNotification: true,
    enableWelcomeEmail: true,
    senderName: 'UNDER',
    senderEmail: 'noreply@under.com',
  },
  social: {
    instagram: 'https://instagram.com/under',
    facebook: '',
    twitter: '',
    tiktok: '',
    pinterest: '',
  },
  seo: {
    metaTitle: 'UNDER | Ropa Alternativa & Estilo Japonés',
    metaDescription: 'Descubre la mejor selección de ropa alternativa, streetwear japonés y moda underground.',
    keywords: 'ropa alternativa, estilo japonés, streetwear, moda underground, techwear',
    ogImage: '/og-image.jpg',
  },
};

const tabs = [
  { id: 'general', label: 'General', icon: Store },
  { id: 'appearance', label: 'Apariencia', icon: Palette },
  { id: 'ecommerce', label: 'E-commerce', icon: CreditCard },
  { id: 'shipping', label: 'Envío', icon: Truck },
  { id: 'payment', label: 'Pagos', icon: CreditCard },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'social', label: 'Redes', icon: Globe },
  { id: 'seo', label: 'SEO', icon: Shield },
];

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Cargar configuración guardada del localStorage o API
    const saved = localStorage.getItem('siteSettings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch {
        // Usar configuración por defecto
      }
    }
  }, []);

  const handleChange = (section: keyof SiteSettings, field: string, value: unknown) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Guardar en localStorage (en producción sería API)
      localStorage.setItem('siteSettings', JSON.stringify(settings));
      
      // Aquí iría la llamada a la API
      // await fetch('/api/admin/settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings),
      // });
      
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simular delay
      toast.success('Configuración guardada');
      setHasChanges(false);
    } catch {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Nombre del sitio
          </label>
          <input
            type="text"
            value={settings.general.siteName}
            onChange={(e) => handleChange('general', 'siteName', e.target.value)}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-zinc-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Email de contacto
          </label>
          <input
            type="email"
            value={settings.general.contactEmail}
            onChange={(e) => handleChange('general', 'contactEmail', e.target.value)}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-zinc-600"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Descripción del sitio
        </label>
        <textarea
          value={settings.general.siteDescription}
          onChange={(e) => handleChange('general', 'siteDescription', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-zinc-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Teléfono
          </label>
          <input
            type="tel"
            value={settings.general.contactPhone}
            onChange={(e) => handleChange('general', 'contactPhone', e.target.value)}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-zinc-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            WhatsApp
          </label>
          <input
            type="tel"
            value={settings.general.whatsapp}
            onChange={(e) => handleChange('general', 'whatsapp', e.target.value)}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-zinc-600"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Dirección
        </label>
        <input
          type="text"
          value={settings.general.address}
          onChange={(e) => handleChange('general', 'address', e.target.value)}
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-zinc-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Logo
          </label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
              <Image className="w-8 h-8 text-zinc-500" />
            </div>
            <button className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm hover:bg-zinc-700 transition-colors">
              Cambiar logo
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Favicon
          </label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
              <Image className="w-8 h-8 text-zinc-500" />
            </div>
            <button className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm hover:bg-zinc-700 transition-colors">
              Cambiar favicon
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Color primario
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={settings.appearance.primaryColor}
              onChange={(e) => handleChange('appearance', 'primaryColor', e.target.value)}
              className="w-12 h-12 rounded-lg cursor-pointer border-0"
            />
            <input
              type="text"
              value={settings.appearance.primaryColor}
              onChange={(e) => handleChange('appearance', 'primaryColor', e.target.value)}
              className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white/20"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Color secundario
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={settings.appearance.secondaryColor}
              onChange={(e) => handleChange('appearance', 'secondaryColor', e.target.value)}
              className="w-12 h-12 rounded-lg cursor-pointer border-0"
            />
            <input
              type="text"
              value={settings.appearance.secondaryColor}
              onChange={(e) => handleChange('appearance', 'secondaryColor', e.target.value)}
              className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white/20"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Color de acento
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={settings.appearance.accentColor}
              onChange={(e) => handleChange('appearance', 'accentColor', e.target.value)}
              className="w-12 h-12 rounded-lg cursor-pointer border-0"
            />
            <input
              type="text"
              value={settings.appearance.accentColor}
              onChange={(e) => handleChange('appearance', 'accentColor', e.target.value)}
              className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white/20"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
        <div>
          <h4 className="font-medium">Modo oscuro</h4>
          <p className="text-sm text-zinc-400">Usar tema oscuro en todo el sitio</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.appearance.darkMode}
            onChange={(e) => handleChange('appearance', 'darkMode', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
        </label>
      </div>

      <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
        <div>
          <h4 className="font-medium">Barra de anuncio</h4>
          <p className="text-sm text-zinc-400">Mostrar barra de anuncio en la parte superior</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.appearance.showAnnouncement}
            onChange={(e) => handleChange('appearance', 'showAnnouncement', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
        </label>
      </div>

      {settings.appearance.showAnnouncement && (
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Texto del anuncio
          </label>
          <input
            type="text"
            value={settings.appearance.announcementText}
            onChange={(e) => handleChange('appearance', 'announcementText', e.target.value)}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white/20"
          />
        </div>
      )}
    </div>
  );

  const renderEcommerceTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Moneda
          </label>
          <select
            value={settings.ecommerce.currency}
            onChange={(e) => handleChange('ecommerce', 'currency', e.target.value)}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white/20"
          >
            <option value="MXN">MXN - Peso Mexicano</option>
            <option value="USD">USD - Dólar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="COP">COP - Peso Colombiano</option>
            <option value="ARS">ARS - Peso Argentino</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Símbolo
          </label>
          <input
            type="text"
            value={settings.ecommerce.currencySymbol}
            onChange={(e) => handleChange('ecommerce', 'currencySymbol', e.target.value)}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            IVA (%)
          </label>
          <input
            type="number"
            value={settings.ecommerce.taxRate}
            onChange={(e) => handleChange('ecommerce', 'taxRate', Number(e.target.value))}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white/20"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Envío gratis desde ($)
        </label>
        <input
          type="number"
          value={settings.ecommerce.freeShippingThreshold}
          onChange={(e) => handleChange('ecommerce', 'freeShippingThreshold', Number(e.target.value))}
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white/20"
        />
        <p className="text-sm text-zinc-400 mt-1">Monto mínimo de compra para envío gratis. Pon 0 para desactivar.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
          <div>
            <h4 className="font-medium">Checkout como invitado</h4>
            <p className="text-sm text-zinc-400">Permitir comprar sin crear cuenta</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.ecommerce.enableGuestCheckout}
              onChange={(e) => handleChange('ecommerce', 'enableGuestCheckout', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
          <div>
            <h4 className="font-medium">Reseñas</h4>
            <p className="text-sm text-zinc-400">Permitir que los clientes dejen reseñas</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.ecommerce.enableReviews}
              onChange={(e) => handleChange('ecommerce', 'enableReviews', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
          <div>
            <h4 className="font-medium">Lista de deseos</h4>
            <p className="text-sm text-zinc-400">Permitir guardar productos favoritos</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.ecommerce.enableWishlist}
              onChange={(e) => handleChange('ecommerce', 'enableWishlist', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderShippingTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Costo de envío por defecto ($)
          </label>
          <input
            type="number"
            value={settings.shipping.defaultShippingCost}
            onChange={(e) => handleChange('shipping', 'defaultShippingCost', Number(e.target.value))}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Días estimados de entrega
          </label>
          <input
            type="text"
            value={settings.shipping.estimatedDeliveryDays}
            onChange={(e) => handleChange('shipping', 'estimatedDeliveryDays', e.target.value)}
            placeholder="3-5"
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white/20"
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
        <div>
          <h4 className="font-medium">Recolección en tienda</h4>
          <p className="text-sm text-zinc-400">Permitir que los clientes recojan en tienda</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.shipping.enableLocalPickup}
            onChange={(e) => handleChange('shipping', 'enableLocalPickup', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
        </label>
      </div>

      {settings.shipping.enableLocalPickup && (
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Dirección de recolección
          </label>
          <textarea
            value={settings.shipping.localPickupAddress}
            onChange={(e) => handleChange('shipping', 'localPickupAddress', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white/20"
          />
        </div>
      )}
    </div>
  );

  const renderPaymentTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-medium">MercadoPago</h4>
            <p className="text-sm text-zinc-400">Tarjetas, OXXO, transferencias</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.payment.enableMercadoPago}
            onChange={(e) => handleChange('payment', 'enableMercadoPago', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
        </label>
      </div>

      <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-medium">Transferencia bancaria</h4>
            <p className="text-sm text-zinc-400">Pago directo a cuenta bancaria</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.payment.enableBankTransfer}
            onChange={(e) => handleChange('payment', 'enableBankTransfer', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
        </label>
      </div>

      {settings.payment.enableBankTransfer && (
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Datos bancarios
          </label>
          <textarea
            value={settings.payment.bankDetails}
            onChange={(e) => handleChange('payment', 'bankDetails', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 font-mono text-sm"
          />
        </div>
      )}

      <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-medium">Pago contra entrega</h4>
            <p className="text-sm text-zinc-400">Pagar al recibir el pedido</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.payment.enableCashOnDelivery}
            onChange={(e) => handleChange('payment', 'enableCashOnDelivery', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
        </label>
      </div>
    </div>
  );

  const renderEmailTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Nombre del remitente
          </label>
          <input
            type="text"
            value={settings.email.senderName}
            onChange={(e) => handleChange('email', 'senderName', e.target.value)}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Email del remitente
          </label>
          <input
            type="email"
            value={settings.email.senderEmail}
            onChange={(e) => handleChange('email', 'senderEmail', e.target.value)}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white/20"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
          <div>
            <h4 className="font-medium">Confirmación de pedido</h4>
            <p className="text-sm text-zinc-400">Enviar email cuando se confirma un pedido</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.email.enableOrderConfirmation}
              onChange={(e) => handleChange('email', 'enableOrderConfirmation', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
          <div>
            <h4 className="font-medium">Notificación de envío</h4>
            <p className="text-sm text-zinc-400">Enviar email cuando se envía el pedido</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.email.enableShippingNotification}
              onChange={(e) => handleChange('email', 'enableShippingNotification', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
          <div>
            <h4 className="font-medium">Email de bienvenida</h4>
            <p className="text-sm text-zinc-400">Enviar email cuando un usuario se registra</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.email.enableWelcomeEmail}
              onChange={(e) => handleChange('email', 'enableWelcomeEmail', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSocialTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Instagram
        </label>
        <input
          type="url"
          value={settings.social.instagram}
          onChange={(e) => handleChange('social', 'instagram', e.target.value)}
          placeholder="https://instagram.com/tutienda"
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white/20"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Facebook
        </label>
        <input
          type="url"
          value={settings.social.facebook}
          onChange={(e) => handleChange('social', 'facebook', e.target.value)}
          placeholder="https://facebook.com/tutienda"
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white/20"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          TikTok
        </label>
        <input
          type="url"
          value={settings.social.tiktok}
          onChange={(e) => handleChange('social', 'tiktok', e.target.value)}
          placeholder="https://tiktok.com/@tutienda"
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white/20"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Twitter/X
        </label>
        <input
          type="url"
          value={settings.social.twitter}
          onChange={(e) => handleChange('social', 'twitter', e.target.value)}
          placeholder="https://twitter.com/tutienda"
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white/20"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Pinterest
        </label>
        <input
          type="url"
          value={settings.social.pinterest}
          onChange={(e) => handleChange('social', 'pinterest', e.target.value)}
          placeholder="https://pinterest.com/tutienda"
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white/20"
        />
      </div>
    </div>
  );

  const renderSEOTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Título SEO
        </label>
        <input
          type="text"
          value={settings.seo.metaTitle}
          onChange={(e) => handleChange('seo', 'metaTitle', e.target.value)}
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white/20"
        />
        <p className="text-sm text-zinc-400 mt-1">{settings.seo.metaTitle.length}/60 caracteres</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Meta descripción
        </label>
        <textarea
          value={settings.seo.metaDescription}
          onChange={(e) => handleChange('seo', 'metaDescription', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white/20"
        />
        <p className="text-sm text-zinc-400 mt-1">{settings.seo.metaDescription.length}/160 caracteres</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Palabras clave
        </label>
        <input
          type="text"
          value={settings.seo.keywords}
          onChange={(e) => handleChange('seo', 'keywords', e.target.value)}
          placeholder="palabra1, palabra2, palabra3"
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white/20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Imagen OG (redes sociales)
        </label>
        <div className="flex items-center gap-4">
          <div className="w-32 h-20 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
            <Image className="w-8 h-8 text-zinc-500" />
          </div>
          <button className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm hover:bg-zinc-700 transition-colors">
            Subir imagen
          </button>
        </div>
        <p className="text-sm text-zinc-400 mt-2">Recomendado: 1200x630px</p>
      </div>

      <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
        <h4 className="font-medium mb-3">Vista previa en Google</h4>
        <div className="text-blue-400 text-lg hover:underline cursor-pointer">
          {settings.seo.metaTitle}
        </div>
        <div className="text-green-500 text-sm">www.tutienda.com</div>
        <div className="text-zinc-400 text-sm">{settings.seo.metaDescription}</div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralTab();
      case 'appearance':
        return renderAppearanceTab();
      case 'ecommerce':
        return renderEcommerceTab();
      case 'shipping':
        return renderShippingTab();
      case 'payment':
        return renderPaymentTab();
      case 'email':
        return renderEmailTab();
      case 'social':
        return renderSocialTab();
      case 'seo':
        return renderSEOTab();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Configuración</h1>
          <p className="text-zinc-400 mt-1">Personaliza tu tienda</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </motion.button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-black'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
      >
        {renderTabContent()}
      </motion.div>

      {/* Unsaved Changes Warning */}
      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 bg-amber-500 text-black px-4 py-3 rounded-lg shadow-lg flex items-center gap-3"
        >
          <Bell className="w-5 h-5" />
          <span className="font-medium">Tienes cambios sin guardar</span>
        </motion.div>
      )}
    </div>
  );
}
