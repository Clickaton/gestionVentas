import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // We will let the components handle the error to use Toast instead of native alerts
    return Promise.reject(error);
  }
);

export const ProductosService = {
  getAll: () => api.get('/productos'),
  createProducto: (data) => api.post('/productos', data),
  actualizarPrecios: (data) => api.post('/productos/actualizar-precios', data),
  delete: (id) => api.delete(`/productos/${id}`),
};

export const VentasService = {
  registrarVenta: (data) => api.post('/ventas', data),
  getHistorial: () => api.get('/ventas'),
};

export const CajaService = {
  abrir: (saldoInicial = 0) => api.post(`/caja/abrir?saldoInicial=${saldoInicial}`),
  cerrar: () => api.post('/caja/cerrar'),
  getBalance: () => api.get('/caja'),
  registrarGasto: (data) => api.post('/caja/gastos', data),
};

export const ClientesService = {
  getAll: () => api.get('/clientes'),
  createCliente: (data) => api.post('/clientes', data),
  delete: (id) => api.delete(`/clientes/${id}`),
};

export const InventarioService = {
  getMovimientos: () => api.get('/inventario/movimientos'),
  registrarAjuste: (data) => api.post('/inventario/ajuste', data),
};

export const ReportesService = {
  getVentasSemana: () => api.get('/reportes/ventas-semana'),
  getTopProductos: () => api.get('/reportes/top-productos'),
};

export default api;