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

export default function DatasetComparison() {
  const { user, csrfToken } = useAuth();
  const [datasets, setDatasets] = React.useState([]);
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const [controlDataset, setControlDataset] = React.useState(null); // Track the control dataset
  const [condition1Dataset, setCondition1Dataset] = React.useState(null); // Track Condition 1 dataset
  const [condition2Dataset, setCondition2Dataset] = React.useState(null); // Track Condition 2 dataset
  const [jobName, setjobName] = React.useState('');
  const navigate = useNavigate();

  const handlejobNameChange = (event) => {
    setjobName(event.target.value);
  };

  React.useEffect(() => {
    if (user && csrfToken) {
      fetch(`http://digbio-g2pdeep.rnet.missouri.edu:8449/datasets/api/dataset_query_public/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.isDatasetQueryPublic) {
            const formattedDatasets = data.Dataset.map((dataset) => ({
              id: dataset.id,
              dataset_name: dataset.dataset_name,
              dataset_file: dataset.dataset_file,
              dataset_public_flag: dataset.dataset_public_flag ? 'Yes' : 'No',
              dataset_creation_timestamp: new Date(dataset.dataset_creation_timestamp).toLocaleString(),
              control: false, // Add control field to mark as control
            }));
            setDatasets(formattedDatasets);
          } else {
            console.error('Error fetching datasets:', data.error);
          }
        })
        .catch((error) => {
          console.error('Error fetching datasets:', error);
        });
    } else {
      console.error('User or CSRF token not found');
    }
  }, [user, csrfToken]);

  const handleSetControl = (id) => {
    setDatasets((prevDatasets) =>
      prevDatasets.map((dataset) =>
        dataset.id === id
          ? { ...dataset, control: true } // Set the selected dataset as control
          : { ...dataset, control: false } // Set all others as not control
      )
    );
    setControlDataset(id); // Save the control dataset ID
  };

  const handleSetCondition = (id, conditionType) => {
    if (conditionType === 'condition1') {
      setCondition1Dataset(id);
    } else if (conditionType === 'condition2') {
      setCondition2Dataset(id);
    }
  };

  const handleSubmit = async () => {
    // Check if control and condition 1 datasets are selected
    if (!controlDataset || !condition1Dataset || !jobName) {
      alert('Please enter Job name and select both Control and Condition 1 datasets.');
      return;
    }
  
    // Prepare the payload
    const payload = {
      job_name: jobName,
      job_script: 3,
      job_control_dataset: controlDataset,
      job_condition1_dataset: condition1Dataset,
      job_treatment_vs_control_stdout_filename: 'Stdout001',
      job_treatment_vs_control_stderr_filename: 'Stderr001',
    };
  
    // If condition 2 is selected, add it to the payload
    if (condition2Dataset) {
      payload.job_condition2_dataset = condition2Dataset;
    }
  
    // Send the request to the API
    try {
        // Send the request to the API
        const response = await fetch('http://digbio-g2pdeep.rnet.missouri.edu:8449/jobs/api/job_treatment_vs_control/', {
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
            backgroundColor: params.row.id === controlDataset ? 'black' : 'transparent',
            color: params.row.id === controlDataset ? 'white' : 'black',
            '&:hover': {
              backgroundColor: params.row.id === controlDataset ? 'grey' : 'transparent',
            },
          }}
        >
          {params.row.id === controlDataset ? 'Control' : 'Set as Control'}
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
            backgroundColor: params.row.id === condition1Dataset ? 'black' : 'transparent',
            color: params.row.id === condition1Dataset ? 'white' : 'black',
            '&:hover': {
              backgroundColor: params.row.id === condition1Dataset ? 'grey' : 'transparent',
            },
          }}
          onClick={() => handleSetCondition(params.row.id, 'condition1')}
        >
          {params.row.id === condition1Dataset ? 'Condition 1' : 'Set as Condition 1'}
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
            backgroundColor: params.row.id === condition2Dataset ? 'black' : 'transparent',
            color: params.row.id === condition2Dataset ? 'white' : 'black',
            '&:hover': {
              backgroundColor: params.row.id === condition2Dataset ? 'grey' : 'transparent',
            },
          }}
          onClick={() => handleSetCondition(params.row.id, 'condition2')}
        >
          {params.row.id === condition2Dataset ? 'Condition 2' : 'Set as Condition 2'}
        </Button>
      ),
      flex: 0.5,
    },
    { field: 'dataset_name', headerName: 'Dataset Name', flex: 1 },
    { field: 'dataset_public_flag', headerName: 'Public', flex: 0.5 },
  ];

  return (
    <Container>
      <Typography variant="h5" component="h2" sx={{paddingBottom:'20px'}}>
        Compare Datsets
      </Typography>
      <Typography  sx={{ mb: 2, fontStyle: 'italic' }}>
        *Choose Control and Condition Datasets
      </Typography>
      <Typography  sx={{ mb: 2, fontStyle: 'italic' }}>
        *1 Control and 1 Condition are mandatory
      </Typography>
      <DataGrid
        rows={datasets}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 25]}
        pagination
        disableSelectionOnClick
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
            Perform Treatment vs Control 
        </Button>
        </Grid2>
        </Grid2>
    </Container>
  );
}
