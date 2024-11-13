import logo from "./logo.svg";
import "./App.css";
import RoomReq from "./pages/RoomReq.jsx";
import Admin from "./pages/Admin.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import StudentViewPage from "./pages/StudentViewPage.jsx";
import StudentRegistrationPage from "./pages/StudentRegistrationPage.jsx";
import GoogleLogin from "./pages/GoogleLogin.jsx";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase.js";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setCurrentUser(user);
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
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
          <>
            <Route path="/" element={<RoomReq />} />{" "}
            <Route path="/admin" element={<Admin />} />{" "}
            <Route path="/student" element={<StudentViewPage />} />{" "}
            <Route path="/login" element={<GoogleLogin to="/" replace />} />{" "}
          </>
        ) : (
          <Route path="/*" element={<GoogleLogin />} />
        )}{" "}
      </Routes>{" "}
    </Router>
  );
}

export default App;
