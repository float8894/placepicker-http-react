import { useEffect, useState } from 'react';
import Places from './Places.jsx';
import ErrorPage from './ErrorPage.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState();

  function getUserLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position);
        },
        (err) => reject(err)
      );
    });
  }

  useEffect(() => {
    return async () => {
      setIsFetching(true);
      try {
        const places = await fetchAvailablePlaces();

        const {
          coords: { latitude, longitude },
        } = await getUserLocation();

        const sortedPlaces = sortPlacesByDistance(places, latitude, longitude);

        setAvailablePlaces(sortedPlaces);
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
