import * as React from 'react';
import Models from '../components/Models';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useAuth } from '../Auth';

export default function Model(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { datasetIds } = location.state || {};
  // console.log(datasetIds,'modelpage');

  const [selectedModel, setSelectedModel] = React.useState(null);
  const handleModelSelect = (selectedModel) => {
    setSelectedModel(selectedModel);
    // console.log(`Selected model: ${selectedModel}`);
    // Add any additional logic for handling the selected model
  };

  const { user } = useAuth();

  // const job_info = [
  //   { key: 'dataset_info_id', value: datasetIds },
  //   { key: 'model_id', value: selectedModel },
  //   { key: 'user_id', value: user ? user.id : null },
  // ];

  const handlePrediction = async () => {
    if (!user) {
      alert('Please login first to proceed.');
      navigate('/signin');
    } else {
      const job_info = [
        { key: 'dataset_info_id', value: datasetIds },
        { key: 'model_id', value: selectedModel },
        { key: 'user_id', value: user ? user.id : null },
      ];
  
      // Preparing the data for API request
      const data = {
        dataset_info_id: job_info.find(item => item.key === 'dataset_info_id').value,
        model_id: job_info.find(item => item.key === 'model_id').value,
        user_id: job_info.find(item => item.key === 'user_id').value,
      };
      console.log(data);
      try {
        const response = await fetch('http://digbio-g2pdeep.rnet.missouri.edu:8449/jobs/job_info/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        if (response.ok) {
          const responseData = await response.json();
          console.log('Job Info created successfully:', responseData);
          // Navigate to /results after successful job creation
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

  return (
      <div>
        <Models onModelSelect={handleModelSelect}/>
        <Box
      sx={{
        display: 'flex',
        justifyContent: 'center', // Align horizontally to center
        alignItems: 'center',    // Align vertically if needed
        mb: 2,
      }}
    >
        <Button
        onClick={handlePrediction}
        variant="contained"
      >
        Proceed to Prediction
      </Button>
      </Box>
      </div>
  );
}