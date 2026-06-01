import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { auth } = useContext(AuthContext);

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(auth.rol)) {
    // If user is logged in but doesn't have the required role, redirect them somewhere safe
    return <Navigate to="/ventas" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
