import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import AttendanceTable from './AttendanceTable';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const AttendanceModal = ({ open, onClose, student }) => {
  const [currentStudentDetails, setCurrentStudentDetails] = useState([])
  const [attendanceStatus, setAttendanceStatus] = useState('');
  const [attendanceReason, setAttendanceReason] = useState('');
  const [currentStudentAttendance, setCurrentStudentAttendance] = useState([]);
  const [currentDate, setCurrentDate] = useState('')
  const [currentStudentAttandacne, setCurrentStudentAttendace] = useState([])


  useEffect(() => {
    loadCurrentStudentDeatils()
  }, [student])

  useEffect(() => {
    loadCurrentStudentAttendanceDetails();
  }, [student])

  const loadCurrentStudentDeatils = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/student/${student}`);
      setCurrentStudentDetails(response.data);
    } catch (error) {
      console.log("Error Fetching student data", error);
    }
  };

  const loadCurrentStudentAttendanceDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/student/attendance/${student}`)
      setCurrentStudentAttendace(response.data.attendance)
      console.log("Attendance Data:", response.data.attendance);
      // console.log(`All Attendce for ${currentStudentDetails.name}`, response.data)
    }
    catch (err) {
      console.log("Error Fetching student data", err);

    }
  }

  const handleMarkAttendance = async () => {
    // Check if required fields are filled
    if (!currentDate || !attendanceStatus) {
      alert('Please fill out all required fields.');
      return;
    }
    if(!student)
    {
      alert("student missing")
      return
    }
  
    // Create a new FormData object
    const formData = new FormData();
    formData.append('date', currentDate);
    formData.append('status', attendanceStatus);
    formData.append('reason', attendanceReason || '');
  
    try {
      // Use PATCH if you're updating an existing record
      const response = await axios.put(`http://localhost:5000/api/v1/student/attendance/${student}`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // console.log("Saved to the database", response.data);

  
      // Close the modal and show success message
      onClose();
      alert('Attendance record created successfully!');
      window.location.reload()
  
      // Clear the form fields
      setCurrentDate('');
      setAttendanceStatus('');
      setAttendanceReason('');
    } catch (err) {
      // Improved error handling
      console.error("Error creating attendance", err.response ? err.response.data : err.message);
      alert('Failed to create attendance record. Please try again.');
    }
  };
  

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <h1 className="text-xl font-bold">
            Attendance Details of <span className="text-blue-600">{currentStudentDetails.name}</span>
          </h1>

          {/* <input
            className="block w-full mb-4 p-2 border rounded"
            type="date"
            placeholder="Date of Birth"
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
          /> */}
           <input
                className="block w-full mb-4 p-2 border rounded"
                type="date"
                placeholder="Date of Birth"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
            />

          <TextField
            select
            fullWidth
            label="Attendance Status"
            variant="outlined"
            className='mb-2'
            value={attendanceStatus}
            onChange={(e) => setAttendanceStatus(e.target.value)}
          >
            <MenuItem value="Present">Present</MenuItem>
            <MenuItem value="Absent">Absent</MenuItem>
          </TextField>
          {attendanceStatus === "Absent" && (
            <TextField
              fullWidth
              label="Reason"
              variant="outlined"
              className="mb-2"
              value={attendanceReason}
              onChange={(e) => setAttendanceReason(e.target.value)}
              multiline
              rows={2}
            />
          )}
          <Button variant="contained" color="primary" onClick={handleMarkAttendance}>
            Mark Attendance
          </Button>


          <AttendanceTable attendance={currentStudentAttandacne} />

          <Button variant="contained" onClick={onClose} style={{ marginTop: '20px' }}>
            Close
          </Button>
        </Box>
      </Fade>
    </Modal>

  )
}

export default AttendanceModal