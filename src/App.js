import logo from "./logo.svg";
import "./App.css";
import RoomReq from "./pages/RoomReq.jsx";
import Admin from "./pages/Admin.jsx";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import StudentViewPage from "./pages/StudentViewPage.jsx";
import GoogleLogin from "./pages/GoogleLogin.jsx";
import RegistrationForm from "./pages/RegistrationForm.jsx";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase/firebase.js";
import { doc, getDoc } from "firebase/firestore";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import AdminDashBoard from "./pages/AdminDashBoard.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    if (storedUserId) {
      setIsLoggedIn(true);
      setIsRegistered(true);
      // checkUserRegistration(storedUserId);
    } else {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setIsLoggedIn(true);
          setCurrentUser(user);
          localStorage.setItem("userId", user.uid);
        } else {
          setIsLoggedIn(false);
          setCurrentUser(null);
          setIsRegistered(false);
          localStorage.removeItem("userId");
        }
      });

      return () => unsubscribe();
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {isLoggedIn && <Sidebar />}

      <div className="flex-1">
        <Header />
        <main className="p-6">
          <Router>
            <Routes>
              {isLoggedIn ? (
                isRegistered ? (
                  <>
                    <Route path="/" element={<AdminDashBoard />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/student" element={<StudentViewPage />} />
                    <Route
                      path="/register"
                      element={<Navigate to="/" replace />}
                    />
                    {/* <Route path="/login" element={<Navigate to="/" replace />} /> */}
                    <Route path="/login" element={<RegistrationForm />} />
                  </>
                ) : (
                  <Route path="/*" element={<RegistrationForm />} />
                )
              ) : (
                <Route path="/*" element={<GoogleLogin />} />
              )}
            </Routes>
          </Router>
        </main>
      </div>
    </div>
  );
}

export default App;
