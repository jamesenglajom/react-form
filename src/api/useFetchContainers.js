import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchContainers = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (abortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(url,{signal:abortSignal});
      setData(response.data);
      console.log(response.data.products)
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);

    return () => {
      controller.abort(); // Abort the request on component unmount
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetchContainers;