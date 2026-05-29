import React, { useState, useEffect } from 'react';
import { CajaService } from '../services/api';

const CajaPage = () => {
  const [caja, setCaja] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saldoInicialInput, setSaldoInicialInput] = useState(0);

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

  const handleAbrirCaja = async () => {
    try {
      await CajaService.abrir(saldoInicialInput);
      fetchCaja();
    } catch (e) {}
  };

  const handleCerrarCaja = async () => {
    if (window.confirm('¿Seguro que deseas cerrar la caja del día?')) {
      try {
        await CajaService.cerrar();
        fetchCaja();
      } catch (e) {}
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Caja Diaria</h1>
      {!caja ? (
        <div className="bg-white p-6 rounded shadow-md max-w-md">
          <h2 className="text-xl mb-4">La caja está cerrada</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Saldo Inicial ($)</label>
            <input type="number" value={saldoInicialInput} onChange={(e) => setSaldoInicialInput(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
          </div>
          <button onClick={handleAbrirCaja} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Abrir Caja</button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded shadow-md max-w-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Estado: <span className={caja.estado === 'ABIERTA' ? 'text-green-600' : 'text-red-600'}>{caja.estado}</span></h2>
            <div className="text-gray-500">{caja.fecha}</div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded border">
              <div className="text-sm text-gray-500">Saldo Inicial</div>
              <div className="text-2xl font-bold">${caja.saldoInicial.toFixed(2)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded border">
              <div className="text-sm text-gray-500">Ingresos por Ventas</div>
              <div className="text-2xl font-bold text-green-600">+${caja.ingresosVentas.toFixed(2)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded border col-span-2">
              <div className="text-sm text-gray-500">Saldo Final Total</div>
              <div className="text-3xl font-bold text-blue-600">${caja.saldoFinal.toFixed(2)}</div>
            </div>
          </div>
          {caja.estado === 'ABIERTA' && (
            <button onClick={handleCerrarCaja} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full">Cerrar Caja</button>
          )}
        </div>
      )}
    </div>
  );
};

export default CajaPage;