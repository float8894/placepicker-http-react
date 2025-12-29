import { useEffect, useState } from 'react';

export function useFetch(fetchFn, initialValue) {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(false);
  const [fetchedData, setFetchedData] = useState(initialValue);
  useEffect(() => {
    setIsFetching(true);
    return async () => {
      try {
        const data = await fetchFn();
        console.log('Data:', data);
        setFetchedData(data);
        setIsFetching(false);
      } catch (error) {
        setError({ message: error.message || 'failed to fetch data.' });
      }
    };
  }, [fetchFn]);
  return { isFetching, error, fetchedData };
}
