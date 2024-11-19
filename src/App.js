import "./App.css";
import RoomReq from "./pages/RoomReq.jsx";
import Admin from "./pages/Admin.jsx";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Loading from "./components/Loading.jsx";
import StudentViewPage from "./pages/StudentViewPage.jsx";
import RegistrationForm from "./pages/RegistrationForm.jsx";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase.js";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import AdminDashBoard from "./pages/AdminDashBoard.jsx";
import EntryExit from "./pages/EntryExit.jsx";
import Students from "./pages/Students.jsx";
import Maintenance from "./pages/Maintenance.jsx";
import RequestMaintenace from "./pages/RequestMaintenace.jsx";
import UserDashBoard from "./pages/UserDashBoard.jsx";
import TrincomaleeCampusChecker from "./pages/TrincomaleeCampusChecker.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userRole, setUserRole] = useState(null); // Added userRole state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedUserRole = localStorage.getItem("userRole"); // Fetch role from localStorage

    if (storedUserId && storedUserRole) {
      console.log(storedUserId, storedUserRole);
      setIsLoggedIn(true);
      setUserRole(storedUserRole); // Assuming roles are numeric
      setIsRegistered(true);
      setIsLoading(false);
    } else {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log(user);

        if (user) {
          setIsLoggedIn(true);
          setIsRegistered(false);

          // Simulate fetching the role from Firebase
          const userRoleFromDB = 2; // Replace this with your logic to fetch the role
          setUserRole(userRoleFromDB); // Set role dynamically
          localStorage.setItem("userRole", userRoleFromDB);
        } else {
          setIsLoggedIn(false);
          setIsRegistered(false);
          localStorage.removeItem("userId");
          localStorage.removeItem("userRole");
        }
        setIsLoading(false);
      });

      return () => unsubscribe();
    }
  }, []);

  // Display loading spinner while checking authentication status
  if (isLoading) {
    return <Loading />;
  }
  console.log("Loading spinner", userRole);
  // Role-based route filtering
  const getRoutes = () => {
    if (userRole === "admin") {
      // Admin Routes
      return (
        <>
          <Route path="/" element={<AdminDashBoard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/students" element={<Students />} />
          <Route path="/entry-exit" element={<EntryExit />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route
            path="/location"
            element={<TrincomaleeCampusChecker />}
          ></Route>
        </>
      );
    } else if (userRole === "student") {
      // Student Routes
      return (
        <>
          <Route path="/" element={<UserDashBoard />} />
          <Route path="/roomreq" element={<RoomReq />} />
          <Route path="/student" element={<StudentViewPage />} />
          <Route path="/entry-exit" element={<EntryExit />} />
          <Route path="/maintenance" element={<Maintenance />} />

          <Route path="/requestmaintenace" element={<RequestMaintenace />} />
          <Route
            path="/location"
            element={<TrincomaleeCampusChecker />}
          ></Route>
        </>
      );
    } else {
      // Default to login if role is unknown
      return <Route path="/*" element={<RegistrationForm />} />;
    }
  };

  return (
    <>
      <Router>
        <div className="flex h-screen flex-col sm:flex-row w-full">
          {isLoggedIn && <Sidebar />}
          <div className="flex-1 flex flex-col">
            {isLoggedIn && <Header />}
            <main className="p-6 md:pl-72 ">
              {
                <Routes>
                  {isLoggedIn ? (
                    isRegistered ? (
                      getRoutes() // Role-based routes
                    ) : (
                      <Route path="/*" element={<RegistrationForm />} />
                    )
                  ) : (
                    <Route path="/*" element={<RegistrationForm />} />
                  )}
                  <Route
                    path="/register"
                    element={<Navigate to="/" replace />}
                  />
                  <Route path="/login" element={<RegistrationForm />} />
                </Routes>
              }
            </main>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
