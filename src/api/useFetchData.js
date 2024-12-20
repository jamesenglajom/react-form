import { useState, useEffect } from 'react';
import axios from 'axios';
// import useDebounce from '../hooks/useDebounce'; // Adjust the path as needed

const useFetchData = (url) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [count, setCount] = useState(0);
  const [statistics, setStatistic] = useState([]);
  const [loading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  // const debouncedQuery = useDebounce(url, 300);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    // if (!debouncedQuery) return; // Skip if debouncedQuery is empty
    const fetchData = async () => {
      try {
        setFetchLoading(true);
        axios.get(url,{signal})
          .then(response => {
            console.log(response.data)
            setData(response.data.products);
            setPagination(response.data.pagination);
            setCount(response.data.count);
            setStatistic(response.data.status_statistics);
            setFetchLoading(false);
          })
          .catch(error => {
            // console.log(error)
            setError(error);
            setFetchLoading(false);
          });
      } catch (err) {
        setError(err);
      }
    };

    fetchData();

    return () => {
        controller.abort();
    };

  }, [url,triggerRefetch]);

  const refetch = () => setTriggerRefetch(prev => !prev);

  return { data, count, pagination, loading, error, statistics, refetch };
};

export default useFetchData;