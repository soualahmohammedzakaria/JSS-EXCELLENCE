import React, { createContext, useState, useContext } from 'react';

const ParamsContext = createContext(); // Créer un contexte

export const useParamsContext = () => useContext(ParamsContext); // Hook pour accéder au contexte

export const ParamsProvider = ({ children }) => {
  // Les paramètres de l'application
  const [paramsData, setParamsData] = useState({
    email: '',
    password: '',
    grandes_tables: 5,
    petites_tables: 7
  });

  // Fonction pour mettre à jour les paramètres de l'application
  const updateParamsData = (newData) => {
    setParamsData({ ...paramsData, ...newData });
  };

  return (
    <ParamsContext.Provider value={{ paramsData, updateParamsData }}>
      {children}
    </ParamsContext.Provider>
  );
};
