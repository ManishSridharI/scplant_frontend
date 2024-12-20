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

export default function Results(props) {
  const { user, csrfToken } = useAuth();
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(5);
  
  
    const fetchData = async () => {
      try {
        const urls = [
          'http://digbio-g2pdeep.rnet.missouri.edu:8449/jobs/api/job_inference_query/',
          'http://digbio-g2pdeep.rnet.missouri.edu:8449/jobs/api/job_annotate_and_plot_query/',
          'http://digbio-g2pdeep.rnet.missouri.edu:8449/jobs/api/job_treatment_vs_control_query/',
          'http://digbio-g2pdeep.rnet.missouri.edu:8449/jobs/api/job_compare_cell_type_dist_query/',
        ];
        // const response = await fetch('http://digbio-g2pdeep.rnet.missouri.edu:8449/jobs/api/job_inference_query/', {
        //   method: 'GET',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'X-CSRFToken': csrfToken,              // Include CSRF token
        //   },
        //   credentials: 'include', // Ensure cookies are sent with the request
        // });
  
        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }

        const responses = await Promise.all(
          urls.map((url) =>
            fetch(url, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken, // Include CSRF token
              },
              credentials: 'include', // Ensure cookies are sent with the request
            })
          )
        );

        responses.forEach((response, index) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} from ${urls[index]}`);
          }
        });

        const data = await Promise.all(responses.map((response) => response.json()))
  
        // Extract and format data from each API
        const jobInferenceData = data[0]?.JobInference?.map((job, index) => ({
          type: `Inference`, 
          id: `Inference-${job.id}`,
          testName: job.job_name,
          status: job.job_celery_task_status,
          creationTime: new Date(job.job_creation_timestamp).toLocaleString(),
          filesId: job.job_inference_file_output,
        })) || [];

        const annotateandplotData = data[1]?.JobAnnotateAndPlot?.map((job, index) => ({
          type: `Annotate and Plot`, 
          id: `Annotate and Plot-${job.id}`,
          testName: job.job_name,
          status: job.job_celery_task_status,
          creationTime: new Date(job.job_creation_timestamp).toLocaleString(),
          filesId: job.job_annotate_and_plot_file_output,
        })) || [];

        const controlVsConditionData = data[2]?.JobTreatmentVsControl?.map((job, index) => ({
          type: `Treatment vs Control`, 
          id: `Treatment vs Control-${job.id}`,
          testName: job.job_name,
          status: job.job_celery_task_status,
          creationTime: new Date(job.job_creation_timestamp).toLocaleString(),
          filesId: job.job_inference_file_output_id,
        })) || [];

        const comparePlotData = data[3]?.JobCompareCellTypeDist?.map((job,index) => ({
          type: `Compare Cell Type Distribution`, 
          id: `Compare Cell Type Distribution-${job.id}`,
          testName: job.job_name,
          status: job.job_celery_task_status,
          creationTime: new Date(job.job_creation_timestamp).toLocaleString(),
          filesId: job.job_inference_file_output_id,
        })) || [];

        const combinedData = [
          ...jobInferenceData,
          ...annotateandplotData,
          ...controlVsConditionData,
          ...comparePlotData,
        ];      
        
        // const data = await response.json();
        // const formattedData = data.JobInference.map((job) => ({
        //   id: job.id,
        //   testName: job.job_name,
        //   status: job.job_celery_task_status, // Adjust based on your logic
        //   creationTime: new Date(job.job_creation_timestamp).toLocaleString(),
        //   files_id: job.job_inference_file_output_id,
         
        // }));
        setRows(combinedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    React.useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

console.log(rows);
  const fetchDownloadFiles = async (row) => {
    const fileOutputId = row.filesId;
    try {
      const response = await fetch(`http://digbio-g2pdeep.rnet.missouri.edu:8449/jobs/api/job_inference_file_output_query_by_id/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
          
        },
        credentials: "include",
       body: JSON.stringify({ job_inference_file_output_id: fileOutputId }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
 
      // URLs to fetch the files (assume they are hosted on the server)
      const fileUrls = {  
        prediction: `http://digbio-g2pdeep.rnet.missouri.edu:8849/home/scplant_backend/core/uploads${data.JobInferenceFileOutput.job_inference_prediction_file}`,
        stderr: `http://digbio-g2pdeep.rnet.missouri.edu:8849/home/scplant_backend/core/uploads${data.JobInferenceFileOutput.job_inference_stderr_file}`,
      };
  
      // Combine files into a ZIP
      const zip = new JSZip();
      for (const [key, url] of Object.entries(fileUrls)) {
        const fileResponse = await fetch(url);
        if (!fileResponse.ok) {
          console.warn(`Failed to fetch ${key} file`);
          continue;
        }
        const fileBlob = await fileResponse.blob();
        zip.file( fileBlob);
      }
  
      // Generate ZIP blob
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `job_${row.testName}_output_files.zip`);
    } catch (error) {
      console.error("Error fetching or downloading files:", error);
      alert("Failed to download files.");
    }
  };
  

  const columns = [
    { field: 'testName', headerName: 'Test Name', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => {
        let color = 'inherit';
        if (params.value === 'SUCCESS') color = 'green';
        else if (params.value === 'FAILURE') color = 'red';
        else if (params.value === 'RUNNING') color = 'orange';

        return (
          <span style={{ color, fontWeight: 'bold' }}>
            {params.value.charAt(0).toUpperCase() + params.value.slice(1)}
          </span>
        );
      },
    },
    { field: 'type', headerName: 'Prediction Type', flex: 1 },
    { field: 'creationTime', headerName: 'Creation Time', flex: 1 },
    {
      field: 'download',
      headerName: 'Download',
      flex: 1,
      renderCell: (params) => (
        <Button
        onClick={() => fetchDownloadFiles(params.row)}
        variant="contained"
      >
        Download ZIP
      </Button>
      ),
    },
  ];



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
          Results
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Find and download your results here.<br />
        </Typography>
      </Box>
      <Box sx={{ height: '100%', width: '100%', p: 3 }}>
      <Typography  sx={{ mb: 2, fontStyle: 'italic' }}>
        *Job Results (Auto-refreshes every 30 seconds)
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          rows={rows}
          columns={columns} 
        loading={loading} // Show loading spinner during data fetch
          disableSelectionOnClick
          // autoHeight
          sx={{
            height: 600,
            '& .MuiDataGrid-container--top [role="row"], & .MuiDataGrid-container--bottom [role="row"]': {
              background: 'lightgrey', // Ensure background is light grey for both top and bottom rows
            },
            
          }}
        />
      )}
    </Box>
    
    </Container>
      </div>
  );
}