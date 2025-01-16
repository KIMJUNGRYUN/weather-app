import React, { useEffect, useState } from "react";

const Geolocation = ({ onWeatherData }) => {
  const [location, setLocation] = useState({ nx: null, ny: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = encodeURIComponent(import.meta.env.VITE_MTA_API); // 인증키
  const API_URL = import.meta.env.VITE_MTA_URL;; // 기상청 API URL

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("브라우저에서 위치 정보를 지원하지 않습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nx = 60; // x 좌표 (예시)
        const ny = 127; // y 좌표 (예시)
        setLocation({ nx, ny });
      },
      (err) => {
        setError("위치 정보를 가져올 수 없습니다.");
        console.error(err);
      }
    );
  }, []);

  useEffect(() => {
    if (!location.nx || !location.ny) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      const baseDate = "20250113"; // 기준 날짜
      const baseTime = "0500"; // 기준 시간

      try {
        const url = `${API_URL}?serviceKey=${API_KEY}&pageNo=1&numOfRows=10&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${location.nx}&ny=${location.ny}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`날씨 데이터를 가져오는 데 실패했습니다: ${response.statusText}`);
        }

        const data = await response.json();
        const items = data?.response?.body?.items?.item;

        if (!items || items.length === 0) throw new Error("데이터가 없습니다.");

        const translatedItems = items.map((item) => {
          const translations = {
            TMP: "기온",
            SKY: "하늘 상태",
            PTY: "강수 형태",
            POP: "강수 확률",
            WSD: "풍속",
            PCP: "강수량",
            REH: "습도",
          };
          return {
            ...item,
            category: translations[item.category] || item.category,
          };
        });

        onWeatherData(translatedItems); // 부모 컴포넌트에 데이터 전달
      } catch (err) {
        console.error("날씨 데이터를 가져오는 데 실패했습니다:", err);
        setError("날씨 데이터를 가져오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location, onWeatherData]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return null; // 이 컴포넌트는 데이터를 전달하는 역할만 수행
};

export default Geolocation;
