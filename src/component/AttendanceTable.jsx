import React from 'react';

const AttendanceTable = ({ attendance }) => {
  return (
    <div className="container mx-auto mt-4">
      <h2 className="text-lg font-bold mb-4">Student Attendance</h2>
      
      {/* Set a fixed height and width for the scrollable area */}
      <div style={{ height: '150px', width: '100%', overflow: 'auto' }} className="shadow-md rounded bg-white">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200 border-b text-left">Date</th>
              <th className="py-2 px-4 bg-gray-200 border-b text-left">Status</th>
              <th className="py-2 px-4 bg-gray-200 border-b text-left">Reason</th>
            </tr>
          </thead>
          <tbody>
            {attendance && attendance.length > 0 ? (
              attendance.map((record) => (
                <tr key={record._id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">{record.status}</td>
                  <td className="py-2 px-4 border-b">{record.reason || '--'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-2 px-4 border-b text-center" colSpan="3">
                  No attendance records found. Please Add
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;
