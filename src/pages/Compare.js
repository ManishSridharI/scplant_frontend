import * as React from 'react';
import Box from '@mui/material/Box';
import { useAuth } from '../Auth';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import DatasetComparison from '../components/DatasetComparison';
import PredictionComparison from '../components/PredictionComparison';

export default function Compare(props) {
  const { user, csrfToken } = useAuth();
  const [view, setView] = React.useState(''); // State to track which view to display
  

  const handleCompareDatasets = () => {
    setView('datasets'); // Show the datasets container
  };

  const handleComparePredictions = () => {
    setView('predictions'); // Show the predictions container
  };

  return (
      <div>
        <Container
      id="pricing"
      sx={{
        pt: { xs: 8, sm: 16 },
        pb: { xs: 8, sm: 16 },
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
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{ color: 'text.primary' }}
        >
          Compare
        </Typography>
        <Typography variant="h7" sx={{ color: 'text.secondary' }}>
          Compare Datasets across different condition.<br />
        </Typography>
        <Typography variant="h7" sx={{ color: 'text.secondary' }}>
        Compare cell type distributions in different predictions.<br />
        </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2, // Adjust the gap value for spacing between buttons
          }}
        >
          <Button onClick={handleCompareDatasets} variant="contained">
            Compare Datasets
          </Button>
          <Button onClick={handleComparePredictions} variant="contained">
            Compare Predictions
          </Button>
        </Box>
      
      <Box sx={{ height: '100%', width: '100%', p: 3 }}>
      {view === 'datasets' && <DatasetComparison />}
      {view === 'predictions' && <PredictionComparison />}
        </Box>
    </Container>
      </div>
  );
}