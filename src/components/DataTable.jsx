import React from "react";

const DataTable = () => {
  const data = [
    { id: 1, name: "John Doe", age: 28, email: "johndoe@example.com" },
    { id: 2, name: "Jane Smith", age: 32, email: "janesmith@example.com" },
    { id: 3, name: "Samuel Adams", age: 45, email: "samueladams@example.com" },
  ];

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              ID
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Age
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="px-6 py-4">{row.id}</td>
              <td className="px-6 py-4">{row.name}</td>
              <td className="px-6 py-4">{row.age}</td>
              <td className="px-6 py-4">{row.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
