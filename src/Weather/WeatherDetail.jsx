import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";


const WeatherDetail = ({ lat, lon, apiKey, translateDescription, weatherIcons }) => {
  const [hourlyData, setHourlyData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const VITE_WHEATHER_URL = import.meta.env.VITE_WHEATHER_URL;
  
  useEffect(() => {
    const fetchHourlyForecast = async () => {
      setIsLoading(true);
      try {
        
        const url = `${VITE_WHEATHER_URL}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
          const hourly = data.list.slice(0, 12);
          setHourlyData(hourly);
          setError(null);
        } else {
          throw new Error(data.message || "Failed to fetch hourly data.");
        }
      } catch (err) {
        setError(err.message || "An error occurred while fetching hourly data.");
        setHourlyData([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (lat && lon) fetchHourlyForecast();
  }, [lat, lon, apiKey]);

  const groupedData = [];
  for (let i = 0; i < hourlyData.length; i += 4) {
    groupedData.push(hourlyData.slice(i, i + 4));
  }

  const getWeatherIcon = (main, description, isDaytime) => {
    if (main === "Clear") {
      return isDaytime ? weatherIcons.Clear.day : weatherIcons.Clear.night;
    }

    if (main === "Clouds") {
      if (description.includes("few")) {
        return isDaytime
          ? weatherIcons.Clouds.few.day
          : weatherIcons.Clouds.few.night;
      }
      if (description.includes("scattered")) return weatherIcons.Clouds.scattered;
      if (description.includes("broken")) return weatherIcons.Clouds.broken;
      if (description.includes("overcast")) return weatherIcons.Clouds.overcast;
    }

    return weatherIcons[main] || "❓";
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-6 relative">
      <h2 className="text-lg font-bold mb-4">시간별 날씨</h2>
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        spaceBetween={20}
        slidesPerView={1}
        grabCursor={true}
      >
        {groupedData.map((group, index) => (
          <SwiperSlide key={index}>
            <div className="flex flex-col gap-4">
              {group.map((hour, idx) => {
                const hourOfDay = new Date(hour.dt * 1000).getHours();
                const isDaytime = hourOfDay >= 6 && hourOfDay < 18;

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-[#ffffff0a] p-4 rounded-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-white text-2xl">
                        {getWeatherIcon(
                          hour.weather[0]?.main,
                          hour.weather[0]?.description,
                          isDaytime
                        )}
                      </div>
                      <div className="text-left">
                        <p className="text-white text-sm font-bold">
                          {`${hourOfDay < 10 ? "0" : ""}${hourOfDay}:00`}
                        </p>
                        <p className="text-white-300 text-xs capitalize">
                          {translateDescription(hour.weather[0]?.description || "Unknown")}
                        </p>
                      </div>
                    </div>
                    <div className="text-white text-lg font-bold">
                      {hour.main.temp.toFixed(1)}°
                    </div>
                  </div>
                );
              })}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button className="swiper-button-prev absolute left-[-40px] text-white p-2 rounded-full z-10">
        
      </button>
      <button className="swiper-button-next absolute right-[-40px] text-white  p-2 rounded-full z-10">
        
      </button>
    </div>
  );
};

export default WeatherDetail;
