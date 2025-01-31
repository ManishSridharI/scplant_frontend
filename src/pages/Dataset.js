import * as React from 'react';
import Data from '../components/Data';
import Upload from '../components/Upload';
import Divider from '@mui/material/Divider';
import PrivateData from '../components/PrivateDataset';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Typography } from '@mui/material';
import Models from '../components/Models';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth';

export default function Dataset(props) {
  const { user, csrfToken } = useAuth();
  const location = useLocation();
  const [selectedPublicDataset, setSelectedPublicDataset] = React.useState(null);
  const [selectedPrivateDataset, setSelectedPrivateDataset] = React.useState(null);
  const [selectedDatasetName, setSelectedDatasetName] = React.useState(null);
  const [selectedDatasetType, setSelectedDatasetType] = React.useState(null);
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);
  const { selectedModel } = location.state || {};

  const navigate = useNavigate();

  console.log('selectedModel:', selectedModel);

  const [view, setView] = React.useState(''); // State to track which view to display
  
  const handlePublicDatasets = () => {
    setView('public'); 
  };

  const handlePrivateDatasets = () => {
    setView('private'); 
  };

  const handlePublicDatasetClick = (selectedDatasets) => {
    setSelectedPublicDataset((selectedDatasets.id));
    setSelectedDatasetName(selectedDatasets.name);
    setSelectedDatasetType(selectedDatasets.type);
    console.log('Selected public dataset:', selectedDatasets);
  };

  const handlePrivateDatasetSelect = (selectedDatasets) => {
    setSelectedPrivateDataset(selectedDatasets.id);
    setSelectedDatasetName(selectedDatasets.name);
    setSelectedDatasetType(selectedDatasets.type);
    console.log('Selected private dataset:', selectedDatasets);
  };

  const handleDatasetSubmit = () => {

    let datasetIds;

  // Check if private datasets are selected
  if (selectedPrivateDataset) {
    datasetIds = selectedPrivateDataset;
  } 
  // Check if a public dataset is selected
  else if (selectedPublicDataset) {
    datasetIds = selectedPublicDataset; 
  } else {
    console.warn('No datasets selected to submit');
    alert('Please select a dataset before submitting.');
    return;
  }

  console.log('Submitting dataset IDs:', datasetIds);

  setTimeout(async () => {
    console.log('Clearing selected datasets...');
    
    // Clear the selected datasets
    setSelectedPrivateDataset(null);
    setSelectedPublicDataset(null);
    await handlePrediction(datasetIds);
    
  }, 500); // Simulate API response time
  
  const handlePrediction = async (datasetIds) => {
    if (!user) {
      alert('Please login first to proceed.');
      navigate('/signin');
    } else {

      if (!datasetIds || !selectedModel) {
        alert('Please select a dataset to proceed.');
        navigate('/dataset');
        return;
      }

      const datasetId = datasetIds;

      let url = '/api/jobs/api/job_annotate_and_plot/';
      let requestData = {
        job_predictor: selectedModel,
        job_name: selectedDatasetName + "_annotate&plot",
        job_script: 2,
        job_annotate_and_plot_stdout_filename: "Stdout001",
        job_annotate_and_plot_stderr_filename: "Stderr001",
      };

      if (selectedDatasetType === 'h5ad') {
        requestData.job_h5ad_dataset = datasetId;
      } else if (selectedDatasetType === '10x') {
        requestData.job_tenxfbcm_dataset = datasetId;
      }


    console.log(requestData);

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          credentials: 'include', 
          body: JSON.stringify(requestData),
        });
  
        if (response.ok) {
          const responseData = await response.json();
          console.log('Job Info created successfully:', responseData);
          navigate('/results');
        } else {
          const errorData = await response.json();
          console.error('Error creating job info:', errorData);
          alert('Error creating job info: ' + errorData.error);
        }
      } catch (error) {
        console.error('Error in API request:', error);
        alert('There was an error processing your request.');
      }
    }
  };
};

  

  return (
    <div>
       <Box
       id="pricing"
          sx={{
            
            display: 'flex',
            flexDirection: 'row',
            gap: 2, 
          }}
        >
           <Container
        id="pricing"
        sx={{
          pt: { xs: 8, sm: 16 },
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
            width: { sm: '100%', md: '60%' },
            textAlign: { sm: 'left', md: 'center' },
          }}
        >
          <Typography component="h2" variant="h4" gutterBottom>
            Datasets
          </Typography>
          <Typography variant="h6" sx={{ color: 'grey.400' }}>
            Upload your own/ use our datasets
          </Typography>
          </Box>
          <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2, // Adjust the gap value for spacing between buttons
          }}
        >
          <Button onClick={handlePublicDatasets} variant="contained">
            Choose our Demo Data
          </Button>
          <Button onClick={handlePrivateDatasets} variant="contained">
            Upload/ Use your own data
          </Button>
          </Box>
          </Container>
        </Box>
      
      <Box sx={{ height: '100%', width: '100%', p: 3 }}>
      {view === 'public' && <Data onDatasetClick={handlePublicDatasetClick} />}
      {view === 'private' && (
          <>
            <Upload selectedModel={selectedModel} onDatasetUploadRefresh={() => setRefreshTrigger(prev => prev + 1)}/>
            <PrivateData selectedModel={selectedModel} onDatasetSelect={handlePrivateDatasetSelect} refreshTrigger={refreshTrigger} />
          </>
        )}
        </Box>
      <Box
      sx={{
        display: 'flex',
        justifyContent: 'center', // Align horizontally to center
        alignItems: 'center',    // Align vertically if needed
        mt: 2,
        mb: 2,
      }}
    >
      <Button
       // onClick={handleDatasetSubmit}
        variant="contained"
        color={((selectedPublicDataset || selectedPrivateDataset) && selectedModel) ? "primary" : "inherit"} // Lighter color when no file or link
          onClick={((selectedPublicDataset || selectedPrivateDataset) && selectedModel) ? handleDatasetSubmit : null} // Disable click when no file or link
        sx={{
          backgroundColor: ((selectedPublicDataset || selectedPrivateDataset) && selectedModel) ? '' : 'grey.300', // Lighter background when disabled
          cursor: ((selectedPublicDataset || selectedPrivateDataset) && selectedModel) ? 'pointer' : 'not-allowed', // Change cursor to 'not-allowed' if disabled
        }}
      >
        Proceed to Prediction
      </Button>
      
    </Box>
    </div>
  );
}
