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
      pos => {
        setPosition({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
        setIsLoading(false);
      },
      err => {
        setError(err.message);
        setIsLoading(false);
      }
    );
  }, [browserSupportsGeolocation]);

  return { position, isLoading, error };
}
