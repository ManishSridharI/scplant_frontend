import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState } from 'react';
import { Grid2 } from '@mui/material';
import { useAuth } from '../Auth';
import { useNavigate } from 'react-router-dom';

export default function Upload() {
  const { user, csrfToken } = useAuth(); 
  const navigate = useNavigate(); 
  const [file, setFile] = useState(null);
  const [driveLink, setDriveLink] = useState('');
  const [datasetName, setDatasetName] = useState('');
  const [DescriptionFlag, setDescriptionFlag] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 

  const handleDatasetNameChange = (event) => {
    setDatasetName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    const input = event.target.value.toLowerCase().trim();
  
    // Determine if input is 'yes' or 'no', and set flag accordingly
    const descriptionFlag = input === 'yes' ? 1 : input === 'no' ? 0 : null;
  
    // If input is valid (yes or no), set description flag
    if (descriptionFlag !== null) {
      setDescriptionFlag(descriptionFlag);  // Store the flag (1 for 'yes' and 0 for 'no')
    } else {
      console.error('Invalid input. Please enter "yes" or "no".');
    }
    
    // Update the description text
    setDescription(event.target.value);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
   
    if (selectedFile && selectedFile.size > 25 * 1024 * 1024) { // File size check for >25MB
      setErrorMessage('File size exceeds 25MB. Please provide a drive link.');
      setFile(null); // Reset file input
    } else {
      setErrorMessage(''); // Clear any previous error
      setFile(selectedFile); // Set file if size is valid
      
    }
  };
 
  const handleLinkChange = (event) => {
    const value = event.target.value;
    // Check if the link starts with https
    if (value && !value.startsWith('https://')) {
      setErrorMessage('Please provide a valid HTTPS link.');
    } else {
      setErrorMessage('');
    }
    setDriveLink(value);
  };
  
  const handleUpload = () => {
    if (!user) {
      alert('Please log in to upload files.');
      navigate('/signin'); // Redirect to sign-in page
      return;
    }
    if (file && user) {
      const formData = new FormData();
      formData.append('dataset_file', file);
      formData.append('dataset_name', datasetName);
      formData.append('dataset_public_flag', DescriptionFlag);
      //formData.append('user_id', user.id);
      console.log('FormData after append:', Array.from(formData.entries())); 
      fetch('/api/datasets/api/dataset_upload/', { // Ensure the URL matches your backend's endpoint
        method: 'POST',
        headers: {
          
          'X-CSRFToken': csrfToken,  // Set CSRF token in the header
         
        },
        credentials: 'include', 
        body: formData,
        
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            setErrorMessage(data.error);
          } else {
            console.log('File uploaded successfully:');
          }
        })
        .catch((error) => {
          setErrorMessage('Error uploading file.');
          console.error(error);
        });
    }
  
    if (driveLink) {
      console.log('Drive link provided:', driveLink);
      // Add logic to handle drive link submission
    }
  };
  
  return (
    <Container
      id="pricing"
      sx={{
        pt: { xs: 2, sm: 4 },
        pb: { xs: 2, sm: 4 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
    <Box
      sx={{
        textAlign: { sm: 'left', md: 'center' },
        borderRadius: 2,
        mt: 2,
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Upload File or Provide Drive Link
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mt: 4,
          width: '100%',
          maxWidth: 500,
        }}
      >
         <Grid2 container spacing={2} sx={{ mt: 2 }}>
        <Grid2 item xs={12} sm={6}>
          <TextField
            label="Dataset Name"
            variant="outlined"
            fullWidth
            value={datasetName}
            onChange={handleDatasetNameChange}
            required
          />
        </Grid2>
        <Grid2 item xs={12} sm={6}>
          <TextField
            label="Public (Yes/No)"
            variant="outlined"
            fullWidth
            value={description}
            onChange={handleDescriptionChange}
            required
          />
        </Grid2>
      </Grid2>
        <input
          accept=".h5ad" 
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="file-upload">
          <Button variant="contained" component="span" fullWidth>
            Choose File
          </Button>
        </label>
        {file && <Typography>{file.name}</Typography>}
        <Typography variant="body2" sx={{ color: 'grey.600' }}>
          Upload only .h5ad files
        </Typography>
        {/* Display error message if file is larger than 25MB */}
        
        <Typography sx={{mt:1}} variant="h6" component="h6" gutterBottom>
       Or
      </Typography>
        <TextField
          label="Drive Link"
          variant="outlined"
          fullWidth
          value={driveLink}
          onChange={handleLinkChange}
          helperText="Provide drive link if the file is larger than 25MB"
        />

     

{errorMessage && <Typography color="error">{errorMessage}</Typography>}
        <Button
          variant="contained"
          color={(file || driveLink) && datasetName ? "primary" : "inherit"} // Lighter color when no file or link
          onClick={(file || driveLink) && datasetName ? handleUpload : null} // Disable click when no file or link
          fullWidth
          sx={{
            mt:2,
            backgroundColor: (file || driveLink) && datasetName ? '' : 'grey.300', // Lighter background when disabled
            cursor: (file || driveLink) && datasetName ? 'pointer' : 'not-allowed', // Change cursor to 'not-allowed' if disabled
          }}
        >
          Upload
        </Button>
      </Box>
    </Box>
    </Container>
  );
}
