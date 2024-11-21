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
import MessageModal from "../components/MessageModal"; // Import a custom Modal component

export default function MessagesPage({ userRole, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null); // State for selected message
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state

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

  // Handle message click to open modal
  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true); // Show modal
    if (!message.read) {
      handleMarkAsRead(message.id); // Mark as read
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
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
            onClick={() => handleMessageClick(msg)} // Open modal on click
          />
        ))
      ) : (
        <p>No messages to display.</p>
      )}

      {/* Modal for displaying message details */}
      {isModalOpen && selectedMessage && (
        <MessageModal onClose={handleCloseModal}>
          <div className="p-6">
            <h3 className="text-xl font-bold">
              Subject : {selectedMessage.subject}
            </h3>
            <p className="mt-4 border rounded-lg p-3">
              {selectedMessage.message}
            </p>
            <p className="text-sm text-gray-600 mb-5 mt-5">
              From: {selectedMessage.sender}
            </p>
          </div>
        </MessageModal>
      )}
    </div>
  );
}
