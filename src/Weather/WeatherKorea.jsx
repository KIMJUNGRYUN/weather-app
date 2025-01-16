import React, { useState, useEffect } from "react";
import WeatherApp from "./WeatherApp";

const WeatherKorea = () => {
  const [todayWeather, setTodayWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const WEATHER_API_KEY = import.meta.env.VITE_WHEATHER_API;
  const VITE_WHEATHER_URL = import.meta.env.VITE_WHEATHER_URL;
  // main 값을 기반으로 한 날씨 상태 번역
  const translateMain = (main) => {
    const weatherMainDescriptions = {
      Clear: "맑음",
      Clouds: "구름 많음",
      Rain: "비",
      Drizzle: "이슬비",
      Thunderstorm: "뇌우",
      Snow: "눈",
      Mist: "엷은 안개",
      Fog: "짙은 안개",
      Dust: "먼지",
      Sand: "모래",
      Tornado: "토네이도",
      Haze: "안개",
    };

    return weatherMainDescriptions[main] || main; // 번역되지 않은 경우 기본값 반환
  };





  const fetchWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      const lat = 37.5665; // 서울의 위도 예제 (기본값)
      const lon = 126.9780; // 서울의 경도 예제 (기본값)
      const weatherUrl = `${VITE_WHEATHER_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;

      const response = await fetch(weatherUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const translations = {
        temp: "기온",
        feels_like: "체감 온도",
        humidity: "습도",
        wind_speed: "풍속",
        weather: "날씨",
      };

      const processedData = [
        { category: translations.temp, value: `${data.main.temp}°C` },
        { category: translations.feels_like, value: `${data.main.feels_like}°C` },
        { category: translations.humidity, value: `${data.main.humidity}%` },
        { category: translations.wind_speed, value: `${data.wind.speed} m/s` },
        {
          category: translations.weather,
          value: translateMain(data.weather[0].main), // 번역된 main 값
        },
      ];

      setTodayWeather(processedData);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError("날씨 데이터를 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <WeatherApp weatherData={todayWeather} />
    </div>
  );
};

export default WeatherKorea;
