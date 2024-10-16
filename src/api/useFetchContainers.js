import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchContainers = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (abortSignal) => {
    setLoading(prev=> prev === prev);
    setError(null);
    console.log("function execution");
    try {
      await axios.get(url,{signal:abortSignal}).then(response => {
        const {products, pagination } = response?.data;
        console.log("products from useFetch", products);
        setData(response?.data?.products);
        setPagination(response?.data?.pagination);
        setLoading(prev=> prev === !prev);
      });
    } catch (err) {
      setError(err);
    }
  }, [url]);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);

    return () => {
      console.log("cleanup")
      controller.abort(); // Abort the request on component unmount
    };
  }, [fetchData]);

  return { data, loading, error, pagination, refetch: fetchData };
};

export default useFetchContainers;