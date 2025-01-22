import * as React from 'react';
import Data from '../components/Data';
import Upload from '../components/Upload';
import Divider from '@mui/material/Divider';
import PrivateData from '../components/PrivateDataset';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import { Typography } from '@mui/material';
import Models from '../components/Models';

export default function Dataset(props) {
  const [selectedPublicDataset, setSelectedPublicDataset] = React.useState(null);
  const [selectedPrivateDataset, setSelectedPrivateDataset] = React.useState(null);
  const [selectedDatasetName, setSelectedDatasetName] = React.useState(null);
  const [geneCountNumber, setgeneCountNumber] = React.useState(null);
  const [fileExtension, setfileExtension] = React.useState(null);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const navigate = useNavigate();

  const [selectedModel, setSelectedModel] = React.useState(null);
  const handleModelSelect = (selectedModel) => {
    setSelectedModel(selectedModel);
  };

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
    setgeneCountNumber(selectedDatasets.geneCountNumber);
    console.log('Selected public dataset:', selectedDatasets);
  };

  const handlePrivateDatasetSelect = (selectedDatasets) => {
    setSelectedPrivateDataset(selectedDatasets.id);
    setSelectedDatasetName(selectedDatasets.name);
    setgeneCountNumber(selectedDatasets.geneCountNumber);
    console.log('Selected private dataset:', selectedDatasets);
  };

  const handleFileUploadExtension = (fileExt) => {
    setfileExtension(fileExt);
    console.log('fileExtension:', fileExt);
  };
  console.log('fileExtensionfileExtension:', fileExtension);
  const handleDatasetSubmit = () => {
    // const dataToSubmit = selectedPrivateDataset || selectedPublicDataset;

    // if (dataToSubmit) {
    //   console.log('Submitting dataset:', dataToSubmit);

    // } else {
    //   console.warn('No dataset selected to submit');
    // }

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

  setTimeout(() => {
    //alert('Datasets submitted successfully!');
    console.log('Clearing selected datasets...');
    
    // Clear the selected datasets
    setSelectedPrivateDataset(null);
    setSelectedPublicDataset(null);
    navigate('/model', { state: { datasetIds, selectedModel, selectedDatasetName, geneCountNumber, fileExtension } });
  }, 500); // Simulate API response time
  };

  return (
    <div>
      <Models onModelSelect={handleModelSelect}/>
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
            <Upload onDatasetUpload={handleFileUploadExtension}/>
            <PrivateData onDatasetSelect={handlePrivateDatasetSelect}/>
          </>
        )}
        </Box>
      {/* <Data onDatasetClick={handlePublicDatasetClick} />
      <Divider />
      <Upload />
      <Divider />
      <PrivateData onDatasetSelect={handlePrivateDatasetSelect} /> */}
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
        Proceed to Choose Model
      </Button>
      
    </Box>
    </div>
  );
}
