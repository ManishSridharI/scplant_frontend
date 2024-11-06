import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState } from 'react';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [driveLink, setDriveLink] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 

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
    if (file) {
      console.log('Uploading file:', file);
      // Implement the actual upload logic here
    }
    if (driveLink) {
      console.log('Drive link provided:', driveLink);
      // Implement logic for handling the drive link here
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
          color={file || driveLink ? "primary" : "inherit"} // Lighter color when no file or link
          onClick={file || driveLink ? handleUpload : null} // Disable click when no file or link
          fullWidth
          sx={{
            mt:2,
            backgroundColor: file || driveLink ? '' : 'grey.300', // Lighter background when disabled
            cursor: file || driveLink ? 'pointer' : 'not-allowed', // Change cursor to 'not-allowed' if disabled
          }}
        >
          Upload
        </Button>
      </Box>
    </Box>
    </Container>
  );
}
