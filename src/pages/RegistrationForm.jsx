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
import Loading from "../components/Loading";
import UserDetailsModal from "../components/UserDetailsModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    setloading(true);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        await checkRegistration(currentUser.uid);
        setloading(false);
      } else {
        setUser(null);
        setloading(false);

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
      console.log(querySnapshot);
      if (!querySnapshot.empty) {
        setIsRegistered(true);
        localStorage.setItem("userId", uid);
        setloading(false);
        // window.location.reload();
      } else {
        setIsRegistered(false);
        setloading(false);
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
          setUser(null);
          localStorage.removeItem("userId");
          setIsRegistered(false);
          window.location.reload();
        })
        .catch((error) => console.error("Error during logout:", error));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdditionalInfo({ ...additionalInfo, [name]: value });
  };

  const handleRegistration = async () => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(additionalInfo.phone)) {
      toast.warn(
        "Phone number must be exactly 10 digits and contain only numbers."
      );
      return;
    }

    // Validate other fields if necessary
    if (
      !additionalInfo.indexNumber.trim() ||
      !additionalInfo.otherDetail.trim()
    ) {
      toast.warn("All fields are required. Please fill in all the details.");
      return;
    }
    setLoading(true);
    try {
      const newUser = {
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        phone: additionalInfo.phone,
        indexNumber: additionalInfo.indexNumber,
        otherDetail: additionalInfo.otherDetail,
        userRole: "student",
      };
      await addDoc(collection(db, "users"), newUser);
      toast.success("Registration successful");
      localStorage.setItem("userId", user.uid);
      setIsRegistered(true);
      window.location.reload();
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error("Registration failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex absolute top-0 right-0 left-0 bottom-0 items-center justify-center">
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
            <p className="text-gray-700 mb-4">Finger print Hash: {user.uid}</p>

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
                      pattern="[0-9]{10}"
                      title="Please enter a valid 10-digit phone number"
                      className="w-full p-2 border border-gray-300 rounded mb-4"
                      placeholder="Enter your phone number"
                      required
                    />
                    <label className="block mb-2">Reg Number:</label>
                    <input
                      type="text"
                      name="indexNumber"
                      value={additionalInfo.indexNumber}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded mb-4"
                      placeholder="Enter your register number"
                      required
                    />
                    <label className="block mb-2">Sex:</label>
                    <input
                      type="text"
                      name="otherDetail"
                      value={additionalInfo.otherDetail}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded mb-4"
                      placeholder="Enter your sex"
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
                <Loading />
              </>
            )}
          </div>
        ) : load ? (
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
        <UserDetailsModal />
      </div>
    </div>
  );
};

export default RegistrationForm;
