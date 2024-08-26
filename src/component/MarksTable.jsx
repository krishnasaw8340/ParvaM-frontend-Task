import React from 'react';

const MarksTable = ({ marks }) => {
  return (
    <div className="container mx-auto mt-4">
      <h2 className="text-lg font-bold mb-4">Student Marks</h2>

      {/* Set a fixed height and width for the scrollable area */}
      <div style={{ height: '150px', width: '100%', overflow: 'auto' }} className="shadow-md rounded bg-white">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200 border-b text-left">Subject Name</th>
              <th className="py-2 px-4 bg-gray-200 border-b text-left">Exam Date</th>
              <th className="py-2 px-4 bg-gray-200 border-b text-left">Marks Obtained</th>
              <th className="py-2 px-4 bg-gray-200 border-b text-left">Max Marks</th>
              <th className="py-2 px-4 bg-gray-200 border-b text-left">Grade</th>
            </tr>
          </thead>
          <tbody>
            {marks && marks.length > 0 ? (
              marks.map((record) => (
                <tr key={record._id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">
                    {record.subjectName || '--'}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {record.examDate ? new Date(record.examDate).toLocaleDateString() : '--'}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {record.marksObtained || '--'}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {record.maxMarks || '--'}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {record.grade || '--'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-2 px-4 border-b text-center" colSpan="5">
                  No marks records found. Please add some.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarksTable;
