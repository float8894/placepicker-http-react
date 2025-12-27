import { useEffect, useState } from 'react';
import Places from './Places.jsx';
import ErrorPage from './ErrorPage.jsx';

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    return async () => {
      setIsFetching(true);
      try {
        const response = await fetch('http://localhost:3000/place');
        const { places } = await response.json();
        if (!response.ok) {
          const error = new Error('Failed to fetch places');
          throw error;
        }
        setAvailablePlaces(places);
      } catch (error) {
        setError({
          message:
            error.message || 'Could not fetch places, please try again later.',
        });
      }

      setIsFetching(false);
    };
  }, []);

  if (error) {
    return (
      <ErrorPage
        title='An error occurred..'
        message={error.message}
      ></ErrorPage>
    );
  }
  return (
    <Places
      title='Available Places'
      places={availablePlaces}
      isLoading={isFetching}
      loadingText='Fetching place data...'
      fallbackText='No places available.'
      onSelectPlace={onSelectPlace}
    />
  );
}
