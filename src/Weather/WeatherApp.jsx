import React, { useState, useEffect } from "react";
import faSearch from "../assets/img/fa-search.svg";
import vector from "../assets/img/vector-blue.svg";
import outline from "../assets/img/outline.svg";
import outline2 from "../assets/img/outline-2.svg";
import outline3 from "../assets/img/outline-3.svg";
import sunny from "../assets/img/sunny.svg";
import Cloudy from "../assets/img/Cloudy.svg";
import Vector from "../assets/img/vector-red.svg";
import "weather-icons/css/weather-icons.css";
import WeatherDetail from "./WeatherDetail";
import MapComponent from './MapComponent';
import hazeImage from "../assets/img/haze.png";
import snowImage from "../assets/img/snow.png";
import Summer from "../assets/img/summer.jpg";
import Winter from "../assets/img/BgWeather.png";
import Authom from "../assets/img/authom.jpg";


const VITE_WHEATHER_URL = import.meta.env.VITE_WHEATHER_URL;

const WeatherApp = () => {
  const [weather, setWeather] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(Winter);
  const [currentTime, setCurrentTime] = useState(new Date());



  const GEOCODING_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const WEATHER_API_KEY = import.meta.env.VITE_WHEATHER_API;


  const fetchWeatherByLocation = async (lat, lon) => {
    try {
      const weatherUrl = `${VITE_WHEATHER_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();

      setWeather(weatherData);
      setLatLng({ lat, lng: lon });
      console.log("Weather data fetched:", weatherData); // 로그 추가
      updateBackgroundImage(weatherData.main.temp); 
    } catch (err) {
      setError("");
    }
  };

  

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMapClick = (lat, lng) => {
    fetchWeatherByLocation(lat, lng);
    setSearchTerm(""); // 검색 폼 초기화
    
  };

  console.log("Winter image path:", Winter);
  console.log("Authom image path:", Authom);
  console.log("Summer image path:", Summer);

 
  const translateDescription = (description) => {
    const weatherDescriptions = {
      "clear sky": "맑음",
      "few clouds": "약간의 구름",
      "scattered clouds": "드문드문 구름",
      "broken clouds": "짙은 구름",
      "overcast clouds": "흐림",
      "light rain": "가벼운 비",
      "moderate rain": "보통 비",
      "heavy intensity rain": "강한 비",
      "snow": "눈",
      "mist": "엷은 안개",
      "light snow": "눈",
      "haze": "안개",
      "fog": "안개",
    };

    return weatherDescriptions[description] || description;
  };

  const updateBackgroundImage = (temp) => {
    if (temp <= 15) {
      setBackgroundImage(Winter);
    } else if (temp > 15 && temp <= 20) {
      setBackgroundImage(Authom);
    } else {
      setBackgroundImage(Summer);
    }
  };

  useEffect(() => {
    // weather 상태가 변경될 때만 실행
    if (weather && weather.main && weather.main.temp != null) {
      updateBackgroundImage(weather.main.temp);
    }
  }, [weather]);

  const weatherIcons = {
    Clear: {
      day: "☀️",
      night: "🌙",
    },
    Clouds: {
      few: {
        day: "🌤️",
        night: "☁️",
      },
      scattered: "🌥️",
      broken: "☁️",
      overcast: "🌧️",
    },
    Rain: "🌧️",
    Drizzle: "🌦️",
    Thunderstorm: "⛈️",
    Snow: "❄️",
    Mist: "🌫️",
    Fog: "🌫️",
    Dust: "🌪️",
    Sand: "🌪️",
    Tornado: "🌪️",
    lightsnow: "❄️",
    Haze: "🌫️",
    Fog: "🌫️",
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByLocation(latitude, longitude);
          setError(null);
        },
        (error) => {
          console.error(error);
          setError("위치를 검색할 수 없습니다. (위치 액세스를 허용해주세요).");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a location.");
      return;
    }
    setError(null);
    setWeather(null);

    try {
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        searchTerm
      )}&key=${GEOCODING_API_KEY}`;
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();

      if (geocodeData.status !== "OK") {
        throw new Error("Location not found.");
      }

      const { lat, lng } = geocodeData.results[0].geometry.location;
      fetchWeatherByLocation(lat, lng);
    } catch (err) {
      setError(err.message || "Failed to fetch weather data.");
    }
  };

  return (
    <div
      className="text-white min-h-screen flex justify-center items-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      
      <div className="relative w-full max-w-[3000px] h-screen flex flex-col lg:flex-row">
        {/* Left Section */}
        <div className="flex-1 flex flex-col p-6 lg:p-12">
          
          <div className="flex items-center mb-8">
          </div>
          <div>
          </div>
          <div className="mt-auto flex items-center gap-4">
            <p className="text-[80px] lg:text-[120px] font-bold leading-none">
              {weather ? `${weather.main.temp.toFixed(1)}°` : "N/A"}
              
            </p>
            <div>
              <p className="text-3xl lg:text-4xl">
                {searchTerm || (weather ? weather.name : "위치")}
                {weather && searchTerm && (
                  <span className="text-white-400 text-xl ml-2">
                    ({weather.name})
                    
                  </span>
                )}
                
              </p>
              <p className="text-sm lg:text-lg text-gray-300 mt-1">
              {currentTime.toLocaleTimeString()} - {currentTime.toLocaleDateString()}
              </p>
              
            </div>
            
            <img
              src={
                weather
                  ? `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
                  : Cloudy
              }
              alt="Weather Icon"
              className="w-16 h-16 ml-4"
            />
            
          </div>
          
        </div>

        <div className="relative">
  {/* 지도 컴포넌트 */}
  {weather && (
    <div className="w-[90%] sm:w-[500px] md:w-[550px] lg:w-[600px] h-[300px] sm:h-[350px] rounded-lg overflow-hidden shadow-lg absolute right-[10%] sm:right-[50px] md:right-[150px] lg:right-[650px]">
      <MapComponent lat={weather.coord.lat} lon={weather.coord.lon} onMapClick={handleMapClick} />
    </div>
  )}
</div>



       
        {/* Right Section */}
        <div className="lg:w-[35%] bg-[#ffffff0a] border-l border-[#ffffff24] backdrop-blur-md flex flex-col p-6 lg:p-12">
          <div className="flex items-center mb-8">
            <input
              type="text"
              placeholder="Search Location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === "Enter"){
                   handleSearch();
                }            
              }}
              className="flex-1 bg-transparent border-b border-gray-400 placeholder-gray-400 text-white focus:outline-none px-2"
            />
            <button onClick={handleSearch} className="ml-4">
              <img src={faSearch} alt="Search Icon" className="w-6 h-5" />
            </button>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          {weather && (
            <div>
              <p className="text-lg mb-6">자세한 날씨 정보...</p>
              <div className="space-y-6">
                {[
                  {
                    label: "날씨 현황",
                    value: weather ? translateDescription(weather.weather[0]?.description) : "N/A",
                    className: "w-18 h-18",
                    icon: (() => {
                      if (!weather) return sunny; // 기본 sunny 아이콘
                  
                      const description = weather.weather[0]?.description?.toLowerCase();
                      const main = weather.weather[0]?.main?.toLowerCase();
                  
                      // 눈 상태일 경우
                      if (main === "snow" || description?.includes("snow")) {
                        return snowImage; // import한 snow 이미지 사용
                      }
                  
                      // 안개 상태일 경우
                      if (main === "mist" || main === "haze" || description?.includes("mist") || description?.includes("haze")) {
                        return hazeImage; // import한 haze 이미지 사용
                      }
                  
                      // 기본 OpenWeather 아이콘
                      return `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
                    })(),
                  },
                  { label: "기온", value: `${weather.main.temp}°C`, icon: Vector },
                  { label: "체감 온도", value: `${weather.main.feels_like}°C`, icon: vector },
                  { label: "풍속", value: `${weather.wind.speed} m/s`, icon: outline },
                  { label: "강수 확률", value: `${weather.clouds.all}%`, icon: outline2 },
                  { label: "습도", value: `${weather.main.humidity}%`, icon: outline3 },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm lg:text-base pb-2 border-gray-400"
                  >
                    <span>{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white">{item.value}</span>
                      <img src={item.icon} alt={item.label} className="w-6 h-6" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
                    
          {weather && (
            
            <WeatherDetail
              lat={weather.coord.lat}
              lon={weather.coord.lon}
              apiKey={WEATHER_API_KEY}
              translateDescription={translateDescription}
              weatherIcons={weatherIcons}
            />
          )}
   
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
