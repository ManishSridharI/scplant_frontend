import * as React from 'react';
import Data from '../components/Data';
import Upload from '../components/Upload';
import Divider from '@mui/material/Divider';
import PrivateData from '../components/PrivateDataset';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

export default function Dataset(props) {
  const [selectedPublicDataset, setSelectedPublicDataset] = React.useState(null);
  const [selectedPrivateDataset, setSelectedPrivateDataset] = React.useState(null);
  const navigate = useNavigate();

  const handlePublicDatasetClick = (dataset) => {
    setSelectedPublicDataset(dataset);
    console.log('Selected public dataset:', dataset);
  };

  const handlePrivateDatasetSelect = (selectedDatasets) => {
    setSelectedPrivateDataset(selectedDatasets);
    console.log('Selected private dataset:', selectedDatasets);
  };

  const handleDatasetSubmit = () => {
    // const dataToSubmit = selectedPrivateDataset || selectedPublicDataset;

    // if (dataToSubmit) {
    //   console.log('Submitting dataset:', dataToSubmit);

    // } else {
    //   console.warn('No dataset selected to submit');
    // }

    let datasetIds;

  // Check if private datasets are selected
  if (selectedPrivateDataset && selectedPrivateDataset.length > 0) {
    datasetIds = selectedPrivateDataset;
  } 
  // Check if a public dataset is selected
  else if (selectedPublicDataset) {
    datasetIds = [selectedPublicDataset]; // Normalize to an array for consistency
  } else {
    console.warn('No datasets selected to submit');
    alert('Please select a dataset before submitting.');
    return;
  }

  console.log('Submitting dataset IDs:', datasetIds);

  setTimeout(() => {
    alert('Datasets submitted successfully!');
    console.log('Clearing selected datasets...');
    
    // Clear the selected datasets
    setSelectedPrivateDataset(null);
    setSelectedPublicDataset(null);
    navigate('/model', { state: { datasetIds } });
  }, 500); // Simulate API response time
  };

  return (
    <div>
      <Data onDatasetClick={handlePublicDatasetClick} />
      <Divider />
      <Upload />
      <Divider />
      <PrivateData onDatasetSelect={handlePrivateDatasetSelect} />
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
        onClick={handleDatasetSubmit}
        variant="contained"
      >
        Proceed to Choose Model
      </Button>
    </Box>
    </div>
  );
}
