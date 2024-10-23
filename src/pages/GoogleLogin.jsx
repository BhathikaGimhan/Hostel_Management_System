// src/pages/GoogleLogin.jsx
import React, { useState, useEffect } from "react";
import { auth } from "../firebase/firebase"; // Correctly import auth instance
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const GoogleLogin = () => {
  const [user, setUser] = useState(null);
  const provider = new GoogleAuthProvider();

  // Check for user authentication state on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Clean up the observer on component unmount
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
      console.log(user);
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
          console.log("User logged out successfully.");
        })
        .catch((error) => {
          console.error("Error during logout:", error);
        });
    }
  };

  return (
    <div className="flex flex-col md:ml-64 max-md:top-0 max-md:left-0 max-md:right-0 max-md:absolute items-center justify-center min-h-screen ">
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
