import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentTable from "./component/StudentTable";
import AttendanceModal from "./component/AttendanceModal";
import MarksModal from "./component/MarksModal";
import AddStudentModal from "./component/AddStudentModal";
import UpdateStudent from "./component/UpdateStudent";
import Button from "@mui/material/Button";

const App = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openAddStudentModal, setOpenAddStudentModal] = useState(false);
  const [openAttendanceModal, setOpenAttendanceModal] = useState(false);
  const [openMarksModal, setOpenMarksModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");  // Search state

  useEffect(() => {
    loadStudents();
  }, [searchQuery]); 

  const loadStudents = () => {
    axios
      .get("http://localhost:5000/api/v1/students")
      .then((response) => {
        const filteredStudents = response.data.filter(student =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setStudents(filteredStudents);
      })
      .catch((error) => console.error("Error fetching student data:", error));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleOpenAddStudentModal = () => {
    setOpenAddStudentModal(true);
  };

  const handleCloseAddStudentModal = () => {
    setOpenAddStudentModal(false);
  };

  const handleDeleteStudent = (studentId) => {
    axios
      .delete(`http://localhost:5000/api/v1/student/${studentId}`)
      .then(() => {
        loadStudents(); // Reload the students after deletion
      })
      .catch((error) => console.error("Error deleting student:", error));
  };

  const handleUpdateStudent = (student) => {
    axios
      .put(`http://localhost:5000/api/v1/students/${student._id}`, student)
      .then(() => {
        loadStudents();
        setOpenUpdateModal(false);
      })
      .catch((error) => console.error("Error updating student:", error));
  };

  const handleDownloadReport = async (studentId) => {
    console.log("Student id  is coming", studentId)
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/student/report/${studentId}`, {
        responseType: 'blob' 
      });
      if (response.status === 200) {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `Student_Report_${studentId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error('Failed to download report');
      }
    } catch (error) {
      console.error('Error downloading the report:', error);
    }
  };

  const handleAddStudent = (studentData) => {
    axios
      .post("http://localhost:5000/api/v1/students", studentData)
      .then(() => {
        loadStudents();
        handleCloseAddStudentModal();
      })
      .catch((error) => console.error("Error adding student:", error));
  };

  const handleAttendanceSave = (data) => {
    if (selectedStudent) {
      axios
        .post("http://localhost:5000/api/v1/attendance", {
          studentId: selectedStudent._id,
          ...data,
        })
        .then(() => {
          loadStudents();
          setOpenAttendanceModal(false);
        })
        .catch((error) => console.error("Error recording attendance:", error));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-center text-2xl font-bold my-4">
        Student Management System
      </h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by student name..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 rounded"
        />
      </div>

      <Button variant="contained" onClick={handleOpenAddStudentModal}>
        Add Student
      </Button>

      <StudentTable
        students={students}
        onAttendanceClick={(student) => {
          setSelectedStudent(student);
          setOpenAttendanceModal(true);
        }}
        onMarksClick={(student) => {
          setSelectedStudent(student);
          setOpenMarksModal(true);
        }}
        onDeleteClick={handleDeleteStudent}
        onUpdateClick={(student) => {
          setSelectedStudent(student);
          setOpenUpdateModal(true);
        }}
        onDownloadClick={handleDownloadReport}
      />

      <AddStudentModal
        open={openAddStudentModal}
        onClose={handleCloseAddStudentModal}
        onSave={handleAddStudent}
      />

      {selectedStudent && (
        <AttendanceModal
          open={openAttendanceModal}
          onClose={() => setOpenAttendanceModal(false)}
          student={selectedStudent}
          onSave={handleAttendanceSave}
        />
      )}

      {selectedStudent && (
        <MarksModal
          open={openMarksModal}
          onClose={() => setOpenMarksModal(false)}
          student={selectedStudent}
        />
      )}

      {selectedStudent && (
        <UpdateStudent
          open={openUpdateModal}
          onClose={() => setOpenUpdateModal(false)}
          student={selectedStudent}
          onSave={handleUpdateStudent}
        />
      )}
    </div>
  );
};

export default App;
