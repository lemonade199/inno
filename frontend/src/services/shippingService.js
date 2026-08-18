import api from './api';
import { PROVINCES, getDefaultCities } from '../data/indonesiaRegions';

export const shippingService = {
  // Langsung pakai data statis, tidak perlu API call untuk provinsi & kota
  getProvinces: async () => {
    return { status: 'success', data: PROVINCES };
  },

  getCities: async (provinceId) => {
    const cities = getDefaultCities(String(provinceId));
    return { status: 'success', data: cities };
  },

  calculateCost: async (destinationCityId, items, courier = 'jne') => {
    try {
      const response = await api.post('/shipping/cost', {
        destination_city_id: destinationCityId,
        items: items,
        courier: courier
      });
      return response.data;
    } catch (err) {
      console.warn('Shipping cost API error, using estimasi:', err.message);
      const totalQty = items.reduce((s, i) => s + i.qty, 0);
      const weightGrams = totalQty * 500;
      const fallbackServices = [
        { code: 'REG', name: 'JNE REG', description: 'Layanan Reguler', price: 15000 + Math.ceil(weightGrams / 1000) * 5000, etd: '2-3' },
        { code: 'OKE', name: 'JNE OKE', description: 'Ongkos Kirim Ekonomis', price: 10000 + Math.ceil(weightGrams / 1000) * 3000, etd: '4-6' },
        { code: 'YES', name: 'JNE YES', description: 'Yakin Esok Sampai', price: 25000 + Math.ceil(weightGrams / 1000) * 8000, etd: '1' },
      ];
      return {
        status: 'success',
        data: {
          weight: weightGrams,
          shipping: { courier: 'JNE', services: fallbackServices }
        }
      };
    }
  }
};
