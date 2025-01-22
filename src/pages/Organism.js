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
    const [geneCountNumber, setGeneCountNumber] = React.useState(20000);
  const navigate = useNavigate();

  const [selectedModel, setSelectedModel] = React.useState(null);
  const handleModelSelect = (selectedModel) => {
    setSelectedModel(selectedModel);
  };

  const handleDatasetSubmit = () => {
    let updatedGeneCount = geneCountNumber;
    if (selectedModel===2){
        updatedGeneCount =10000;
      };

  setTimeout(() => {
  
    console.log('Selected model:',selectedModel);
    console.log('Gene Count:',updatedGeneCount);
    
    navigate('/dataset', { state: { selectedModel, geneCountNumber: updatedGeneCount } });
  }, 500); // Simulate API response time
  };

  return (
    <div>
      <Models onModelSelect={handleModelSelect}/>
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
        color={(selectedModel) ? "primary" : "inherit"} // Lighter color when no file or link
          onClick={(selectedModel) ? handleDatasetSubmit : null} // Disable click when no file or link
        sx={{
          backgroundColor: (selectedModel) ? '' : 'grey.300', // Lighter background when disabled
          cursor: (selectedModel) ? 'pointer' : 'not-allowed', // Change cursor to 'not-allowed' if disabled
        }}
      >
        Proceed to Datasets
      </Button>
      </Box>

    </div>
  );
}
