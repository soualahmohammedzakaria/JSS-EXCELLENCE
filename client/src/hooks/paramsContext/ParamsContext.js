import React, { createContext, useState, useContext } from 'react';

const ParamsContext = createContext();

export const useParamsContext = () => useContext(ParamsContext);

export const ParamsProvider = ({ children }) => {
  const [paramsData, setParamsData] = useState({
    email: '',
    password: '',
    grandes_tables: 5,
    petites_tables: 7
  });

  const updateParamsData = (newData) => {
    setParamsData({ ...paramsData, ...newData });
  };

  return (
    <ParamsContext.Provider value={{ paramsData, updateParamsData }}>
      {children}
    </ParamsContext.Provider>
  );
};
