import { useRef, useState, useCallback, useEffect } from 'react';

import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import { updateUserPlaces, fetchUserPlaces } from './http.js';
import ErrorPage from './components/ErrorPage.jsx';

function App() {
  const selectedPlace = useRef();

  const [userPlaces, setUserPlaces] = useState([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(false);
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState();

  useEffect(() => {
    setIsFetching(true);
    return async () => {
      try {
        const places = await fetchUserPlaces();
        console.log('Places:', places);
        setUserPlaces(places);
        setIsFetching(false);
      } catch (error) {
        console.log('Error on fetching user places:', error);
        setError({ message: error.message || 'failed to fetch user places.' });
      }
    };
  }, []);

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  function handleSelectPlace(selectedPlace) {
    (async () => {
      try {
        await updateUserPlaces([selectedPlace, ...userPlaces]);
        setUserPlaces((prevPickedPlaces) => {
          if (!prevPickedPlaces) {
            prevPickedPlaces = [];
          }
          if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
            return prevPickedPlaces;
          }
          return [selectedPlace, ...prevPickedPlaces];
        });
      } catch (error) {
        setErrorUpdatingPlaces({
          message: error.message || 'Failed to update user places.',
        });
      }
    })();
  }

  const handleRemovePlace = useCallback(
    async function handleRemovePlace() {
      try {
        await updateUserPlaces(
          userPlaces.filter((place) => place.id !== selectedPlace.current.id)
        );

        setUserPlaces((prevPickedPlaces) =>
          prevPickedPlaces.filter(
            (place) => place.id !== selectedPlace.current.id
          )
        );

        setModalIsOpen(false);
      } catch (error) {
        setErrorUpdatingPlaces({
          message: error.message || 'Failed to update user places.',
        });
      }
    },
    [userPlaces]
  );

  function handleError() {
    setErrorUpdatingPlaces(null);
  }

  return (
    <>
      <Modal open={errorUpdatingPlaces} onClose={handleError}>
        {errorUpdatingPlaces && (
          <ErrorPage
            title='An error occurred!'
            message={errorUpdatingPlaces.message}
            onConfirm={handleError}
          ></ErrorPage>
        )}
      </Modal>

      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt='Stylized globe' />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {error && (
          <ErrorPage
            title='An error occurred!'
            message={error.message}
          ></ErrorPage>
        )}
        {!error && (
          <Places
            title="I'd like to visit ..."
            fallbackText='Select the places you would like to visit below.'
            isLoading={isFetching}
            loadingText='Fetching your place data...'
            places={userPlaces}
            onSelectPlace={handleStartRemovePlace}
          />
        )}

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
