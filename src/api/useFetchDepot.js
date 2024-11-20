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
        axios.get(process.env.REACT_APP_API_URL+'/stores')
          .then(response => {
            setData(response.data.stores.sort((a, b) => a.title.localeCompare(b.title)));
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