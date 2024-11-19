import { useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function CreateMessage({ currentUser }) {
  const [receiver, setReceiver] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("You must be logged in to send a message.");
      return;
    }

    const sender = currentUser || currentUser.uid;

    if (!sender) {
      alert("Unable to determine sender information.");
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
      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message: ", error);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <form className="p-6 bg-white shadow rounded-lg" onSubmit={sendMessage}>
      <h2 className="text-xl font-bold mb-4">Send a Message</h2>
      <div className="mb-4">
        <label className="block text-gray-600 mb-2">Receiver</label>
        <input
          type="text"
          className="w-full border-gray-200 rounded-lg p-2"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          placeholder="Receiver ID (e.g., admin or user UID)"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-600 mb-2">Subject</label>
        <input
          type="text"
          className="w-full border-gray-200 rounded-lg p-2"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Message Subject"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-600 mb-2">Message</label>
        <textarea
          className="w-full border-gray-200 rounded-lg p-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your message..."
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Send
      </button>
    </form>
  );
}
