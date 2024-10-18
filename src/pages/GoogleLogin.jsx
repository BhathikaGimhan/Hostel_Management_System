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
    <div className="flex flex-col items-center justify-center min-h-screen">
      {user ? (
        <div className="text-center">
          <p className="text-lg font-bold">Welcome, {user.displayName}!</p>
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="rounded-full w-24 h-24 my-4"
          />
          <p>Email: {user.email}</p>
          <p>User ID: {user.uid}</p>
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Log Out
          </button>
        </div>
      ) : (
        <button
          onClick={handleGoogleLogin}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
};

export default GoogleLogin;
