import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";


const MapComponent = ({ lat, lon, onMapClick }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY, // 실제 API 키로 교체하세요
  });

  if (!isLoaded) return <p className="text-center text-gray-500">지도를 불러오는 중...</p>;

  const handleMapClick = (event) => {
    const clickedLat = event.latLng.lat();
    const clickedLng = event.latLng.lng();
    onMapClick(clickedLat, clickedLng);
  };

  return (
    <div className="p-4 flex justify-center items-center">
      <div className="relative w-full sm:w-[90%] md:w-[80%] lg:w-[100%] h-[300px] sm:h-[350px] md:h-[400px] bg-gradient-to-br from-blue-500 to-blue-300 rounded-xl shadow-xl overflow-hidden">
        {/* 지도 */}
        <GoogleMap
          center={{ lat, lng: lon }}
          zoom={17}
          mapContainerClassName="w-full h-full rounded-xl"
          options={{
            disableDefaultUI: true, // 기본 UI 숨김
            zoomControl: true, // 줌 컨트롤 활성화
            styles: [
              {
                featureType: "water",
                elementType: "geometry.fill",
                stylers: [{ color: "#a3ccff" }],
              },
              {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#ffffff" }],
              },
              {
                featureType: "poi",
                elementType: "geometry",
                stylers: [{ color: "#d8e3e8" }],
              },
              {
                featureType: "all",
                elementType: "labels.text.fill",
                stylers: [{ color: "#2f2f2f" }],
              },
            ],
          }}
          onClick={handleMapClick}
        >
          {/* 마커 */}
          <Marker
            position={{ lat, lng: lon }}
            icon={{
              url: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
              scaledSize: new window.google.maps.Size(40, 40), // 마커 크기
            }}
          />
        </GoogleMap>
        {/* 정보창 */}
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 text-gray-800 text-xs sm:text-sm md:text-base font-semibold px-4 py-2 rounded-md shadow-md">
          <p>Latitude: {lat.toFixed(4)}</p>
          <p>Longitude: {lon.toFixed(4)}</p>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
