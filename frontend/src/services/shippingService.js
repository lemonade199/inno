import api from './api';

export const shippingService = {
  getProvinces: async () => {
    const response = await api.get('/shipping/provinces');
    return response.data;
  },
  
  getCities: async (provinceId) => {
    const response = await api.get(`/shipping/cities/${provinceId}`);
    return response.data;
  },

  calculateCost: async (destinationCityId, items, courier = 'jne') => {
    const response = await api.post('/shipping/cost', {
      destination_city_id: destinationCityId,
      items: items,
      courier: courier
    });
    return response.data;
  }
};
