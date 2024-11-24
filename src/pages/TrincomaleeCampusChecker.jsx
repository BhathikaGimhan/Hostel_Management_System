import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPinHouse } from "lucide-react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

// Haversine formula for distance calculation
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

const TrincomaleeCampusChecker = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [isNearby, setIsNearby] = useState(null);
  const [locationAccessDenied, setLocationAccessDenied] = useState(false);
  const navigate = useNavigate();

  const TRINCOMALEE_COORDS = { lat: 8.576441, lng: 81.231232 }; // Trincomalee Campus coordinates
  const PROXIMITY_THRESHOLD_KM = 5; // 5 kilometers

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "", // Replace with your API key
  });

  const checkProximity = (latitude, longitude) => {
    const distance = calculateDistance(
      latitude,
      longitude,
      TRINCOMALEE_COORDS.lat,
      TRINCOMALEE_COORDS.lng
    );
    setIsNearby(distance <= PROXIMITY_THRESHOLD_KM);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          checkProximity(latitude, longitude);
          setLocationAccessDenied(false);
          console.log(position);
        },
        (error) => {
          console.error("Error fetching location:", error);
          if (error.code === error.PERMISSION_DENIED) {
            setLocationAccessDenied(true);
          }
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleNavigation = () => {
    if (locationAccessDenied) {
      alert("Location access is required to proceed.");
    } else {
      navigate("/entry-exit");
    }
  };

  return (
    <div className="flex items-center justify-center bg-white p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full">
        <MapPinHouse className="w-24 h-24 text-gray-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Location Checker
        </h1>
        {userLocation ? (
          isNearby === null ? (
            <p className="text-center text-gray-500">
              Checking your location...
            </p>
          ) : isNearby ? (
            <div className="text-center text-green-600 font-medium">
              <p>You are near Trincomalee Campus.</p>
              <button
                onClick={handleNavigation}
                className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Go to Entry/Exit Page
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-red-600 font-medium">
                You are not near Trincomalee Campus.
              </p>
              <button
                onClick={handleNavigation}
                className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Submit Exit Request
              </button>
            </div>
          )
        ) : (
          <div className="text-center">
            <p className="text-gray-500">
              Unable to fetch your location. Please ensure location services are
              enabled.
            </p>
            <button
              onClick={handleNavigation}
              className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Allow Location Access
            </button>
          </div>
        )}
        {/* Add Google Map */}
        {isLoaded && (
          <div className="mt-6">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "300px" }}
              center={userLocation || TRINCOMALEE_COORDS}
              zoom={14}
            >
              <Marker
                position={TRINCOMALEE_COORDS}
                label="Trincomalee Campus"
              />
              {userLocation && (
                <Marker position={userLocation} label="Your Location" />
              )}
            </GoogleMap>
          </div>
        )}
        {!isLoaded && <p>Loading map...</p>}
      </div>
    </div>
  );
};

export default TrincomaleeCampusChecker;
