import { useEffect, useState } from 'react';
import Places from './Places.jsx';

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);

  useEffect(() => {
    return async () => {
      setIsFetching(true);
      const response = await fetch('http://localhost:3000/places');
      const { places } = await response.json();
      setAvailablePlaces(places);
      setIsFetching(false);
    };
  }, []);

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
