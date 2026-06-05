import React, { useState, useEffect } from 'react';
import { ReportesService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Package, DollarSign } from 'lucide-react';

const COLORS = ['#4f46e5', '#818cf8', '#c7d2fe'];

const DashboardPage = () => {
  const [ventasSemana, setVentasSemana] = useState([]);
  const [topProductos, setTopProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ventasRes, topRes] = await Promise.all([
          ReportesService.getVentasSemana(),
          ReportesService.getTopProductos()
        ]);

        // Format dates for the chart
        const formattedVentas = ventasRes.data.map(v => ({
          ...v,
          fechaStr: new Date(v.fecha).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })
        }));

        setVentasSemana(formattedVentas);
        setTopProductos(topRes.data);
      } catch (error) {
        showToast('Error al cargar datos del dashboard', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [showToast]);

  const totalVentasSemana = ventasSemana.reduce((acc, curr) => acc + curr.total, 0);

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard General</h1>
        <p className="text-slate-500 mt-1">Resumen financiero y métricas clave del negocio</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center">
          <div className="w-14 h-14 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mr-4">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Ventas 7 Días</p>
            <h3 className="text-2xl font-bold text-slate-800">${totalVentasSemana.toFixed(2)}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center">
          <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mr-4">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Promedio Diario</p>
            <h3 className="text-2xl font-bold text-slate-800">${(totalVentasSemana / 7).toFixed(2)}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center">
          <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mr-4">
            <Package size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Producto Estrella</p>
            <h3 className="text-xl font-bold text-slate-800 truncate">{topProductos.length > 0 ? topProductos[0].nombre : 'N/A'}</h3>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Ingresos de los últimos 7 días</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ventasSemana} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="fechaStr" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(val) => `$${val}`} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Top 3 Productos</h3>
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topProductos}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="cantidadVendida"
                >
                  {topProductos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {topProductos.map((prod, idx) => (
              <div key={prod.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                  <span className="font-medium text-slate-700">{prod.nombre}</span>
                </div>
                <span className="font-bold text-slate-900">{prod.cantidadVendida} und</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
