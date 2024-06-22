import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext); // Hook pour accéder au contexte

export const AuthProvider = ({ children }) => {
  // Les données de l'utilisateur connecté
  const [authData, setAuthData] = useState({
    nom: '',
    role: '',
    id: 0
  });

  // Fonction pour mettre à jour les données de l'utilisateur
  const updateAuthData = (newData) => {
    setAuthData({ ...authData, ...newData });
  };

  return (
    <AuthContext.Provider value={{ authData, updateAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};
