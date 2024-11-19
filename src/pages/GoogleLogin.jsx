// src/pages/GoogleLogin.jsx
import React, { useState, useEffect } from "react";
import Loading from "../components/Loading";
import { auth } from "../firebase/firebase"; // Ensure correct path to firebase config
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const GoogleLogin = () => {
  const [user, setUser] = useState(null);
  const provider = new GoogleAuthProvider();
  const [loading, isLoading] = useState(false);

  useEffect(() => {
    // Check for user authentication state on component mount
    isLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Store user ID in localStorage
        isLoading(true);
        localStorage.setItem("userId", currentUser.uid);
      } else {
        setUser(null);
        localStorage.removeItem("userId");
      }
    });

    // Clean up the observer on component unmount
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
      // Store user ID in localStorage
      localStorage.setItem("userId", user.uid);
      console.log("Logged in user:", user);
      window.location.reload();
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      signOut(auth)
        .then(() => {
          setUser(null); // Clear the user state on logout
          localStorage.removeItem("userId"); // Clear localStorage
          console.log("User logged out successfully.");
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error during logout:", error);
        });
    }
  };
  return (
    <div className="flex flex-col md:ml-64 max-md:top-0 max-md:left-0 max-md:right-0 max-md:absolute items-center justify-center min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
        {user ? (
          <div>
            <h1 className="text-2xl font-bold mb-4">
              Welcome, {user.displayName}!
            </h1>
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="rounded-full w-24 h-24 my-4 mx-auto shadow"
            />
            <p className="text-gray-700 mb-2">Email: {user.email}</p>
            <p className="text-gray-700 mb-4">User ID: {user.uid}</p>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300"
            >
              Log Out
            </button>
          </div>
        ) : loading ? (
          <Loading />
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-4">Sign In</h1>
            <p className="mb-6 text-gray-600">
              Please sign in with your Google account.
            </p>
            <button
              onClick={handleGoogleLogin}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
            >
              Sign in with Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleLogin;
