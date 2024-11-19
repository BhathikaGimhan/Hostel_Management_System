export default function MessageItem({ subject, message, sender, timestamp }) {
  return (
    <div className="p-4 bg-white shadow rounded-lg mb-4">
      <h4 className="text-lg font-medium">{subject}</h4>
      <p className="text-gray-600 mt-2">{message}</p>
      <p className="text-gray-500 text-sm mt-4">From: {sender}</p>
      <p className="text-gray-400 text-xs">
        {new Date(timestamp?.toDate()).toLocaleString()}
      </p>
    </div>
  );
}
