import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-slate-800 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-slate-700">
          Distribuidora LC
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavLink to="/" className={({isActive}) => `block px-4 py-2 rounded ${isActive ? 'bg-slate-700' : 'hover:bg-slate-700'}`}>
            Caja Diaria
          </NavLink>
          <NavLink to="/productos" className={({isActive}) => `block px-4 py-2 rounded ${isActive ? 'bg-slate-700' : 'hover:bg-slate-700'}`}>
            Productos
          </NavLink>
          <NavLink to="/ventas" className={({isActive}) => `block px-4 py-2 rounded ${isActive ? 'bg-slate-700' : 'hover:bg-slate-700'}`}>
            Punto de Venta
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;