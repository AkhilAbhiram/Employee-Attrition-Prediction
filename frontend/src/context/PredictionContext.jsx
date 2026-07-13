import { createContext, useContext, useState } from 'react';

const PredictionContext = createContext(null);

export function PredictionProvider({ children }) {
  const [result, setResult] = useState(null);

  return (
    <PredictionContext.Provider value={{ result, setResult }}>
      {children}
    </PredictionContext.Provider>
  );
}

export function usePredictionContext() {
  return useContext(PredictionContext);
}
