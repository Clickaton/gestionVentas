import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CajaPage from './pages/CajaPage';
import ProductosPage from './pages/ProductosPage';
import PuntoVentaPage from './pages/PuntoVentaPage';
import ClientesPage from './pages/ClientesPage';
import HistorialPage from './pages/HistorialPage';
import InventarioPage from './pages/InventarioPage';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route path="/" element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route index element={<Navigate to="/ventas" replace />} />

                <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="caja" element={<CajaPage />} />
                  <Route path="inventario" element={<InventarioPage />} />
                  <Route path="historial" element={<HistorialPage />} />
                </Route>

                <Route path="ventas" element={<PuntoVentaPage />} />
                <Route path="productos" element={<ProductosPage />} />
                <Route path="clientes" element={<ClientesPage />} />

                <Route path="*" element={<Navigate to="/ventas" replace />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;