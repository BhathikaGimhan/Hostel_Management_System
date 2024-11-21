import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../firebase/firebase"; // Import them separately
import { auth } from "../firebase/firebase"; // Firestore instance

import { doc, setDoc } from "firebase/firestore";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentRegistrationPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentName, setStudentName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Firebase Auth - Create User
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Firestore - Save student data
      await setDoc(doc(db, "students", user.uid), {
        studentName,
        email,
        studentId: user.uid,
      });

      toast("Registration successful");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Student Registration
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleRegister} className="flex flex-col space-y-4">
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="p-3 border border-gray-300 rounded"
            placeholder="Enter your full name"
            required
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border border-gray-300 rounded"
            placeholder="Enter your email"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded"
            placeholder="Create a password"
            required
          />

          <button
            type="submit"
            className={`p-3 text-white font-bold rounded ${
              loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentRegistrationPage;
