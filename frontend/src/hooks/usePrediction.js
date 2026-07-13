import { useState } from 'react';

export default function usePrediction() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const predict = async (payload) => {
    setLoading(true);
    setResult({ message: 'Prediction pending' });
    setLoading(false);
  };

  return { loading, result, predict };
}
