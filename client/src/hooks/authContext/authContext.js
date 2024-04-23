import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    nom: '',
    role: '',
    id: 0,
    photo: null
  });

  const updateAuthData = (newData) => {
    setAuthData({ ...authData, ...newData });
  };

  return (
    <AuthContext.Provider value={{ authData, updateAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};
