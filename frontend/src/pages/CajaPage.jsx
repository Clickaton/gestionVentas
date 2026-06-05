import React, { useState, useEffect } from 'react';
import { CajaService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Lock, Unlock, DollarSign, ArrowUpRight, ArrowDownRight, Plus, Activity, Receipt } from 'lucide-react';
import Modal from '../components/Modal';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-800">${value.toFixed(2)}</h3>
    </div>
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
      {icon}
    </div>
  </div>
);

const CajaPage = () => {
  const [caja, setCaja] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saldoInicialInput, setSaldoInicialInput] = useState(0);
  const [isAbrirModalOpen, setIsAbrirModalOpen] = useState(false);
  const [isCerrarModalOpen, setIsCerrarModalOpen] = useState(false);
  const [isGastoModalOpen, setIsGastoModalOpen] = useState(false);
  const [gastoData, setGastoData] = useState({ concepto: '', monto: '' });
  const { showToast } = useToast();

  const fetchCaja = async () => {
    try {
      setLoading(true);
      const res = await CajaService.getBalance();
      setCaja(res.data);
    } catch (error) {
      setCaja(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCaja(); }, []);

  const handleAbrirCaja = async (e) => {
    e.preventDefault();
    try {
      await CajaService.abrir(saldoInicialInput);
      fetchCaja();
      setIsAbrirModalOpen(false);
      showToast('Caja abierta exitosamente', 'success');
    } catch (e) {
      const msg = e.response?.data?.error || 'Error al abrir la caja';
      showToast(msg, 'error');
    }
  };

  const handleCerrarCaja = async () => {
    try {
      await CajaService.cerrar();
      fetchCaja();
      setIsCerrarModalOpen(false);
      showToast('Caja cerrada exitosamente', 'success');
    } catch (e) {
      const msg = e.response?.data?.error || 'Error al cerrar la caja';
      showToast(msg, 'error');
    }
  };

  const handleRegistrarGasto = async (e) => {
    e.preventDefault();
    try {
      await CajaService.registrarGasto({
        concepto: gastoData.concepto,
        monto: parseFloat(gastoData.monto)
      });
      fetchCaja();
      setIsGastoModalOpen(false);
      setGastoData({ concepto: '', monto: '' });
      showToast('Gasto registrado exitosamente', 'success');
    } catch (e) {
      const msg = e.response?.data?.error || 'Error al registrar el gasto';
      showToast(msg, 'error');
    }
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Caja Diaria</h1>
          <p className="text-slate-500 mt-1">Gestión del efectivo y balance del día actual</p>
        </div>

        {caja ? (
          caja.estado === 'ABIERTA' && (
            <div className="flex space-x-3">
              <button onClick={() => setIsGastoModalOpen(true)} className="flex items-center px-4 py-2 bg-amber-50 text-amber-600 rounded-lg font-medium hover:bg-amber-100 transition">
                <Receipt size={18} className="mr-2" /> Registrar Gasto
              </button>
              <button onClick={() => setIsCerrarModalOpen(true)} className="flex items-center px-4 py-2 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition shadow-sm">
                <Lock size={18} className="mr-2" /> Cerrar Caja
              </button>
            </div>
          )
        ) : (
          <button onClick={() => setIsAbrirModalOpen(true)} className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition shadow-sm">
            <Unlock size={18} className="mr-2" /> Abrir Caja
          </button>
        )}
      </div>

      {!caja ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} className="text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">La caja de hoy está cerrada</h2>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">Para poder registrar nuevas ventas, primero debes hacer la apertura de caja indicando el saldo base.</p>
          <button onClick={() => setIsAbrirModalOpen(true)} className="inline-flex items-center px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition shadow-md shadow-emerald-500/20">
            Comenzar el día
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg ${caja.estado === 'ABIERTA' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                {caja.estado === 'ABIERTA' ? <Unlock size={20} /> : <Lock size={20} />}
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Estado Actual</p>
                <p className={`font-bold ${caja.estado === 'ABIERTA' ? 'text-emerald-600' : 'text-rose-600'}`}>{caja.estado}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 font-medium">Fecha de Operación</p>
              <p className="font-bold text-slate-800">{caja.fecha}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Saldo Inicial" value={caja.saldoInicial} icon={<DollarSign size={24} />} color="bg-slate-100 text-slate-600" />
            <StatCard title="Ingresos Ventas" value={caja.ingresosVentas} icon={<ArrowUpRight size={24} />} color="bg-emerald-100 text-emerald-600" />
            <StatCard title="Gastos Retirados" value={caja.gastos} icon={<ArrowDownRight size={24} />} color="bg-rose-100 text-rose-600" />
            <StatCard title="Balance Total" value={caja.saldoFinal} icon={<Activity size={24} />} color="bg-indigo-100 text-indigo-600" />
          </div>
        </>
      )}

      {/* Modal Abrir Caja */}
      <Modal isOpen={isAbrirModalOpen} onClose={() => setIsAbrirModalOpen(false)} title="Apertura de Caja">
        <form onSubmit={handleAbrirCaja}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Saldo Inicial (Efectivo en caja)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-500 sm:text-sm">$</span>
              </div>
              <input type="number" step="0.01" min="0" value={saldoInicialInput} onChange={(e) => setSaldoInicialInput(e.target.value)} className="block w-full pl-7 pr-3 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600" placeholder="0.00" />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={() => setIsAbrirModalOpen(false)} className="px-5 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition">Cancelar</button>
            <button type="submit" className="px-5 py-2.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 font-medium transition flex items-center shadow-sm">
              <Unlock size={18} className="mr-2" /> Confirmar Apertura
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Registrar Gasto */}
      <Modal isOpen={isGastoModalOpen} onClose={() => setIsGastoModalOpen(false)} title="Registrar Gasto de Caja">
        <form onSubmit={handleRegistrarGasto} className="space-y-4">
          <div className="bg-amber-50 p-4 rounded-lg text-amber-800 text-sm mb-4">
            Al registrar un gasto, el monto será descontado directamente del Saldo Final de la caja actual.
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Concepto / Motivo</label>
            <input type="text" required value={gastoData.concepto} onChange={e => setGastoData({...gastoData, concepto: e.target.value})} className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-indigo-600" placeholder="Ej: Pago a proveedor, Insumos, etc." />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Monto a retirar</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-500 sm:text-sm">$</span>
              </div>
              <input type="number" step="0.01" min="0.01" required value={gastoData.monto} onChange={e => setGastoData({...gastoData, monto: e.target.value})} className="block w-full pl-7 pr-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600" placeholder="0.00" />
            </div>
          </div>
          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={() => setIsGastoModalOpen(false)} className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 font-medium transition flex items-center shadow-sm">
              Guardar Gasto
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Cerrar Caja */}
      <Modal isOpen={isCerrarModalOpen} onClose={() => setIsCerrarModalOpen(false)} title="Cerrar Caja Diaria">
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-600">
            <Lock size={32} />
          </div>
          <p className="text-slate-600 mb-6">¿Estás seguro que deseas cerrar la caja? Ya no se podrán registrar más ventas en el día de hoy.</p>
          <div className="flex justify-center space-x-3">
            <button onClick={() => setIsCerrarModalOpen(false)} className="px-5 py-2.5 rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 font-medium transition">Cancelar</button>
            <button onClick={handleCerrarCaja} className="px-5 py-2.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600 font-medium transition shadow-sm">
              Sí, cerrar caja
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CajaPage;
