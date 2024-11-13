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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        setCurrentUser(user);

        // Check if the user is registered
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setIsRegistered(true);
        } else {
          setIsRegistered(false);
        }
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
        setIsRegistered(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      {" "}
      {isLoggedIn && <NavBar />}{" "}
      <Routes>
        {" "}
        {isLoggedIn ? (
          isRegistered ? (
            <>
              <Route path="/" element={<RoomReq />} />{" "}
              <Route path="/admin" element={<Admin />} />{" "}
              <Route path="/student" element={<StudentViewPage />} />{" "}
              <Route path="/register" element={<Navigate to="/" replace />} />{" "}
              <Route path="/login" element={<Navigate to="/" replace />} />{" "}
            </>
          ) : (
            <Route path="/*" element={<RegistrationForm />} />
          )
        ) : (
          <Route path="/*" element={<GoogleLogin />} />
        )}{" "}
      </Routes>{" "}
    </Router>
  );
}

export default App;
