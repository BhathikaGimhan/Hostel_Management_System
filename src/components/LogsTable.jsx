import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Loading from "../components/Loading";

const LogsTable = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");
  const [filteredLogs, setFilteredLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const logsCollection = collection(db, "entryExitLogs");
        const logsQuery = query(logsCollection, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(logsQuery);

        const logsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLogs(logsData);
        setFilteredLogs(logsData);
      } catch (error) {
        console.error("Error fetching logs:", error);
        alert("Failed to fetch logs.");
      }
      setLoading(false);
    };

    fetchLogs();
  }, []);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchEmail(searchTerm);
    if (searchTerm) {
      const filtered = logs.filter((log) =>
        log.email ? log.email.toLowerCase().includes(searchTerm) : false
      );
      setFilteredLogs(filtered);
    } else {
      setFilteredLogs(logs);
    }
  };

  return (
    <div className="p-4 md:p-8">
      {loading && <Loading />}

      <h1 className="text-2xl font-bold mb-4 text-center">Entry/Exit Logs</h1>

      <div className="flex justify-center mb-4">
        <input
          type="text"
          value={searchEmail}
          onChange={handleSearch}
          placeholder="Search by user email..."
          className="p-2 border border-gray-300 rounded-lg w-full max-w-md"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Phone</th>
              <th className="px-4 py-2 border-b">Index Number</th>
              <th className="px-4 py-2 border-b">Type</th>
              <th className="px-4 py-2 border-b">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td className="px-4 py-2 border-b">{log.name}</td>
                  <td className="px-4 py-2 border-b">{log.email}</td>
                  <td className="px-4 py-2 border-b">{log.phone}</td>
                  <td className="px-4 py-2 border-b">{log.indexNumber}</td>
                  <td className="px-4 py-2 border-b">{log.type}</td>
                  <td className="px-4 py-2 border-b">
                    {new Date(log.timestamp.toDate()).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogsTable;
