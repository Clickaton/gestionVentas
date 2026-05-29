import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import CajaPage from './pages/CajaPage';
import ProductosPage from './pages/ProductosPage';
import PuntoVentaPage from './pages/PuntoVentaPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<CajaPage />} />
          <Route path="productos" element={<ProductosPage />} />
          <Route path="ventas" element={<PuntoVentaPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;