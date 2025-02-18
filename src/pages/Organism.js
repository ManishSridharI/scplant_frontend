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

export default function Organism(props) {
  
  const navigate = useNavigate();

  const [selectedModel, setSelectedModel] = React.useState(null);
  const handleModelSelect = (selectedModel) => {
    setSelectedModel(selectedModel);
  };

  const handleDatasetSubmit = () => {
  setTimeout(() => {
  
    console.log('Selected model:',selectedModel);
    
    navigate('/dataset', { state: { selectedModel } });
  }, 500); // Simulate API response time
  };

  const handleOrgSubmitCompare = () => {
    setTimeout(() => {
    
      console.log('Selected model:',selectedModel);
      
      navigate('/compare', { state: { selectedModel } });
    }, 500); // Simulate API response time
    };

  return (
    <div>
      <Models onModelSelect={handleModelSelect}/>
      <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center', // Align horizontally to center
        alignItems: 'center',    // Align vertically if needed
        mt: 2,
        mb: 2,
        gap:2,
      }}
    >
       <Typography variant="body2">Proceed to select - </Typography>
      <Button
       // onClick={handleDatasetSubmit}
        variant="contained"
        color={(selectedModel) ? "primary" : "inherit"} // Lighter color when no file or link
          onClick={(selectedModel) ? handleDatasetSubmit : null} // Disable click when no file or link
        sx={{
          backgroundColor: (selectedModel) ? '' : 'grey.300', // Lighter background when disabled
          cursor: (selectedModel) ? 'pointer' : 'not-allowed', // Change cursor to 'not-allowed' if disabled
        }}
      >
        Datasets for Predictions
      </Button>
      <Button
        variant="contained"
        color={(selectedModel) ? "primary" : "inherit"} // Lighter color when no file or link
          onClick={(selectedModel) ? handleOrgSubmitCompare : null} // Disable click when no file or link
        sx={{
          backgroundColor: (selectedModel) ? '' : 'grey.300', // Lighter background when disabled
          cursor: (selectedModel) ? 'pointer' : 'not-allowed', // Change cursor to 'not-allowed' if disabled
        }}
      >
        Predictions for comparisons
      </Button>
      </Box>

    </div>
  );
}
