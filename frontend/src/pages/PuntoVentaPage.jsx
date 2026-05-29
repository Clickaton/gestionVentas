import React, { useState, useEffect } from 'react';
import { ProductosService, VentasService } from '../services/api';

const PuntoVentaPage = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [tipoCliente, setTipoCliente] = useState('MINORISTA');

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await ProductosService.getAll();
        setProductos(res.data.filter(p => p.activo && p.stockActual > 0));
      } catch (e) {
        console.error(e);
      }
    };
    fetchProductos();
  }, []);

  const agregarAlCarrito = (producto) => {
    const itemExistente = carrito.find(item => item.productoId === producto.id);
    if (itemExistente) {
      if (itemExistente.cantidad >= producto.stockActual) {
        alert('Stock máximo alcanzado para este producto');
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
    return carrito.reduce((total, item) => {
      const precio = tipoCliente === 'MAYORISTA' ? item.precioMayorista : item.precioMinorista;
      return total + (precio * item.cantidad);
    }, 0);
  };

  const handleProcesarVenta = async () => {
    if (carrito.length === 0) return;

    try {
      const payload = {
        tipoCliente,
        detalles: carrito.map(item => ({
          productoId: item.productoId,
          cantidad: item.cantidad
        }))
      };

      await VentasService.registrarVenta(payload);
      alert('Venta registrada con éxito');
      setCarrito([]);
      const res = await ProductosService.getAll();
      setProductos(res.data.filter(p => p.activo && p.stockActual > 0));
    } catch (e) {}
  };

  return (
    <div className="flex gap-6 h-full">
      <div className="w-2/3 flex flex-col">
        <h1 className="text-3xl font-bold mb-6">Punto de Venta</h1>
        <div className="grid grid-cols-3 gap-4 overflow-y-auto">
          {productos.map(prod => (
            <div key={prod.id} className="bg-white p-4 rounded shadow hover:shadow-md cursor-pointer flex flex-col" onClick={() => agregarAlCarrito(prod)}>
              <div className="text-xs text-gray-500">{prod.codigo}</div>
              <h3 className="font-bold flex-1">{prod.nombre}</h3>
              <div className="mt-2 text-sm">
                Min: <span className="font-semibold">${prod.precioMinorista.toFixed(2)}</span><br/>
                May: <span className="font-semibold">${prod.precioMayorista.toFixed(2)}</span>
              </div>
              <div className="mt-2 text-xs bg-gray-100 p-1 rounded inline-block">Stock: {prod.stockActual}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-1/3 bg-white p-6 rounded shadow flex flex-col h-full">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Ticket actual</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Cliente</label>
          <select
            value={tipoCliente}
            onChange={e => setTipoCliente(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
          >
            <option value="MINORISTA">Minorista</option>
            <option value="MAYORISTA">Mayorista</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {carrito.length === 0 ? (
            <p className="text-gray-400 text-center mt-10">Agrega productos al carrito</p>
          ) : (
            carrito.map(item => {
              const precio = tipoCliente === 'MAYORISTA' ? item.precioMayorista : item.precioMinorista;
              return (
                <div key={item.productoId} className="flex justify-between items-center border-b pb-2">
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{item.nombre}</div>
                    <div className="text-xs text-gray-500">${precio.toFixed(2)} c/u</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => modificarCantidad(item.productoId, -1)} className="bg-gray-200 px-2 rounded" aria-label="decrease">-</button>
                    <span>{item.cantidad}</span>
                    <button onClick={() => modificarCantidad(item.productoId, 1)} className="bg-gray-200 px-2 rounded" aria-label="increase">+</button>
                    <button onClick={() => eliminarDelCarrito(item.productoId)} className="text-red-500 ml-2" aria-label="remove">🗑️</button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center mb-4 text-xl font-bold">
            <span>Total:</span>
            <span>${calcularTotal().toFixed(2)}</span>
          </div>
          <button
            onClick={handleProcesarVenta}
            disabled={carrito.length === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400"
          >
            Procesar Venta
          </button>
        </div>
      </div>
    </div>
  );
};

export default PuntoVentaPage;