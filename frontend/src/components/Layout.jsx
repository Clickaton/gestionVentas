import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { WalletCards, Package, ShoppingCart, Users, History, LogOut, LayoutDashboard, ClipboardList } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Layout = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = auth?.rol === 'ADMIN';

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl">
        <div className="p-6 flex items-center justify-center border-b border-slate-800/50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-indigo-600/30">
              <span className="text-xl font-black tracking-tighter">LC</span>
            </div>
            <h1 className="text-xl font-bold tracking-wider">DISTRIBUIDORA LC</h1>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {isAdmin && (
            <>
              <NavLink to="/dashboard" className={({isActive}) => `flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-indigo-600/10 text-indigo-400 font-medium' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
                <LayoutDashboard size={20} className="mr-3" />
                Dashboard
              </NavLink>
              <NavLink to="/caja" className={({isActive}) => `flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-indigo-600/10 text-indigo-400 font-medium' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
                <WalletCards size={20} className="mr-3" />
                Caja Diaria
              </NavLink>
            </>
          )}
          <NavLink to="/ventas" className={({isActive}) => `flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-indigo-600/10 text-indigo-400 font-medium' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
            <ShoppingCart size={20} className="mr-3" />
            Punto de Venta
          </NavLink>
          <NavLink to="/productos" className={({isActive}) => `flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-indigo-600/10 text-indigo-400 font-medium' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
            <Package size={20} className="mr-3" />
            Productos
          </NavLink>
          <NavLink to="/clientes" className={({isActive}) => `flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-indigo-600/10 text-indigo-400 font-medium' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
            <Users size={20} className="mr-3" />
            Clientes
          </NavLink>
          {isAdmin && (
            <>
              <NavLink to="/inventario" className={({isActive}) => `flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-indigo-600/10 text-indigo-400 font-medium' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
                <ClipboardList size={20} className="mr-3" />
                Inventario
              </NavLink>
              <NavLink to="/historial" className={({isActive}) => `flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-indigo-600/10 text-indigo-400 font-medium' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
                <History size={20} className="mr-3" />
                Historial de Ventas
              </NavLink>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 font-medium"
          >
            <LogOut size={20} className="mr-3" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
