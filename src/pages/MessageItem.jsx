import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useEffect, useState } from "react";
import MessageItem from "../components/MessageItem";

export default function MessagesPage({ userRole, currentUser }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      where("receiver", "==", userRole === "admin" ? "admin" : currentUser?.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [userRole, currentUser]);

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
          />
        ))
      ) : (
        <p>No messages to display.</p>
      )}
    </div>
  );
}
