import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');
    return token ? { token, rol } : null;
  });

  const login = (token, rol) => {
    localStorage.setItem('token', token);
    localStorage.setItem('rol', rol);
    setAuth({ token, rol });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
