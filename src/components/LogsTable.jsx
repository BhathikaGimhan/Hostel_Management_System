import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Loading from "../components/Loading";

const LogsTable = ({ userRole, userEmail }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

        // Filter logs for student role
        const filteredData =
          userRole === "student"
            ? logsData.filter((log) => log.email === userEmail)
            : logsData;

        setLogs(filteredData);
        setFilteredLogs(filteredData);
      } catch (error) {
        console.error("Error fetching logs:", error);
        alert("Failed to fetch logs.");
      }
      setLoading(false);
    };

    fetchLogs();
  }, [userRole, userEmail]);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchEmail(searchTerm);
    if (searchTerm) {
      const filtered = logs.filter((log) =>
        log.email ? log.email.toLowerCase().includes(searchTerm) : false
      );
      setFilteredLogs(filtered);
      setCurrentPage(1);
    } else {
      setFilteredLogs(logs);
    }
  };

  // Pagination logic
  const indexOfLastLog = currentPage * rowsPerPage;
  const indexOfFirstLog = indexOfLastLog - rowsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

  const totalPages = Math.ceil(filteredLogs.length / rowsPerPage);

  const goToPage = (page) => setCurrentPage(page);

  return (
    <div className=" mx-auto px-4">
      {loading && <Loading />}

      <div className="flex mb-4">
        <input
          type="text"
          value={searchEmail}
          onChange={handleSearch}
          placeholder="Search by user email..."
          className="p-2 border border-gray-300 rounded-lg w-full sm:w-2/3 md:w-1/3"
        />
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                Name
              </th>
              <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                Email
              </th>
              <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                Phone
              </th>
              <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                Index Number
              </th>
              <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                Type
              </th>
              <th className="px-4 py-2 text-center font-semibold text-white bg-[#003366]">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody>
            {currentLogs.length > 0 ? (
              currentLogs.map((log) => (
                <tr
                  className="border-b bg-[#E6EBF0] border-[#E1E1E1]"
                  key={log.id}
                >
                  <td className="px-4 py-2 text-center">{log.name}</td>
                  <td className="px-4 py-2 text-center">{log.email}</td>
                  <td className="px-4 py-2 text-center">{log.phone}</td>
                  <td className="px-4 py-2 text-center">{log.indexNumber}</td>
                  <td className="px-4 py-2 text-center">{log.type}</td>
                  <td className="px-4 py-2 text-center">
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

      {/* Pagination Controls */}
      <div className="flex justify-end items-center mt-4">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 mx-1 bg-gray-300 rounded disabled:opacity-50"
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => goToPage(i + 1)}
            className={`px-3 py-1 mx-1 ${
              i + 1 === currentPage ? "bg-[#003366] text-white" : "bg-gray-300"
            } rounded`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 mx-1 bg-gray-300 rounded disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default LogsTable;
