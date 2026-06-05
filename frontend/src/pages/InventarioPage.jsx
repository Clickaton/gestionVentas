import React, { useState, useEffect } from 'react';
import { InventarioService, ProductosService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Settings2, ArrowDownCircle, ArrowUpCircle, RefreshCcw } from 'lucide-react';
import Modal from '../components/Modal';

const InventarioPage = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  const [ajusteData, setAjusteData] = useState({
    productoId: '',
    tipo: 'INGRESO',
    cantidad: '',
    motivo: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [movRes, prodRes] = await Promise.all([
        InventarioService.getMovimientos(),
        ProductosService.getAll()
      ]);
      setMovimientos(movRes.data);
      setProductos(prodRes.data.filter(p => p.activo));
    } catch (error) {
      showToast('Error al cargar datos del inventario', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAjuste = async (e) => {
    e.preventDefault();
    try {
      await InventarioService.registrarAjuste({
        ...ajusteData,
        productoId: parseInt(ajusteData.productoId, 10),
        cantidad: parseInt(ajusteData.cantidad, 10)
      });
      setIsModalOpen(false);
      setAjusteData({ productoId: '', tipo: 'INGRESO', cantidad: '', motivo: '' });
      fetchData();
      showToast('Ajuste registrado exitosamente', 'success');
    } catch (e) {
      const msg = e.response?.data?.error || 'Error al registrar el ajuste';
      showToast(msg, 'error');
    }
  };

  const getTipoIcon = (tipo) => {
    switch(tipo) {
      case 'INGRESO': return <ArrowUpCircle size={18} className="text-emerald-500 mr-2" />;
      case 'EGRESO': return <ArrowDownCircle size={18} className="text-rose-500 mr-2" />;
      case 'AJUSTE': return <RefreshCcw size={18} className="text-amber-500 mr-2" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Auditoría de Inventario</h1>
          <p className="text-slate-500 mt-1">Historial de movimientos y ajustes manuales de stock</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition shadow-sm"
        >
          <Settings2 size={18} className="mr-2" /> Ajuste Manual
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fecha y Hora</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Producto</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipo</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cantidad</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Motivo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {movimientos.map(mov => (
                  <tr key={mov.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-sm font-medium text-slate-600">
                      {new Date(mov.fechaHora).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td className="p-4 font-bold text-slate-800">{mov.productoNombre}</td>
                    <td className="p-4">
                      <div className="flex items-center text-sm font-medium text-slate-700">
                        {getTipoIcon(mov.tipo)}
                        {mov.tipo}
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{mov.cantidad} und</td>
                    <td className="p-4 text-sm text-slate-500">{mov.motivo}</td>
                  </tr>
                ))}
                {movimientos.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500">No hay movimientos registrados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Ajuste Manual */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Ajuste de Stock">
        <form onSubmit={handleAjuste} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Producto</label>
            <select
              required
              value={ajusteData.productoId}
              onChange={e => setAjusteData({...ajusteData, productoId: e.target.value})}
              className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-indigo-600 bg-white"
            >
              <option value="" disabled>Selecciona un producto...</option>
              {productos.map(p => (
                <option key={p.id} value={p.id}>{p.nombre} (Stock actual: {p.stockActual})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Movimiento</label>
              <select
                required
                value={ajusteData.tipo}
                onChange={e => setAjusteData({...ajusteData, tipo: e.target.value})}
                className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-indigo-600 bg-white"
              >
                <option value="INGRESO">Ingreso (+)</option>
                <option value="EGRESO">Egreso (-)</option>
                <option value="AJUSTE">Ajuste Positivo (+)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad</label>
              <input type="number" min="1" required value={ajusteData.cantidad} onChange={e => setAjusteData({...ajusteData, cantidad: e.target.value})} className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-indigo-600" placeholder="Ej: 5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Motivo / Justificación</label>
            <input type="text" required value={ajusteData.motivo} onChange={e => setAjusteData({...ajusteData, motivo: e.target.value})} className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-indigo-600" placeholder="Ej: Mercadería dañada, Ingreso proveedor" />
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-900 font-medium transition flex items-center shadow-sm">
              Confirmar Ajuste
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InventarioPage;
