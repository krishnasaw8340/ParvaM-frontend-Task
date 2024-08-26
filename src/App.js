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

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    const fetchStudentById = async (studentId) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/students/${studentId}`);
        setSelectedStudent(response.data);
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    };

    if (openUpdateModal && selectedStudent) {
      fetchStudentById(selectedStudent._id);
    }
  }, [openUpdateModal, selectedStudent]);

  const loadStudents = () => {
    axios
      .get("http://localhost:5000/api/v1/students")
      .then((response) => setStudents(response.data))
      .catch((error) => console.error("Error fetching student data:", error));
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
      // Perform GET request to fetch the PDF report
      const response = await axios.get(`http://localhost:5000/api/v1/student/report/${studentId}`, {
        responseType: 'blob' // Set response type to 'blob' to handle binary data
      });
  
      // Check if the request was successful
      if (response.status === 200) {
        // Create a Blob object from the PDF data
        const blob = new Blob([response.data], { type: 'application/pdf' });
  
        // Create a link element
        const link = document.createElement('a');
  
        // Set the URL of the link to the Blob URL
        link.href = window.URL.createObjectURL(blob);
  
        // Set the download attribute with the desired file name
        link.download = `Student_Report_${studentId}.pdf`;
  
        // Append the link to the document body (required for Firefox)
        document.body.appendChild(link);
  
        // Programmatically click the link to trigger the download
        link.click();
  
        // Remove the link from the document body
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

  const handleMarksSave = (data) => {
    if (selectedStudent) {
      axios
        .post("http://localhost:5000/api/v1/marks", {
          studentId: selectedStudent._id,
          ...data,
        })
        .then(() => {
          loadStudents();
          setOpenMarksModal(false);
        })
        .catch((error) => console.error("Error recording marks:", error));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-center text-2xl font-bold my-4">
        Student Management System
      </h2>

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
