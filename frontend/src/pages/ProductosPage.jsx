import React, { useState, useEffect } from 'react';
import { ProductosService } from '../services/api';

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState({
    porcentaje: 0,
    actualizarMinorista: true,
    actualizarMayorista: true
  });
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const res = await ProductosService.getAll();
      setProductos(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(productos.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectProduct = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleUpdatePrices = async (e) => {
    e.preventDefault();
    if (selectedIds.length === 0) {
      alert("Selecciona al menos un producto");
      return;
    }
    try {
      await ProductosService.actualizarPrecios({
        productoIds: selectedIds,
        porcentaje: parseFloat(updateData.porcentaje),
        actualizarMinorista: updateData.actualizarMinorista,
        actualizarMayorista: updateData.actualizarMayorista
      });
      setIsModalOpen(false);
      setSelectedIds([]);
      fetchProductos();
      alert("Precios actualizados con éxito!");
    } catch (e) {
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Productos</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          disabled={selectedIds.length === 0}
        >
          Actualizar Precios Masivamente ({selectedIds.length})
        </button>
      </div>

      {loading ? (
        <div>Cargando...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === productos.length && productos.length > 0} aria-label="Select all" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P. Minorista</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P. Mayorista</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productos.map(prod => (
                <tr key={prod.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(prod.id)}
                      onChange={() => handleSelectProduct(prod.id)}
                      aria-label="Select"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{prod.codigo}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{prod.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${prod.precioMinorista.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${prod.precioMayorista.toFixed(2)}</td>
                  <td className={`px-6 py-4 whitespace-nowrap font-bold ${prod.stockActual < 5 ? 'text-red-600' : ''}`}>
                    {prod.stockActual}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${prod.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {prod.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Actualizar Precios</h2>
            <form onSubmit={handleUpdatePrices}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Porcentaje de Aumento (%)</label>
                <input
                  type="number" step="0.01" min="0" required
                  value={updateData.porcentaje}
                  onChange={e => setUpdateData({...updateData, porcentaje: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm"
                />
              </div>
              <div className="mb-2">
                <label className="inline-flex items-center">
                  <input type="checkbox"
                    checked={updateData.actualizarMinorista}
                    onChange={e => setUpdateData({...updateData, actualizarMinorista: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <span className="ml-2">Aplicar a precio minorista</span>
                </label>
              </div>
              <div className="mb-6">
                <label className="inline-flex items-center">
                  <input type="checkbox"
                    checked={updateData.actualizarMayorista}
                    onChange={e => setUpdateData({...updateData, actualizarMayorista: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <span className="ml-2">Aplicar a precio mayorista</span>
                </label>
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Actualizar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductosPage;