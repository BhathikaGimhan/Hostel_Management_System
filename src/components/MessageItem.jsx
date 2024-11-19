export default function MessageItem({
  subject,
  message,
  sender,
  timestamp,
  isRead,
  onClick,
}) {
  const formattedTime = new Date(timestamp?.seconds * 1000).toLocaleString();
  console.log(isRead);

  return (
    <div
      onClick={onClick}
      className={`p-4 mb-4 border rounded-lg cursor-pointer ${
        isRead ? "bg-blue-500" : "bg-red-500"
      }`}
    >
      <h3 className="text-lg font-semibold">{subject}</h3>
      <p className="text-gray-700">{message}</p>
      <div className="mt-2 text-sm text-gray-500">
        <span>From: {sender}</span> | <span>{formattedTime}</span>
      </div>
    </div>
  );
}
