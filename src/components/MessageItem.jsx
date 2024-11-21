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
        isRead ? "bg-white" : "bg-[#70b0f0]"
      }`}
    >
      <h3 className="text-xl font-semibold">Subject : {subject}</h3>
      <p className="text-gray-700 mb-5 mt-5">{message}</p>
      <div className="mt-2 text-sm text-black">
        <span>From: {sender}</span> <br></br>
        <span>{formattedTime}</span>
      </div>
    </div>
  );
}
