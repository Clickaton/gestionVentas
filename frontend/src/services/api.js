import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data) {
      const { error: errorMsg } = error.response.data;
      if (errorMsg) {
        console.error('API Error:', errorMsg);
        alert(errorMsg);
      }
    } else {
      console.error('Network Error:', error.message);
      alert('Error de conexión con el servidor.');
    }
    return Promise.reject(error);
  }
);

export const ProductosService = {
  getAll: () => api.get('/productos'),
  actualizarPrecios: (data) => api.post('/productos/actualizar-precios', data),
};

export const VentasService = {
  registrarVenta: (data) => api.post('/ventas', data),
  getHistorial: () => api.get('/ventas'),
};

export const CajaService = {
  abrir: (saldoInicial = 0) => api.post(`/caja/abrir?saldoInicial=${saldoInicial}`),
  cerrar: () => api.post('/caja/cerrar'),
  getBalance: () => api.get('/caja/balance'),
};

export default api;