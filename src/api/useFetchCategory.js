import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchCategory = () => {
  const [data, setData] = useState([]);
  // const [count, setCount] = useState(0);
  const [loading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
      try {
        setFetchLoading(true);
        axios.get(process.env.REACT_APP_API_URL+'/product-categories')
          .then(response => {
            setData(response.data);
            console.log("categories:", response.data)
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

  return { data, /**count,*/ loading, error };
};

export default useFetchCategory;