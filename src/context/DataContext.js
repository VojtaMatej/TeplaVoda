import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [meters, setMeters] = useState([]);
  const [consumptionData, setConsumptionData] = useState([]);
  const [triggers, setTriggers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [propsResp, metersResp, consResp, triggResp] = await Promise.all([
        api.get('/properties'),
        api.get('/meters'),
        api.get('/consumption'),
        api.get('/triggers')
      ]);
      
      setProperties(propsResp.data);
      setMeters(metersResp.data);
      setConsumptionData(consResp.data);
      setTriggers(triggersResp.data);
      setError(null);
    } catch (err) {
      setError('Nepodařilo se načíst data');
    } finally {
      setLoading(false);
    }
  };

  const fetchTriggers = async () => {
    try {
      const response = await api.get('/triggers');
      setTriggers(response.data);
    } catch (err) {
      setError('Nepodařilo se načíst upozornění');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{
      properties,
      meters,
      consumptionData,
      triggers,
      loading,
      error,
      fetchData,
      fetchTriggers
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
