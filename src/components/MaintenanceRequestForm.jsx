import React, { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

// Email validation function
const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
};

// Phone validation function (for simplicity, we'll ensure it's a valid 10-digit number)
const validatePhone = (phone) => {
  const regex = /^[0-9]{10}$/;
  return regex.test(phone);
};

const MaintenanceRequestForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [indexNumber, setIndexNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [room, setRoom] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
    name: "",
    room: "",
    description: "",
  });

  // Handle form submission
  const handleSubmit = async () => {
    // Reset errors
    setErrors({
      email: "",
      phone: "",
      name: "",
      room: "",
      description: "",
    });

    let isValid = true;
    let newErrors = {};

    // Validation checks
    if (!name) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }
    if (!indexNumber) {
      newErrors.indexNumber = "Index number is required";
      isValid = false;
    }
    if (!phone || !validatePhone(phone)) {
      newErrors.phone = "Phone number must be 10 digits";
      isValid = false;
    }
    if (!room) {
      newErrors.room = "Room number is required";
      isValid = false;
    }
    if (!description) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    setErrors(newErrors);

    // If form is invalid, return
    if (!isValid) {
      return;
    }

    setLoading(true);
    try {
      // Add the maintenance request to Firestore
      await addDoc(collection(db, "maintenanceRequests"), {
        name,
        email,
        indexNumber,
        phone,
        room,
        description,
        status: "Pending", // New field to track request status
        timestamp: Timestamp.now(),
      });
      alert("Request submitted successfully!");
      // Reset form after submission
      setName("");
      setEmail("");
      setIndexNumber("");
      setPhone("");
      setRoom("");
      setDescription("");
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit request.");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-4 text-center">
        Maintenance Request
      </h2>
      {/* Name Field */}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Student Name"
        className="p-2 border border-gray-300 rounded-lg w-full mb-4"
      />
      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

      {/* Email Field */}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="p-2 border border-gray-300 rounded-lg w-full mb-4"
      />
      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

      {/* Index Number Field */}
      <input
        type="text"
        value={indexNumber}
        onChange={(e) => setIndexNumber(e.target.value)}
        placeholder="Index Number"
        className="p-2 border border-gray-300 rounded-lg w-full mb-4"
      />
      {errors.indexNumber && (
        <p className="text-red-500 text-sm">{errors.indexNumber}</p>
      )}

      {/* Phone Field */}
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone (10 digits)"
        className="p-2 border border-gray-300 rounded-lg w-full mb-4"
      />
      {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

      {/* Room Number Field */}
      <input
        type="text"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        placeholder="Room Number"
        className="p-2 border border-gray-300 rounded-lg w-full mb-4"
      />
      {errors.room && <p className="text-red-500 text-sm">{errors.room}</p>}

      {/* Description Field */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the maintenance issue"
        className="p-2 border border-gray-300 rounded-lg w-full mb-4"
        rows="4"
      ></textarea>
      {errors.description && (
        <p className="text-red-500 text-sm">{errors.description}</p>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="p-2 bg-blue-500 text-white rounded-lg w-full"
      >
        {loading ? "Submitting..." : "Submit Request"}
      </button>
    </div>
  );
};

export default MaintenanceRequestForm;
