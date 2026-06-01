import React, { useState, useEffect, useContext } from 'react';
import { ProductosService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { AuthContext } from '../context/AuthContext';
import { Plus, Percent, Trash2, Tag } from 'lucide-react';
import Modal from '../components/Modal';

const ProductosPage = () => {
  const { auth } = useContext(AuthContext);
  const isAdmin = auth?.rol === 'ADMIN';
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { showToast } = useToast();

  const [updateData, setUpdateData] = useState({
    porcentaje: 0,
    actualizarMinorista: true,
    actualizarMayorista: true
  });
  const [newProducto, setNewProducto] = useState({
    codigo: '', nombre: '', descripcion: '',
    precioMinorista: '', precioMayorista: '', stockActual: '',
    activo: true
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

  useEffect(() => { fetchProductos(); }, []);

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(productos.map(p => p.id));
    else setSelectedIds([]);
  };

  const handleSelectProduct = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleDelete = async (id) => {
    try {
      await ProductosService.delete(id);
      showToast('Producto eliminado exitosamente');
      fetchProductos();
    } catch (e) {
      const msg = e.response?.data?.error || 'Error al eliminar';
      showToast(msg, 'error');
    }
  };

  const handleUpdatePrices = async (e) => {
    e.preventDefault();
    if (selectedIds.length === 0) return;
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
      showToast('Precios actualizados masivamente con éxito');
    } catch (e) {
      const msg = e.response?.data?.error || 'Error al actualizar precios';
      showToast(msg, 'error');
    }
  };

  const handleCreateProducto = async (e) => {
    e.preventDefault();
    try {
      await ProductosService.createProducto({
        ...newProducto,
        precioMinorista: parseFloat(newProducto.precioMinorista),
        precioMayorista: parseFloat(newProducto.precioMayorista),
        stockActual: parseInt(newProducto.stockActual, 10),
      });
      setIsCreateModalOpen(false);
      setNewProducto({codigo: '', nombre: '', descripcion: '', precioMinorista: '', precioMayorista: '', stockActual: '', activo: true});
      fetchProductos();
      showToast('Producto creado exitosamente');
    } catch (e) {
      const msg = e.response?.data?.error || 'Error al crear producto';
      showToast(msg, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Catálogo de Productos</h1>
          <p className="text-slate-500 mt-1">Administra el inventario de leña y carbón</p>
        </div>
        {isAdmin && (
          <div className="flex space-x-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-medium hover:bg-indigo-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={selectedIds.length === 0}
            >
              <Percent size={18} className="mr-2" /> Aumento Masivo ({selectedIds.length})
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm shadow-indigo-600/20"
            >
              <Plus size={18} className="mr-2" /> Nuevo Producto
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  {isAdmin && <th className="p-4 w-12"><input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === productos.length && productos.length > 0} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" /></th>}
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Código</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Producto</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">P. Minorista</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">P. Mayorista</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock</th>
                  {isAdmin && <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Acciones</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {productos.map(prod => (
                  <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                    {isAdmin && <td className="p-4"><input type="checkbox" checked={selectedIds.includes(prod.id)} onChange={() => handleSelectProduct(prod.id)} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" /></td>}
                    <td className="p-4 text-sm font-medium text-slate-500">{prod.codigo}</td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded bg-indigo-50 flex items-center justify-center text-indigo-600 mr-3"><Tag size={16} /></div>
                        <span className="font-bold text-slate-800">{prod.nombre}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">${prod.precioMinorista.toFixed(2)}</td>
                    <td className="p-4 font-semibold text-slate-700">${prod.precioMayorista.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${prod.stockActual <= 10 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
                        {prod.stockActual} und
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="p-4 text-right">
                        <button onClick={() => handleDelete(prod.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals reuse our new component */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Actualización Masiva de Precios">
        <form onSubmit={handleUpdatePrices}>
          <div className="bg-indigo-50 p-4 rounded-lg text-indigo-800 text-sm mb-6">
            Vas a actualizar el precio de <strong>{selectedIds.length}</strong> productos seleccionados.
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 mb-2">Porcentaje de Aumento (%)</label>
            <input type="number" step="0.01" min="0" required value={updateData.porcentaje} onChange={e => setUpdateData({...updateData, porcentaje: e.target.value})} className="block w-full rounded-lg border-slate-300 px-4 py-3 bg-slate-50 border focus:bg-white focus:ring-2 focus:ring-indigo-600 transition-all" placeholder="Ej: 15.5" />
          </div>
          <div className="space-y-3 mb-8">
            <label className="flex items-center p-3 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <input type="checkbox" checked={updateData.actualizarMinorista} onChange={e => setUpdateData({...updateData, actualizarMinorista: e.target.checked})} className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
              <span className="ml-3 font-medium text-slate-700">Aplicar a Precio Minorista</span>
            </label>
            <label className="flex items-center p-3 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <input type="checkbox" checked={updateData.actualizarMayorista} onChange={e => setUpdateData({...updateData, actualizarMayorista: e.target.checked})} className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
              <span className="ml-3 font-medium text-slate-700">Aplicar a Precio Mayorista</span>
            </label>
          </div>
          <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-600/20">
            Confirmar Actualización
          </button>
        </form>
      </Modal>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Crear Nuevo Producto">
        <form onSubmit={handleCreateProducto} className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Código</label><input type="text" required value={newProducto.codigo} onChange={e => setNewProducto({...newProducto, codigo: e.target.value})} className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-indigo-600" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label><input type="text" required value={newProducto.nombre} onChange={e => setNewProducto({...newProducto, nombre: e.target.value})} className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-indigo-600" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label><textarea value={newProducto.descripcion} onChange={e => setNewProducto({...newProducto, descripcion: e.target.value})} className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-indigo-600" rows="2" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Precio Minorista</label><input type="number" step="0.01" min="0" required value={newProducto.precioMinorista} onChange={e => setNewProducto({...newProducto, precioMinorista: e.target.value})} className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-indigo-600" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Precio Mayorista</label><input type="number" step="0.01" min="0" required value={newProducto.precioMayorista} onChange={e => setNewProducto({...newProducto, precioMayorista: e.target.value})} className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-indigo-600" /></div>
          </div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Stock Inicial</label><input type="number" min="0" required value={newProducto.stockActual} onChange={e => setNewProducto({...newProducto, stockActual: e.target.value})} className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-indigo-600" /></div>
          <div className="pt-4"><button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition">Guardar Producto</button></div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductosPage;
