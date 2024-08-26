import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import MarksTable from './MarksTable';
import Grid from '@mui/material/Grid';

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

const MarksModal = ({ open, onClose, student }) => {
  const [studentDetails, setStudentDetails] = useState({});
  const [currentStudentMarks, setCurrentStudentMarks] = useState([])
  const [marks, setMarks] = useState({
    subjectName: '',
    examDate: '',
    marksObtained: '',
    maxMarks: '',
    grade: ''
  });

  useEffect(() => {
    if (student) {
      loadStudentDetails();
      loadCurrentStudentMarksDetails();
    }
  }, [student]);

  const loadStudentDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/student/${student}`);
      setStudentDetails(response.data);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  
  const loadCurrentStudentMarksDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/student/marks/${student}`)
      setCurrentStudentMarks(response.data.marks)
      console.log("Attendance Data:", response.data.attendance);
      // console.log(`All Attendce for ${currentStudentDetails.name}`, response.data)
    }
    catch (err) {
      console.log("Error Fetching student data", err);

    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMarks((prevMarks) => ({ ...prevMarks, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/v1/student/marks/${student}`, marks);
      onClose();
      alert('Marks added successfully!');
      setMarks({
        subjectName:'',
        examDate:'',
        marksObtained:'',
        maxMarks:'',
        grade:''
      })
      window.location.reload()
      // onSave();
    } catch (error) {
      console.error("Error saving marks:", error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
      <Box sx={style}>
      <Typography variant="h6" component="h2" gutterBottom>
        Add or Update Marks for {studentDetails.name || ''}
      </Typography>

      <Grid container spacing={2}>
        {/* First Row */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Subject Name"
            name="subjectName"
            value={marks.subjectName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Exam Date"
            name="examDate"
            type="date"
            value={marks.examDate}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* Second Row */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Marks Obtained"
            name="marksObtained"
            type="number"
            value={marks.marksObtained}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Max Marks"
            name="maxMarks"
            type="number"
            value={marks.maxMarks}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </Grid>

        {/* Last Row */}
        <Grid item xs={10}>
          <TextField
            label="Grade"
            name="grade"
            value={marks.grade}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </Grid>
      </Grid>

      <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
        Save Marks
      </Button>

      {/* Uncomment and ensure MarksTable is imported and defined */}
      <MarksTable marks={currentStudentMarks} />

      <Button variant="contained" onClick={onClose} sx={{ mt: 2, ml: 2 }}>
        Cancel
      </Button>
    </Box>
      </Fade>
    </Modal>
  );
};

export default MarksModal;
