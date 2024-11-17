import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TrincomaleeCampusChecker = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [isNearby, setIsNearby] = useState(null);
  const [locationAccessDenied, setLocationAccessDenied] = useState(false);
  const navigate = useNavigate(); // Initialize React Router navigation

  const TRINCOMALEE_COORDS = { lat: 7.64177, lng: 80.586 };
  const PROXIMITY_THRESHOLD = 0.05;

  const checkProximity = (latitude, longitude) => {
    const isWithinProximity =
      Math.abs(latitude - TRINCOMALEE_COORDS.lat) <= PROXIMITY_THRESHOLD &&
      Math.abs(longitude - TRINCOMALEE_COORDS.lng) <= PROXIMITY_THRESHOLD;
    setIsNearby(isWithinProximity);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          checkProximity(latitude, longitude);
          setLocationAccessDenied(false); // Reset denial state
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
      navigate("/entry-exit"); // Navigate to EntryExit page
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
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
      </div>
    </div>
  );
};

export default TrincomaleeCampusChecker;
