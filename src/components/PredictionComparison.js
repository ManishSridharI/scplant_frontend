import * as React from 'react';
import Box from '@mui/material/Box';
import { useAuth } from '../Auth';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';
import { Grid2 } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

export default function PredictionComparison() {
  const { user, csrfToken } = useAuth();
  const [predictions, setPredictions] = React.useState([]);
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const [controlPrediction, setControlPrediction] = React.useState(null); // Track the control prediction
  const [condition1Prediction, setCondition1Prediction] = React.useState(null); // Track Condition 1 prediction
  const [condition2Prediction, setCondition2Prediction] = React.useState(null); // Track Condition 2 prediction
  const [jobName, setjobName] = React.useState('');
  const navigate = useNavigate();

  const handlejobNameChange = (event) => {
    setjobName(event.target.value);
  };

  React.useEffect(() => {
    if (user && csrfToken) {
      fetch(`http://digbio-g2pdeep.rnet.missouri.edu:8449/jobs/api/job_annotate_and_plot_query/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.JobAnnotateAndPlot) {
            const formattedPredictions = data.JobAnnotateAndPlot.filter((job) => job.job_celery_task_status === 'SUCCESS').map((job) => ({
              id: job.id,
              testName: job.job_name,
              organism: job.job_predictor,
              control: false, 
            }));
            setPredictions(formattedPredictions);
          } else {
            console.error('Error fetching predictions:', data.error);
          }
        })
        .catch((error) => {
          console.error('Error fetching predictions:', error);
        });
    } else {
      console.error('User or CSRF token not found');
    }
  }, [user, csrfToken]);

  const handleSetControl = (id) => {
    setPredictions((prevPredictions) =>
      prevPredictions.map((prediction) =>
        prediction.id === id
          ? { ...prediction, control: true } // Set the selected prediction as control
          : { ...prediction, control: false } // Set all others as not control
      )
    );
    setControlPrediction(id); // Save the control prediction ID
  };

  const handleSetCondition = (id, conditionType) => {
    if (conditionType === 'condition1') {
      setCondition1Prediction(id);
    } else if (conditionType === 'condition2') {
      setCondition2Prediction(id);
    }
  };

  const handleSubmit = async () => {
    // Check if control and condition 1 predictions are selected
    if (!controlPrediction || !condition1Prediction || !jobName) {
      alert('Please enter Job name and select both Control and Condition 1 predictions.');
      return;
    }
  
    // Prepare the payload
    const payload = {
      job_name: jobName,
      job_script: 4,
      job_control_prediction_file: controlPrediction,
      job_condition1_prediction_file: condition1Prediction,
      job_compare_cell_type_dist_stdout_filename: 'Stdout001',
      job_compare_cell_type_dist_stderr_filename: 'Stderr001',
    };
  
    // If condition 2 is selected, add it to the payload
    if (condition2Prediction) {
      payload.job_condition2_prediction_file = condition2Prediction;
    }
  
    // Send the request to the API
    try {
        // Send the request to the API
        const response = await fetch('http://digbio-g2pdeep.rnet.missouri.edu:8449/jobs/api/job_compare_cell_type_dist/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          credentials: 'include',
          body: JSON.stringify(payload),
        });
    
        if (response.ok) {
          const responseData = await response.json();
          console.log('Job Info created successfully:', responseData);
          navigate('/results'); // Navigate to the results page
        } else {
          const errorData = await response.json();
          console.error('Error creating job info:', errorData);
          alert('Error creating job info: ' + errorData.error);
        }
      } catch (error) {
        console.error('Error in API request:', error);
        alert('There was an error processing your request.');
      }
    };

  const columns = [
    {
      field: 'control',
      headerName: 'Control',
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => handleSetControl(params.row.id)}
          sx={{
            backgroundColor: params.row.id === controlPrediction ? 'black' : 'transparent',
            color: params.row.id === controlPrediction ? 'white' : 'black',
            '&:hover': {
              backgroundColor: params.row.id === controlPrediction ? 'grey' : 'transparent',
            },
          }}
        >
          {params.row.id === controlPrediction ? 'Control' : 'Set as Control'}
        </Button>
      ),
      flex: 0.5,
    },
    {
      field: 'Condition 1',
      headerName: 'Condition 1',
      renderCell: (params) => (
        <Button
          variant="outlined"
          sx={{
            backgroundColor: params.row.id === condition1Prediction ? 'black' : 'transparent',
            color: params.row.id === condition1Prediction ? 'white' : 'black',
            '&:hover': {
              backgroundColor: params.row.id === condition1Prediction ? 'grey' : 'transparent',
            },
          }}
          onClick={() => handleSetCondition(params.row.id, 'condition1')}
        >
          {params.row.id === condition1Prediction ? 'Condition 1' : 'Set as Condition 1'}
        </Button>
      ),
      flex: 0.5,
    },
    {
      field: 'Condition 2',
      headerName: 'Condition 2',
      renderCell: (params) => (
        <Button
          variant="outlined"
          sx={{
            backgroundColor: params.row.id === condition2Prediction ? 'black' : 'transparent',
            color: params.row.id === condition2Prediction ? 'white' : 'black',
            '&:hover': {
              backgroundColor: params.row.id === condition2Prediction ? 'grey' : 'transparent',
            },
          }}
          onClick={() => handleSetCondition(params.row.id, 'condition2')}
        >
          {params.row.id === condition2Prediction ? 'Condition 2' : 'Set as Condition 2'}
        </Button>
      ),
      flex: 0.5,
    },
    { field: 'testName', headerName: 'Prediction Name', flex: 1 },
    { field: 'organism', headerName: 'Organism', flex: 0.5, 
    renderCell: (params) => {
        // Map numeric value to organism name
        const organismMapping = {
          1: 'Arabidopsis',
          2: 'Zmays',
          3: 'Osativa',
          4: 'GlycineMax',
        };
  
        // Return the corresponding organism name based on the value
        return organismMapping[params.value] || 'Unknown'; // Default to 'Unknown' if value doesn't match
      } },
  ];

  return (
    <Container>
        <Typography variant="h5" component="h2" sx={{paddingBottom:'20px'}}>
        Compare Predictions
      </Typography>
      <Typography  sx={{ mb: 2, fontStyle: 'italic' }}>
        *Choose Control and Condition Predictions
      </Typography>
      <Typography  sx={{ mb: 2, fontStyle: 'italic' }}>
        *1 Control and 1 Condition are mandatory
      </Typography>
      <DataGrid
        rows={predictions}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 25]}
        pagination
        disableSelectionOnClick
        autoHeight
        sx={{
          height: 600,
          '& .MuiDataGrid-container--top [role="row"], & .MuiDataGrid-container--bottom [role="row"]': {
            background: 'lightgrey',
          },
        }}
      />

<Typography variant="h5" component="h2" gutterBottom>
        Insert Job Name
      </Typography>
      <Grid2 container spacing={2} >
      <Grid2 item xs={6} sm={6}>
          <TextField
            label="Job Name"
            variant="outlined"
            fullWidth
            value={jobName}
            onChange={handlejobNameChange}
            required
          />
       </Grid2>
       <Grid2 item xs={6} sm={6}>
      <Button  onClick={handleSubmit}
        variant="contained">
            Compare Cell Type Distributions 
        </Button>
        </Grid2>
        </Grid2>
    </Container>
  );
}
