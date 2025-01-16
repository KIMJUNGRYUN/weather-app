import React, { useState } from "react";

const GeocodingTest = () => {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const GEOCODING_API_KEY = import.meta.env.REACT_APP_GOOGLE_API_KEY; // 실제 API 키로 대체하세요.

  

  const handleInputChange = (e) => {
    setAddress(e.target.value);
  };

  const fetchGeocode = async () => {
    if (!address) {
      setError("주소를 입력하세요.");
      return;
    }
    setError(null);
    setResult(null);
    
    const encodedAddress = encodeURIComponent(address);
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GEOCODING_API_KEY}`;

    try {
      const response = await fetch(geocodeUrl);
      const data = await response.json();

      if (data.status === "OK") {
        setResult(data.results);
      } else {
        setError(`지오코딩 실패: ${data.status}`);
      }
    } catch (err) {
      setError("API 호출 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Geocoding Test</h1>
      <input
        type="text"
        value={address}
        onChange={handleInputChange}
        placeholder="주소를 입력하세요"
        style={{ padding: "10px", width: "300px", marginRight: "10px" }}
      />
      <button
        onClick={fetchGeocode}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Geocode
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h2>Geocoding 결과</h2>
          {result.map((item, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <p>
                <strong>주소:</strong> {item.formatted_address}
              </p>
              <p>
                <strong>위도:</strong> {item.geometry.location.lat}
              </p>
              <p>
                <strong>경도:</strong> {item.geometry.location.lng}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GeocodingTest;
