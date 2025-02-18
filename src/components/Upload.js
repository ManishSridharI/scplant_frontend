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
import { FormControlLabel, Switch } from '@mui/material';
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

export default function Upload({ selectedModel, onDatasetUploadRefresh }) {
  const { user, csrfToken } = useAuth(); 
  const navigate = useNavigate(); 
  const [file, setFile] = useState(null);
  const [datasetName, setDatasetName] = useState('');
  const [DescriptionFlag, setDescriptionFlag] = useState(0);
  const [errorMessage, setErrorMessage] = useState(''); 
  const [fileExtension, setfileExtension] =useState('');
  const [fileType, setFileType] = useState("h5ad");
  const [files, setFiles] = useState([]);

  const handleDatasetNameChange = (event) => {
    setDatasetName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    const isPublic = event.target.checked;
    setDescriptionFlag(isPublic ? 1 : 0); // Store flag as 1 for 'yes' and 0 for 'no'
  };

  const handleFileTypeChange = (event) => {
    setFileType(event.target.value);
    setFiles([]); // Reset files when type changes
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (fileType === "h5ad") {
      if (selectedFiles.length > 1 || !selectedFiles[0].name.match(/\.(h5ad)$/)) {
        alert("Please upload a single .h5ad file");
        return;
      }
    } 
    else if (fileType === "rds") {
      if (selectedFiles.length > 1 || !selectedFiles[0].name.match(/\.(rds)$/)) {
        alert("Please upload a single .rds file");
        return;
      }
    }
    else if (fileType === "10x") {
      if (selectedFiles.length !== 3 ||
          !selectedFiles.some(f => f.name.includes("barcodes")) ||
          !selectedFiles.some(f => f.name.includes("features")) ||
          !selectedFiles.some(f => f.name.includes("matrix")) ||
          !selectedFiles.every(f => f.name.endsWith(".gz"))) {
        alert("Please upload exactly 3 .gz files containing 'barcodes', 'features', and 'matrix' in their names");
        return;
      }
    }
    setFiles(selectedFiles);
  };

  // const handleFileChange = (event) => {
  //   const selectedFile = event.target.files[0];

  //   if (selectedFile) {
  //     const fileName = selectedFile.name;
  //     const fileExt = fileName.split('.').pop(); // Extract file extension
  //     setfileExtension(fileExt)
  //     console.log('File Extension:', fileExt);
  //     onDatasetUpload(fileExt);
  //   }
  //     setErrorMessage(''); // Clear any previous error
  //     setFile(selectedFile); // Set file if size is valid
  
  //   // if (selectedFile && selectedFile.size > 25 * 1024 * 1024) { // File size check for >25MB
  //   //   setErrorMessage('File size exceeds 25MB. Please provide a drive link.');
  //   //   setFile(null); // Reset file input
  //   // } else {
  //   //   setErrorMessage(''); // Clear any previous error
  //   //   setFile(selectedFile); // Set file if size is valid
      
  //   // }
  // };
  // console.log(fileExtension);
 
  
  const handleUpload = () => {
    if (!user) {
      alert('Please log in to upload files.');
      navigate('/signin'); // Redirect to sign-in page
      return;
    }
    if (files.length > 0 && user) {
      const formData = new FormData();
      if (fileType === "h5ad") {
        formData.append("h5ad_dataset_file", files[0]);
        formData.append("h5ad_dataset_name", datasetName);
        formData.append("h5ad_dataset_file_extension", "h5ad");
        formData.append("h5ad_dataset_organism", selectedModel);
        formData.append("h5ad_dataset_public_flag", DescriptionFlag);
      } else if (fileType === "rds") {
        formData.append("rds_dataset_file", files[0]);
        formData.append("rds_dataset_name", datasetName);
        formData.append("rds_dataset_file_extension", "rds");
        formData.append("rds_dataset_organism", selectedModel);
        formData.append("rds_dataset_public_flag", DescriptionFlag);
      } else if (fileType === "10x") {
        formData.append("tenxfbcm_barcode_dataset_file", files.find(f => f.name.includes("barcode")));
        formData.append("tenxfbcm_feature_dataset_file", files.find(f => f.name.includes("feature")));
        formData.append("tenxfbcm_matrix_dataset_file", files.find(f => f.name.includes("matrix")));
        formData.append("tenxfbcm_dataset_name", datasetName);
        formData.append("tenxfbcm_barcode_dataset_file_extension", "gz");
        formData.append("tenxfbcm_feature_dataset_file_extension", "gz");
        formData.append("tenxfbcm_matrix_dataset_file_extension", "gz");
        formData.append("tenxfbcm_dataset_organism", selectedModel);
        formData.append("tenxfbcm_dataset_public_flag", DescriptionFlag);
      }
      //formData.append('user_id', user.id);
      console.log('FormData after append:', Array.from(formData.entries())); 
      fetch(fileType === "h5ad" ? '/api/h5addatasets/api/h5ad_dataset_upload/' : fileType === "rds" ? "/api/rdsdatasets/api/rds_dataset_upload/" : "/api/tenxfeaturebcmatrixdatasets/api/tenxfbcm_dataset_upload/", { // Ensure the URL matches your backend's endpoint
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
            onDatasetUploadRefresh();
            if (fileType === "rds" && data.RdsDatasetUpload) {
              triggerRdsToH5adConversion(data.RdsDatasetUpload.id);
            }
          }
        })
        .catch((error) => {
          setErrorMessage('Error uploading file.');
          console.error(error);
        });
    }
  };

  const triggerRdsToH5adConversion = (rdsDatasetId) => {
    const conversionPayload = {
      "job_name": `Convert_RDS_${rdsDatasetId}`,
      "job_script": 5,
      "job_rds_dataset": rdsDatasetId,
      "job_convert_rds_to_h5ad_stdout_filename": "Stdout001",
      "job_convert_rds_to_h5ad_stderr_filename": "Stderr001"
    };
  
    fetch("/api/jobs/api/job_convert_rds_to_h5ad/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken, // Set CSRF token in the header
      },
      credentials: "include",
      body: JSON.stringify(conversionPayload),
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        console.error("RDS to H5AD conversion failed:", data.error);
        setErrorMessage("RDS to H5AD conversion failed.");
      } else {
        console.log("RDS to H5AD conversion initiated successfully:", data);
        // deleteRdsDataset(rdsDatasetId);
      }
    })
    .catch(error => {
      console.error("Error triggering RDS to H5AD conversion:", error);
      setErrorMessage("Error triggering RDS to H5AD conversion.");
    });
  };

    // Function to delete the RDS dataset after successful conversion
const deleteRdsDataset = (rdsDatasetId) => {
  const deletePayload = {
    "rds_dataset_id": rdsDatasetId
  };

  fetch("/api/rdsdatasets/api/rds_dataset_delete/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken, // Set CSRF token in the header
    },
    credentials: "include",
    body: JSON.stringify(deletePayload),
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      console.error("Error deleting RDS dataset:", data.error);
      setErrorMessage("Error deleting RDS dataset.");
    } else {
      console.log("RDS dataset deleted successfully:", data);
    }
  })
  .catch(error => {
    console.error("Error in RDS dataset deletion:", error);
    setErrorMessage("Error in RDS dataset deletion.");
  });
};

    // Check for pending deletions on page load
    const checkPendingDeletions = () => {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith("delete_rds_")) {
          const { id, timestamp } = JSON.parse(localStorage.getItem(key));
          const elapsed = Date.now() - timestamp;

          if (elapsed >= 180000) { // If 3 minutes have passed
            deleteRdsDataset(id);
          } else {
            // Schedule deletion for the remaining time
            setTimeout(() => deleteRdsDataset(id), 180000 - elapsed);
          }
        }
      });
    };

    // Run the check when the page loads
    window.addEventListener("load", checkPendingDeletions);
  
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
       // mt: 2,
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Upload File 
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
        <Typography variant="body"  sx={{fontSize: '0.9rem'}}>
        Click here to download <a href="/corn_test.h5ad" download style={{ textDecoration: 'none', color: 'blue' }}> Example </a> file 
      </Typography>
          </Grid2>
        <Grid2 item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>File Type</InputLabel>
          <Select value={fileType} onChange={handleFileTypeChange}>
            <MenuItem value="h5ad">h5ad</MenuItem>
            <MenuItem value="rds">rds</MenuItem>
            <MenuItem value="10x">10x</MenuItem>
          </Select>
        </FormControl>
      </Grid2>
        <Grid2 item xs={12} sm={6}>
        <FormControlLabel
          control={
            <Switch
              checked={DescriptionFlag === 1} // Set checked state based on flag
              onChange={handleDescriptionChange}
              color="primary"
            />
          }
          label="Do you want to make your dataset public?"
        />
        </Grid2>
      </Grid2>
        <input
          accept={fileType === "10x" ? ".gz" : ".h5ad, .rds"}
          id="file-upload"
          type="file"
          multiple={fileType === "10x"}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="file-upload">
          <Button variant="contained" component="span" fullWidth>
            Choose File
          </Button>
        </label>
        {files.length > 0 && files.map((file, index) => (
          <Typography key={index}>{file.name}</Typography>
        ))}
        <Typography variant="body2" sx={{ color: 'grey.600' }}>
          We support .h5ad, .rds and 10x files
        </Typography>
        <Typography variant="body2" sx={{ color: 'grey.600', fontStyle: 'italic' }}>
          *Please upload the files similar to the example dataset to run your preidctions successfully
        </Typography>
          

{errorMessage && <Typography color="error">{errorMessage}</Typography>}
        <Button
          variant="contained"
          color={(files.length > 0)  && datasetName  ? "primary" : "inherit"} // Lighter color when no file or link
          onClick={(files.length > 0)  && datasetName ? handleUpload : null} // Disable click when no file or link
          fullWidth
          sx={{
            mt:2,
            backgroundColor: (files.length > 0)  && datasetName  ? '' : 'grey.300', // Lighter background when disabled
            cursor: (files.length > 0) && datasetName ? 'pointer' : 'not-allowed', // Change cursor to 'not-allowed' if disabled
          }}
        >
          Upload
        </Button>
      </Box>
    </Box>
    </Container>
  );
}
