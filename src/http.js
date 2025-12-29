export async function fetchAvailablePlaces() {
  const response = await fetch('http://localhost:3000/places');
  const { places } = await response.json();
  if (!response.ok) {
    const error = new Error('Failed to fetch places');
    throw error;
  }
  return places;
}

export async function updateUserPlaces(places) {
  const mutation = await fetch('http://localhost:3000/user-places', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ places }),
  });
  if (!mutation.ok) {
    throw new Error('Failed to update user data.');
  }
  const response = await mutation.json();
  console.log('Response:', response);
  return response;
}

export async function fetchUserPlaces() {
  const query = await fetch('http://localhost:3000/user-places');
  const { places } = await query.json();
  if (!query.ok) {
    const error = new Error('Failed to fetch user places');
    throw error;
  }
  return places;
}
