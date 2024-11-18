import React, { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
};

const validatePhone = (phone) => {
  const regex = /^[0-9]{10}$/;
  return regex.test(phone);
};

const MaintenanceRequestForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [indexNumber, setIndexNumber] = useState("");
  const [room, setRoom] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const user = localStorage.getItem("userId");
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
    name: "",
    room: "",
    description: "",
  });

  const handleSubmit = async () => {
    // Validate fields
    let isValid = true;
    let newErrors = {};

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
    if (!phone || !validatePhone(phone)) {
      newErrors.phone = "Phone number must be 10 digits";
      isValid = false;
    }
    if (!indexNumber) {
      newErrors.indexNumber = "Index number is required";
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

    if (!isValid) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "maintenanceRequests"), {
        user,
        name,
        email,
        indexNumber,
        phone,
        room,
        description,
        status: "Pending",
        timestamp: Timestamp.now(),
      });
      alert("Request submitted successfully!");
      setName("");
      setEmail("");
      setPhone("");
      setIndexNumber("");
      setRoom("");
      setDescription("");
      setPage(1); // Reset to the first page
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit request.");
    }
    setLoading(false);
  };

  const nextPage = () => setPage((prevPage) => prevPage + 1);
  const previousPage = () => setPage((prevPage) => prevPage - 1);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-2xl font-bold text-[#000] mb-6 text-center">
        Maintenance Request
      </h3>
      {page === 1 && (
        <form className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="text-lg font-semibold text-gray-600">
              Student Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Student Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="text-lg font-semibold text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className="text-lg font-semibold text-gray-600">
              Phone (10 digits)
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone (10 digits)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={nextPage}
            className="w-full bg-[#003366] hover:bg-[#2c5093] text-white py-3 rounded-lg font-bold text-lg"
          >
            Next
          </button>
        </form>
      )}

      {page === 2 && (
        <form className="space-y-6">
          {/* Index Number Field */}
          <div>
            <label className="text-lg font-semibold text-gray-600">
              Registration number
            </label>
            <input
              type="text"
              value={indexNumber}
              onChange={(e) => setIndexNumber(e.target.value)}
              placeholder="Index Number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
            />
            {errors.indexNumber && (
              <p className="text-red-500 text-sm">{errors.indexNumber}</p>
            )}
          </div>

          {/* Room Number Field */}
          <div>
            <label className="text-lg font-semibold text-gray-600">
              Room Number
            </label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="Room Number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
            />
            {errors.room && (
              <p className="text-red-500 text-sm">{errors.room}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label className="text-lg font-semibold text-gray-600">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the maintenance issue"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
              rows="4"
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          {/* Back and Submit Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={previousPage}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-bold text-lg"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#003366] hover:bg-[#2c5093] text-white py-2 px-4 rounded-lg font-bold text-lg"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MaintenanceRequestForm;
