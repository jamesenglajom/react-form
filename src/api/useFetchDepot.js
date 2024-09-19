import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchDepot = () => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      try {
        setFetchLoading(true);
        axios.get('https://onsitestorage.com/wp-json/wp_to_react/v1/stores')
          .then(response => {
            setData(response.data.stores);
            setCount(response.data.count);
            setFetchLoading(false);
          })
          .catch(error => {
            console.log(error)
            setError(error);
            setFetchLoading(false);
          });
      } catch (err) {
        console.log(err)
        setError(err);
      }
  }, []);

  return { data, count, loading, error };
};

export default useFetchDepot;