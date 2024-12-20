import * as React from 'react';
import Models from '../components/Models';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useAuth } from '../Auth';
import Typography from '@mui/material/Typography';
import { Grid2 } from '@mui/material';
import TextField from '@mui/material/TextField';
import Scripts from '../components/Scripts';

export default function Model(props) {
  const { user, csrfToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { datasetIds } = location.state || {};
  // console.log(datasetIds,'modelpage');
  
 // const datasetId = parseInt(datasetIds[0], 10);

  const [jobName, setjobName] = React.useState('');
  const [geneNumber, setgeneNumber] = React.useState(''); 

  const handlejobNameChange = (event) => {
    setjobName(event.target.value);
  };

  const handlegeneNumberChange = (event) => {
    setgeneNumber(event.target.value);
  };

  const [selectedModel, setSelectedModel] = React.useState(null);
  const handleModelSelect = (selectedModel) => {
    setSelectedModel(selectedModel);
  };

  const [selectedScript, setselectedScript] = React.useState(null);
  const handleScriptSelect = (selectedScript) => {
    setselectedScript(selectedScript);
  };

  // const job_info = [
  //   { key: 'job_dataset', value: datasetIds },
  //   { key: 'job_predictor', value: selectedModel },
  //   { key: 'script', value: selectedScript },
  //   // { key: 'user_id', value: user ? user.id : null },
  //   { key: 'job_name', value: jobName },
  //   { key: 'job_inference_gene_number', value: geneNumber },
  // ];
  // console.log(job_info);
  const handlePrediction = async () => {
    if (!user) {
      alert('Please login first to proceed.');
      navigate('/signin');
    } else {
      const datasetId = parseInt(datasetIds[0], 10);

      const commonData = {
        job_dataset: datasetId,
        job_predictor: selectedModel,
        job_name: jobName,
        gene_number: geneNumber, // Single input field
      };

      // const job_info = [
      //   { key: 'job_dataset', value: datasetId },
      //   { key: 'job_predictor', value: selectedModel },
      //   { key: 'script', value: selectedScript },
      //   // { key: 'user_id', value: user ? user.id : null },
      //   { key: 'job_name', value: jobName },
      //  { key: 'job_inference_gene_number', value: geneNumber },
      // ];
  
      // Preparing the data for API request
    //   const data = {
    //     job_dataset: job_info.find(item => item.key === 'job_dataset').value,
    //     job_predictor: job_info.find(item => item.key === 'job_predictor').value,
    //  //   user_id: job_info.find(item => item.key === 'user_id').value,
    //     job_name: job_info.find(item => item.key === 'job_name').value,
    //     job_inference_gene_number: job_info.find(item => item.key === 'job_inference_gene_number').value,
    //     job_inference_log_filename: "Log001",
    //     job_inference_prediction_filename: "Prediction001",
    //     job_inference_stdout_filename: "Stdout001",
    //     job_inference_stderr_filename: "Stderr001"
    //   };
    //   console.log(data);

      let url = '';
      let requestData = {};
    switch (parseInt(selectedScript, 10)) {
      case 1:
        url = 'http://digbio-g2pdeep.rnet.missouri.edu:8449/jobs/api/job_inference/';
        requestData = {
          job_dataset: commonData.job_dataset,
          job_predictor: commonData.job_predictor,
          job_name: commonData.job_name,
          job_script: 1,
          job_inference_gene_number: commonData.gene_number,
          job_inference_log_filename: "Log001",
          job_inference_prediction_filename: "Prediction001",
          job_inference_stdout_filename: "Stdout001",
          job_inference_stderr_filename: "Stderr001",
        };
        break;
      case 2:
        url = 'http://digbio-g2pdeep.rnet.missouri.edu:8449/jobs/api/job_annotate_and_plot/';
        requestData = {
          job_dataset: commonData.job_dataset,
          job_predictor: commonData.job_predictor,
          job_name: commonData.job_name,
          job_script: 2,
          job_annotate_and_plot_gene_number: commonData.gene_number,
          job_annotate_and_plot_log_filename: "Log001",
          job_annotate_and_plot_stdout_filename: "Stdout001",
          job_annotate_and_plot_stderr_filename: "Stderr001",
        };
        break;
      case 3:
        url = 'http://digbio-g2pdeep.rnet.missouri.edu:8449/jobs/api/job_treatment_vs_control/';
        requestData = {
          job_control_dataset: commonData.job_dataset,
          job_name: commonData.job_name,
          job_script: 3,
          job_control_stdout_filename: "Stdout001",
          job_control_stderr_filename: "Stderr001",
        };
        break;
      case 4:
        url = 'http://digbio-g2pdeep.rnet.missouri.edu:8449/jobs/api/job_compare/';
        requestData = {
          job_dataset: commonData.job_dataset,
          job_predictor: commonData.job_predictor,
          job_name: commonData.job_name,
          job_compare_gene_number: commonData.gene_number,
          job_script: 4,
          job_compare_log_filename: "Log001",
          job_compare_stdout_filename: "Stdout001",
          job_compare_stderr_filename: "Stderr001",
        };
        break;
      default:
        alert('Invalid script ID selected.');
        return;
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

  return (
      <div>
        <Models onModelSelect={handleModelSelect}/>
        <Scripts onScriptSelect={handleScriptSelect}/>
        <Box
      id="pricing"
      sx={{
        pb: { xs: 4, sm: 4 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Insert Job Name and Gene Number
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          textAlign: { sm: 'center', md: 'center' },
          gap: 2,
          width: '100%',
          maxWidth: 500,
        }}
      >
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
          <TextField
            label="Gene Number"
            variant="outlined"
            fullWidth
            value={geneNumber}
            onChange={handlegeneNumberChange}
            required
          />
        </Grid2>
        </Grid2>
        </Box>
        </Box>

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