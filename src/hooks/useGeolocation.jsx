import { useState, useEffect } from 'react';

export function useGeolocation() {
  const browserSupportsGeolocation = !!navigator.geolocation;

  const [isLoading, setIsLoading] = useState(browserSupportsGeolocation);
  const [position, setPosition] = useState(null);

  const [error, setError] = useState(() => {
    return browserSupportsGeolocation
      ? null
      : 'Geolocation is not supported by your browser';
  });

  useEffect(() => {
    if (!browserSupportsGeolocation) return;

    navigator.geolocation.getCurrentPosition(
      position => {
        setPosition({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setIsLoading(false);
      },
      error => {
        setError(error.message);
        setIsLoading(false);
      }
    );
  }, [browserSupportsGeolocation]);

  return { position, isLoading, error };
}
