import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateMessage({ currentUser }) {
  const [receiver, setReceiver] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("You must be logged in to send a message.");
      return;
    }

    const sender = currentUser || currentUser.uid;

    if (!sender) {
      toast.error("Unable to determine sender information.");
      return;
    }

    try {
      await addDoc(collection(db, "messages"), {
        sender,
        receiver,
        subject,
        message,
        read: false,
        timestamp: serverTimestamp(),
      });

      setReceiver("");
      setSubject("");
      setMessage("");
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message: ", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div>
      <form className="p-6 bg-white shadow rounded-lg" onSubmit={sendMessage}>
        <h2 className="text-xl font-bold mb-4">Send a Message</h2>
        <div className="mb-4">
          <label className="text-lg font-semibold text-gray-600">
            Receiver
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            placeholder="Receiver ID (e.g., admin or user UID)"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-lg font-semibold text-gray-600">Subject</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Message Subject"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-lg font-semibold text-gray-600">Message</label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message..."
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#003366] hover:bg-[#2c5093] text-white py-3 rounded-lg font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
        >
          Send
        </button>
      </form>
      <div>
        {/* Add your table and logic here */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
}
