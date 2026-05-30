import React, { useState, useEffect } from 'react';
import { ProductosService, VentasService, ClientesService, CajaService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ShoppingCart, User, AlertTriangle, Package, Trash2, CheckCircle2 } from 'lucide-react';

const PuntoVentaPage = () => {
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [cajaAbierta, setCajaAbierta] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const initData = async () => {
      try {
        const [prodRes, cliRes, cajaRes] = await Promise.all([
          ProductosService.getAll(),
          ClientesService.getAll(),
          CajaService.getBalance().catch(() => ({ data: null }))
        ]);

        setProductos(prodRes.data.filter(p => p.activo && p.stockActual > 0));
        setClientes(cliRes.data);
        if (cliRes.data.length > 0) setClienteSeleccionado(cliRes.data[0]);
        setCajaAbierta(cajaRes.data && cajaRes.data.estado === 'ABIERTA');
      } catch (e) {
        console.error(e);
      }
    };
    initData();
  }, []);

  const agregarAlCarrito = (producto) => {
    const itemExistente = carrito.find(item => item.productoId === producto.id);
    if (itemExistente) {
      if (itemExistente.cantidad >= producto.stockActual) {
        showToast('Stock máximo alcanzado para este producto', 'error');
        return;
      }
      setCarrito(carrito.map(item =>
        item.productoId === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setCarrito([...carrito, {
        productoId: producto.id,
        nombre: producto.nombre,
        cantidad: 1,
        precioMinorista: producto.precioMinorista,
        precioMayorista: producto.precioMayorista,
        stockMaximo: producto.stockActual
      }]);
    }
  };

  const modificarCantidad = (id, delta) => {
    setCarrito(carrito.map(item => {
      if (item.productoId === id) {
        const nuevaCantidad = item.cantidad + delta;
        if (nuevaCantidad > 0 && nuevaCantidad <= item.stockMaximo) {
          return { ...item, cantidad: nuevaCantidad };
        }
      }
      return item;
    }));
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter(item => item.productoId !== id));
  };

  const calcularTotal = () => {
    if (!clienteSeleccionado) return 0;
    return carrito.reduce((total, item) => {
      const precio = clienteSeleccionado.tipo === 'MAYORISTA' ? item.precioMayorista : item.precioMinorista;
      return total + (precio * item.cantidad);
    }, 0);
  };

  const handleProcesarVenta = async () => {
    if (carrito.length === 0 || !clienteSeleccionado) return;
    if (!cajaAbierta) {
      showToast('La caja no está abierta', 'error');
      return;
    }

    try {
      const payload = {
        clienteId: clienteSeleccionado.id,
        detalles: carrito.map(item => ({
          productoId: item.productoId,
          cantidad: item.cantidad
        }))
      };

      await VentasService.registrarVenta(payload);
      showToast('Venta procesada exitosamente', 'success');
      setCarrito([]);
      const res = await ProductosService.getAll();
      setProductos(res.data.filter(p => p.activo && p.stockActual > 0));
    } catch (e) {
      const msg = e.response?.data?.error || 'Error al procesar la venta';
      showToast(msg, 'error');
    }
  };

  if (!cajaAbierta) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle size={48} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-3">Caja Cerrada</h2>
        <p className="text-slate-500 max-w-md text-lg">Debes abrir la caja del día desde el panel de "Caja Diaria" antes de poder registrar ventas.</p>
      </div>
    );
  }

  return (
    <div className="flex gap-8 h-[calc(100vh-8rem)]">
      {/* Catálogo de Productos */}
      <div className="w-2/3 flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Punto de Venta</h1>
          <p className="text-slate-500 mt-1">Selecciona productos para agregar al ticket</p>
        </div>

        <div className="grid grid-cols-3 gap-4 overflow-y-auto pr-2 pb-4">
          {productos.map(prod => (
            <div
              key={prod.id}
              onClick={() => agregarAlCarrito(prod)}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all flex flex-col relative group"
            >
              <div className="absolute top-4 right-4 text-slate-300 group-hover:text-indigo-500 transition-colors">
                <Package size={20} />
              </div>
              <div className="text-xs font-bold text-slate-400 mb-1 tracking-wider">{prod.codigo}</div>
              <h3 className="font-bold text-slate-800 text-lg leading-tight mb-3 flex-1">{prod.nombre}</h3>
              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Minorista</span>
                  <span className="font-bold text-slate-700">${prod.precioMinorista.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Mayorista</span>
                  <span className="font-bold text-indigo-600">${prod.precioMayorista.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-auto">
                <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-lg ${prod.stockActual <= 10 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
                  Stock: {prod.stockActual}
                </span>
              </div>
            </div>
          ))}
          {productos.length === 0 && (
            <div className="col-span-3 text-center py-12 text-slate-500">No hay productos disponibles con stock.</div>
          )}
        </div>
      </div>

      {/* Ticket Sidebar */}
      <div className="w-1/3 bg-white rounded-3xl shadow-lg border border-slate-100 flex flex-col h-full overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center space-x-3 mb-5">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <ShoppingCart size={20} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Ticket</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2 flex items-center">
              <User size={16} className="mr-2" /> Cliente
            </label>
            <select
              value={clienteSeleccionado ? clienteSeleccionado.id : ''}
              onChange={e => setClienteSeleccionado(clientes.find(c => c.id === parseInt(e.target.value)))}
              className="w-full bg-white border border-slate-300 text-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 appearance-none font-medium"
            >
              <option value="" disabled>Seleccionar cliente...</option>
              {clientes.map(cli => (
                <option key={cli.id} value={cli.id}>{cli.nombre} ({cli.tipo})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {carrito.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <ShoppingCart size={48} className="mb-4 opacity-20" />
              <p>El carrito está vacío</p>
            </div>
          ) : (
            carrito.map(item => {
              const precio = clienteSeleccionado?.tipo === 'MAYORISTA' ? item.precioMayorista : item.precioMinorista;
              return (
                <div key={item.productoId} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                  <div className="flex-1 pr-4">
                    <div className="font-bold text-slate-800 leading-tight mb-1">{item.nombre}</div>
                    <div className="text-sm font-medium text-indigo-600">${precio.toFixed(2)} c/u</div>
                  </div>
                  <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                    <button onClick={() => modificarCantidad(item.productoId, -1)} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-md transition" aria-label="decrease">-</button>
                    <span className="w-8 text-center font-bold text-slate-800">{item.cantidad}</span>
                    <button onClick={() => modificarCantidad(item.productoId, 1)} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-md transition" aria-label="increase">+</button>
                  </div>
                  <button onClick={() => eliminarDelCarrito(item.productoId)} className="ml-3 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition opacity-0 group-hover:opacity-100" aria-label="remove">
                    <Trash2 size={18} />
                  </button>
                </div>
              )
            })
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <span className="text-slate-500 font-medium text-lg">Total a cobrar</span>
            <span className="text-4xl font-black text-slate-800">${calcularTotal().toFixed(2)}</span>
          </div>
          <button
            onClick={handleProcesarVenta}
            disabled={carrito.length === 0 || !clienteSeleccionado}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/30 transition-all disabled:opacity-50 disabled:hover:shadow-none flex items-center justify-center"
          >
            <CheckCircle2 size={24} className="mr-2" />
            Procesar Venta
          </button>
        </div>
      </div>
    </div>
  );
};

export default PuntoVentaPage;