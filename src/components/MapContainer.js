import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = {
  height: '400px',
  width: '100%'
};

const MapContainer = () => {
  const [currentLocation, setCurrentLocation] = useState({ lat: 34.397, lng: 150.644 });
  const [restaurants, setRestaurants] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        fetchNearbyRestaurants(position.coords.latitude, position.coords.longitude);
      },
      () => console.log('Error getting location')
    );
  }, []);

  const fetchNearbyRestaurants = (lat, lng) => {
    const service = new window.google.maps.places.PlacesService(document.createElement('div'));

    const request = {
      location: new window.google.maps.LatLng(lat, lng),
      radius: '5000',
      type: ['restaurant']
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setRestaurants(results);
      }
    });
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyCdh8z4QAiNOfQNxSGJ2YG4enUBCAokPiw" libraries={libraries}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={currentLocation}
        zoom={15}
      >
        {restaurants.map((restaurant, index) => (
          <Marker
            key={index}
            position={{ lat: restaurant.geometry.location.lat(), lng: restaurant.geometry.location.lng() }}
            onClick={() => setSelected(restaurant)}
          />
        ))}
      </GoogleMap>
      {selected && (
        <div>
          <h2>{selected.name}</h2>
          <p>{selected.vicinity}</p>
        </div>
      )}
    </LoadScript>
  );
};

export default MapContainer;
