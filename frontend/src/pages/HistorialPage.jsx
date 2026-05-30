import React, { useState, useEffect } from 'react';
import { VentasService } from '../services/api';
import { Calendar, UserCircle, Package, DollarSign } from 'lucide-react';

const HistorialPage = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const res = await VentasService.getHistorial();
        setVentas(res.data.reverse()); // Show newest first
      } finally {
        setLoading(false);
      }
    };
    fetchVentas();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Historial de Ventas</h1>
          <p className="text-slate-500 mt-1">Registro detallado de todas las transacciones</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID Venta</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fecha y Hora</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Artículos</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ventas.map(venta => (
                <tr key={venta.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-mono text-sm text-slate-500">#{venta.id.toString().padStart(6, '0')}</td>
                  <td className="p-4">
                    <div className="flex items-center text-slate-600 text-sm">
                      <Calendar size={14} className="mr-2 text-slate-400" />
                      {new Date(venta.fechaHora).toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 flex items-center">
                        <UserCircle size={14} className="mr-1 text-slate-400" /> {venta.clienteNombre}
                      </span>
                      <span className="text-xs text-slate-500">{venta.tipoPrecio}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      {venta.detalles.map(d => (
                        <div key={d.id} className="text-sm flex items-center text-slate-600">
                          <Package size={12} className="mr-1 text-slate-400" />
                          <span className="font-medium mr-1">{d.cantidad}x</span> {d.productoNombre}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <span className="inline-flex items-center font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                      <DollarSign size={14} />
                      {venta.total.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
              {ventas.length === 0 && (
                <tr><td colSpan="5" className="p-8 text-center text-slate-500">No hay ventas registradas.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistorialPage;