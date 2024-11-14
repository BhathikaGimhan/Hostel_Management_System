import React, { useState, useEffect } from "react";
import { auth } from "../firebase/firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

const RegistrationForm = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [load, setloading] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState({
    phone: "",
    indexNumber: "",
    otherDetail: "",
  });
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await checkRegistration(currentUser.uid);
        console.log("zzz");
      } else {
        setUser(null);
        localStorage.removeItem("userId");
      }
    });
    return () => unsubscribe();
  }, []);

  const checkRegistration = async (uid) => {
    try {
      setloading(true);
      const userQuery = query(collection(db, "users"), where("uid", "==", uid));
      const querySnapshot = await getDocs(userQuery);
      console.log(querySnapshot.empty);
      if (!querySnapshot.empty) {
        setIsRegistered(true);
        localStorage.setItem("userId", uid);
        console.log("dddd");
        setloading(false);
      } else {
        setIsRegistered(false);
        setloading(false);
        console.log("ttt");
        localStorage.removeItem("userId");
      }
    } catch (error) {
      console.error("Error checking registration:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
      await checkRegistration(user.uid);
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      signOut(auth)
        .then(() => {
          setUser(null);
          localStorage.removeItem("userId");
          setIsRegistered(false);
        })
        .catch((error) => console.error("Error during logout:", error));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdditionalInfo({ ...additionalInfo, [name]: value });
  };

  const handleRegistration = async () => {
    setLoading(true);
    try {
      const newUser = {
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        phone: additionalInfo.phone,
        indexNumber: additionalInfo.indexNumber,
        otherDetail: additionalInfo.otherDetail,
      };
      await addDoc(collection(db, "users"), newUser);
      alert("Registration successful");
      localStorage.setItem("userId", user.uid);
      setIsRegistered(true);
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Registration failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
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

            {!load ? (
              <>
                {!isRegistered && (
                  <div className="my-4 text-left">
                    <label className="block mb-2">Phone Number:</label>
                    <input
                      type="tel"
                      name="phone"
                      value={additionalInfo.phone}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded mb-4"
                      placeholder="Enter your phone number"
                      required
                    />
                    <label className="block mb-2">Index Number:</label>
                    <input
                      type="text"
                      name="indexNumber"
                      value={additionalInfo.indexNumber}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded mb-4"
                      placeholder="Enter your index number"
                      required
                    />
                    <label className="block mb-2">Other Details:</label>
                    <input
                      type="text"
                      name="otherDetail"
                      value={additionalInfo.otherDetail}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded mb-4"
                      placeholder="Enter additional details"
                    />
                  </div>
                )}

                {!isRegistered && (
                  <button
                    onClick={handleRegistration}
                    disabled={loading}
                    className={`w-full p-3 text-white font-bold rounded-lg ${
                      loading
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {loading ? (
                      <div className="flex justify-center items-center">
                        <div className="w-6 h-6 border-4 border-transparent text-blue-400 text-2xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full"></div>
                      </div>
                    ) : (
                      "Complete Registration"
                    )}
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="flex-col gap-4 w-full flex items-center justify-center">
                  <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
                    <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full" />
                  </div>
                </div>
              </>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded mt-4 hover:bg-red-700 transition duration-300"
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

export default RegistrationForm;
