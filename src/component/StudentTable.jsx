import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';

const StudentTable = ({ students, onAttendanceClick, onMarksClick, onDeleteClick, onUpdateClick, onDownloadClick }) => {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="student table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center" style={{ fontWeight: 'bold' }}>Profie</TableCell>
                        <TableCell align="center" style={{ fontWeight: 'bold' }}>Student Name</TableCell>
                        <TableCell align="center" style={{ fontWeight: "bold" }}>Class/Grade</TableCell>
                        <TableCell align="center" style={{ fontWeight: "bold" }}>Date of Birth</TableCell>
                        <TableCell align="center" style={{ fontWeight: "bold" }}>Gender</TableCell>
                        <TableCell align="center" style={{ fontWeight: "bold" }}>Actions</TableCell>
                        <TableCell align="center" style={{ fontWeight: "bold" }}>PDF</TableCell>
                    </TableRow>

                </TableHead>
                <TableBody>
                    {students.map((student) => (
                        <TableRow key={student._id}>
                            <TableCell align='center'>
                                <div className="mb-4">
                                    {student.profileImage && (
                                        <div className="mb-2 flex justify-center items-center">
                                            <img
                                                src={student.profileImage.url}
                                                alt="profile"
                                                className="w-10 h-10 object-cover rounded"
                                            />
                                        </div>
                                    )}

                                    {/* {console.log("All student data", student)} */}
                                </div>
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {student.name}
                            </TableCell>
                            <TableCell align="center">{student.classGrade}</TableCell>
                            <TableCell align="center">
                                {new Date(student.DOB).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                })}
                            </TableCell>

                            <TableCell align="center">{student.gender}</TableCell>
                            <TableCell align="center">
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => onAttendanceClick(student._id)}
                                    style={{ marginRight: '8px' }}
                                >
                                    Attendance
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => onMarksClick(student._id)}
                                    style={{ marginRight: '8px' }}
                                >
                                    Marks
                                </Button>
                                <Button
                                    variant="contained"
                                    color="info"
                                    onClick={() => onUpdateClick(student._id)}
                                    style={{ marginRight: '8px' }}
                                >
                                    Update
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => onDeleteClick(student._id)}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                            <TableCell align="center">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => onDownloadClick(student._id)}
                                >
                                    <DownloadIcon />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default StudentTable;
