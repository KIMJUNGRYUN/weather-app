import React, { Component, useEffect, useState } from 'react';


function HourlyWeather({name, location }) {
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = encodeURIComponent(import.meta.env.VITE_WHEATHER_API); // 환경 변수에서 API 키 가져오기
  const API_URL = import.meta.env.VITE_MTA_URL; // 5일치 3시간 간격 예보 API URL
  const city = 'busan'; // 도시 이름

  useEffect(() => {
    const fetchHourlyWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=kr`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch hourly weather data: ${response.statusText}`);
        }

        const data = await response.json();
        

        if (data.list && Array.isArray(data.list)) {
          setHourlyData(data.list.slice(0, 4)); 
        } else {
          throw new Error('시간별 데이터를 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('Error fetching hourly weather data:', err);
        setError('시간별 날씨 데이터를 가져올 수 없습니다. API 키 또는 요청 URL을 확인하세요.');
      } finally {
        setLoading(false);
      }
    };

    fetchHourlyWeather();
  }, []);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>{name} 12시간 날씨 예보</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
        {hourlyData.map((hour, index) => (
          <div
            key={index}
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              textAlign: 'center',
              backgroundColor: '#f9f9f9',
              width: '100px',
            }}
          >
            <p><strong>{new Date(hour.dt * 1000).getHours()}시</strong></p>
            <p>{hour.main.temp}°C</p>
            <p>{hour.weather[0].description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HourlyWeather;
