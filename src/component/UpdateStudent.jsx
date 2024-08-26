import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import { Input } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',       // Adjust width as needed
  height: '80%',      // Adjust height as needed
  maxHeight: '80vh',  // Ensures modal does not exceed viewport height
  overflowY: 'auto',  // Adds vertical scroll if content overflows
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const UpdateStudent = ({ open, onClose, student }) => {
  const [name, setName] = useState('');
  const [DOB, setDOB] = useState('');
  const [gender, setGender] = useState('');
  const [classGrade, setClassGrade] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);


  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImagesPreview([]);
    setImages([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {

          const base64Image = reader.result; 

          const approximateSize = base64Image.length * (3 / 4); 

          setImagesPreview((prev) => [...prev, reader.result]);
          setImages((prev) => [...prev, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = ''
  };

  const handleDeleteImage = (index) => {
    setImagesPreview((oldImages) => oldImages.filter((_, i) => i !== index));
    setImages((oldImages) => oldImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('DOB', DOB);
    formData.append('gender', gender);
    formData.append('classGrade', classGrade);
    formData.append('contactInfo[phone]', phone);
    formData.append('contactInfo[email]', email);
    formData.append('contactInfo[address][street]', street);
    formData.append('contactInfo[address][city]', city);
    formData.append('contactInfo[address][state]', state);
    formData.append('contactInfo[address][postalCode]', postalCode);
    formData.append('contactInfo[address][country]', country);


    images.forEach((image) => {
        formData.append('images', image);
    });

    try {
      const response = await axios.put(`http://localhost:5000/api/v1/student/${student}`, formData, {
        headers: {"Content-Type": "application/json"},
      });
      console.log('Student added:', response.data);
      window.location.reload();
      onClose();
  } catch (error) {
      console.error('Error adding student:', error);
  }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box  sx={style}>
        <IconButton 
          onClick={onClose} 
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CancelIcon />
        </IconButton>
        <Typography variant="h6" gutterBottom>
          Update Student
        </Typography>


        <input
                className="block w-full mb-4 p-2 border rounded"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                className="block w-full mb-4 p-2 border rounded"
                type="date"
                placeholder="Date of Birth"
                value={DOB}
                onChange={(e) => setDOB(e.target.value)}
            />
            <input
                className="block w-full mb-4 p-2 border rounded"
                placeholder="Gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
            />
            <input
                className="block w-full mb-4 p-2 border rounded"
                placeholder="Class Grade"
                value={classGrade}
                onChange={(e) => setClassGrade(e.target.value)}
            />
            <input
                className="block w-full mb-4 p-2 border rounded"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <input
                className="block w-full mb-4 p-2 border rounded"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="block w-full mb-4 p-2 border rounded"
                placeholder="Street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
            />
            <input
                className="block w-full mb-4 p-2 border rounded"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
            />
            <input
                className="block w-full mb-4 p-2 border rounded"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
            />
            <input
                className="block w-full mb-4 p-2 border rounded"
                placeholder="Postal Code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
            />
            <input
                className="block w-full mb-4 p-2 border rounded"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
            />
             <div className="mb-4 mt-4">
            <Input
              type="file"
              onChange={handleFileChange}
              inputProps={{ accept: 'image/*' }}
              name="images"
              style={{ display: 'none' }}
              id="file-input"
            />
            <label htmlFor="file-input">
              <Button
                variant="contained"
                color="success"
                component="span"
                startIcon={<CloudUploadIcon />}
                className="bg-green-500 text-white"
              >
                Upload
              </Button>
            </label>

            {imagesPreview.map((image, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <img
                  src={image}
                  alt={`Avatar ${index}`}
                  style={{ maxWidth: '100px', maxHeight: '100px', margin: '5px' }}
                />
                <Button
                  variant="contained"
                  color="error"
                  style={{ marginLeft: '10px' }}
                  onClick={() => handleDeleteImage(index)}
                  startIcon={<DeleteRoundedIcon />}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
                Update Student
            </Button>
          <Button variant="outlined" color="secondary" onClick={onClose} sx={{ ml: 2 }}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateStudent;
