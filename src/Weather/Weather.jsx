import React, { useEffect, useState } from 'react';
import './Weather.css'

function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_WHEATHER_API; 
  const API_URL = import.meta.env.VITE_WHEATHER_URL; 
  const city = 'busan'; 

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=kr`);
        if (!response.ok) {
          throw new Error(`Failed to fetch weather data: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Weather Data:', data); 
        setWeather(data);
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError('Unable to fetch weather data. Please check the API key and city name.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return weather ? (
    <div>
      <h2>Weather in {weather.name}</h2>
      <p>Temperature: {weather.main.temp}°C</p>
      <p>Condition: {weather.weather[0].description}</p>
      <p>Humidity: {weather.main.humidity}%</p>
      <p>Wind Speed: {weather.wind.speed} m/s</p>
    </div>
  ) : (
    <p>No data available.</p>
  );
}

export default Weather;
