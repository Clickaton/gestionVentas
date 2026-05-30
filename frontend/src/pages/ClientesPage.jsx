import React, { useState, useEffect } from 'react';
import { ClientesService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Plus, Trash2, UserCircle, Phone } from 'lucide-react';
import Modal from '../components/Modal';

const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  const [newCliente, setNewCliente] = useState({
    nombre: '',
    tipo: 'MINORISTA',
    telefono: ''
  });

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const res = await ClientesService.getAll();
      setClientes(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClientes(); }, []);

  const handleDelete = async (id) => {
    try {
      await ClientesService.delete(id);
      showToast('Cliente eliminado exitosamente');
      fetchClientes();
    } catch (e) {
      const msg = e.response?.data?.error || 'Error al eliminar cliente';
      showToast(msg, 'error');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await ClientesService.createCliente(newCliente);
      setIsModalOpen(false);
      setNewCliente({ nombre: '', tipo: 'MINORISTA', telefono: '' });
      fetchClientes();
      showToast('Cliente creado exitosamente');
    } catch (e) {
      const msg = e.response?.data?.error || 'Error al crear cliente';
      showToast(msg, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Directorio de Clientes</h1>
          <p className="text-slate-500 mt-1">Administra tus compradores minoristas y mayoristas</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm shadow-indigo-600/20"
        >
          <Plus size={18} className="mr-2" /> Nuevo Cliente
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipo</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Teléfono</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clientes.map(cli => (
                <tr key={cli.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mr-3"><UserCircle size={20} /></div>
                      <span className="font-bold text-slate-800">{cli.nombre}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${cli.tipo === 'MAYORISTA' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                      {cli.tipo}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center text-slate-600">
                      <Phone size={14} className="mr-2 text-slate-400" />
                      {cli.telefono || '-'}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(cli.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {clientes.length === 0 && (
                <tr><td colSpan="4" className="p-8 text-center text-slate-500">No hay clientes registrados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Cliente">
        <form onSubmit={handleCreate} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo o Razón Social</label>
            <input type="text" required value={newCliente.nombre} onChange={e => setNewCliente({...newCliente, nombre: e.target.value})} className="w-full rounded-lg border-slate-300 border p-3 focus:ring-2 focus:ring-indigo-600 bg-slate-50 focus:bg-white transition-colors" placeholder="Ej: Juan Pérez" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Cliente</label>
            <select value={newCliente.tipo} onChange={e => setNewCliente({...newCliente, tipo: e.target.value})} className="w-full rounded-lg border-slate-300 border p-3 focus:ring-2 focus:ring-indigo-600 bg-slate-50 focus:bg-white transition-colors">
              <option value="MINORISTA">MINORISTA (Precio Normal)</option>
              <option value="MAYORISTA">MAYORISTA (Precio Especial)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono (Opcional)</label>
            <input type="text" value={newCliente.telefono} onChange={e => setNewCliente({...newCliente, telefono: e.target.value})} className="w-full rounded-lg border-slate-300 border p-3 focus:ring-2 focus:ring-indigo-600 bg-slate-50 focus:bg-white transition-colors" placeholder="Ej: 555-1234" />
          </div>
          <div className="pt-2">
            <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-600/20">
              Guardar Cliente
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ClientesPage;