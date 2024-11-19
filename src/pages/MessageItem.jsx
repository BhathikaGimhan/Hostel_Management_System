import {
  collection,
  onSnapshot,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useEffect, useState } from "react";
import MessageItem from "../components/MessageItem";

export default function MessagesPage({ userRole, currentUser }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Reference to the Firestore collection
    const messagesRef = collection(db, "messages");

    // Build query with filters and ordering
    const q = query(
      messagesRef,
      where("receiver", "==", userRole === "admin" ? "admin" : currentUser)
    );

    // Subscribe to Firestore updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const unsortedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const sortedMessages = unsortedMessages.sort(
        (a, b) => b.timestamp - a.timestamp
      ); // Sort manually
      setMessages(sortedMessages);
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, [userRole, currentUser]);

  // Handle marking a message as read
  const handleMarkAsRead = async (messageId) => {
    try {
      const messageRef = doc(db, "messages", messageId);
      await updateDoc(messageRef, { read: true });
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">Inbox</h2>
      {messages.length > 0 ? (
        messages.map((msg) => (
          <MessageItem
            key={msg.id}
            subject={msg.subject}
            message={msg.message}
            sender={msg.sender}
            timestamp={msg.timestamp}
            isRead={msg.read}
            onClick={() => handleMarkAsRead(msg.id)} // Mark message as read on click
          />
        ))
      ) : (
        <p>No messages to display.</p>
      )}
    </div>
  );
}
