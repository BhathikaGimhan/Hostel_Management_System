// src/pages/GoogleLogin.jsx
import React, { useState } from "react";
import { auth } from "../firebase/firebase"; // Correctly import auth instance
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const GoogleLogin = () => {
  const [user, setUser] = useState(null);
  const provider = new GoogleAuthProvider(); // Move provider declaration here

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
      console.log(user);
      console.log(user);
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
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
          <p>Email: {user.uid}</p>
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
