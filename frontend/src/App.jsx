import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import CajaPage from './pages/CajaPage';
import ProductosPage from './pages/ProductosPage';
import PuntoVentaPage from './pages/PuntoVentaPage';
import ClientesPage from './pages/ClientesPage';
import HistorialPage from './pages/HistorialPage';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<CajaPage />} />
            <Route path="productos" element={<ProductosPage />} />
            <Route path="clientes" element={<ClientesPage />} />
            <Route path="ventas" element={<PuntoVentaPage />} />
            <Route path="historial" element={<HistorialPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;