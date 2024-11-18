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
import DataTable from "./components/DataTable.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    if (storedUserId) {
      console.log(storedUserId);
      setIsLoggedIn(true);
      setIsRegistered(true);
      setIsLoading(false);
    } else {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log(user);

        if (user) {
          setIsLoggedIn(true);
          setIsRegistered(false);
        } else {
          setIsLoggedIn(false);
          setIsRegistered(false);
          localStorage.removeItem("userId");
        }
        setIsLoading(false); // Finish loading once auth state is determined
      });

      return () => unsubscribe();
    }
  }, []);

  // Display loading spinner while checking authentication status
  if (isLoading) {
    return <Loading />;
  }

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
                      <>
                        <Route path="/" element={<AdminDashBoard />} />
                        <Route
                          path="/userdashboard"
                          element={<UserDashBoard />}
                        />
                        <Route path="/roomreq" element={<RoomReq />} />
                        <Route path="/student" element={<StudentViewPage />} />
                        <Route path="/students" element={<DataTable />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route
                          path="/location"
                          element={<TrincomaleeCampusChecker />}
                        ></Route>
                        <Route path="/entry-exit" element={<EntryExit />} />
                        <Route path="/maintenance" element={<Maintenance />} />
                        <Route
                          path="/requestmaintenace"
                          element={<RequestMaintenace />}
                        />
                        <Route
                          path="/register"
                          element={<Navigate to="/" replace />}
                        />
                        <Route path="/login" element={<RegistrationForm />} />
                      </>
                    ) : (
                      <Route path="/*" element={<RegistrationForm />} />
                    )
                  ) : (
                    <Route path="/*" element={<RegistrationForm />} />
                  )}
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
