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
import { useNavigate } from 'react-router-dom';

export default function Results(props) {
  const { user, csrfToken } = useAuth();
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(5);
  const navigate = useNavigate();
  
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;  // Skip data fetching if user is not logged in
      }
      try {
        const urls = [
          '/api/jobs/api/job_inference_query/',
          '/api/jobs/api/job_annotate_and_plot_query/',
          '/api/jobs/api/job_treatment_vs_control_query/',
          '/api/jobs/api/job_compare_cell_type_dist_query/',
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
          filesId: job.job_treatment_vs_control_file_output,
        })) || [];

        const comparePlotData = data[3]?.JobCompareCellTypeDist?.map((job,index) => ({
          type: `Compare Cell Type Distribution`, 
          id: `Compare Cell Type Distribution-${job.id}`,
          testName: job.job_name,
          status: job.job_celery_task_status,
          creationTime: new Date(job.job_creation_timestamp).toLocaleString(),
          filesId: job.job_compare_cell_type_dist_file_output,
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
const handleDownload = (row) => {
  fetchDownloadFiles(row, setLoading);
};
  const fetchDownloadFiles = async (row) => {
    setLoading(true);
    const type= row.type;
    const filesId = row.filesId;
    let endpoint = "";
    let payload = {};
    let fileKeys = {};
    let rootKey = "";
    switch (type) {
      case "Inference":
        endpoint = `/api/jobs/api/job_inference_file_output_query_by_id/`;
        payload = { job_inference_file_output_id: filesId };
        fileKeys = {
          prediction: "job_inference_prediction_file",
          stderr: "job_inference_stderr_file",
        };
        rootKey = "JobInferenceFileOutput";
        break;
      case "Annotate and Plot":
        endpoint = `/api/jobs/api/job_annotate_and_plot_file_output_query_by_id/`;
        payload = { job_annotate_and_plot_file_output_id: filesId };
        fileKeys = {
          top25: "job_annotate_and_plot_top25_markers_file",
          marker_genes: "job_annotate_and_plot_marker_genes_file",
          // celltype: "job_annotate_and_plot_output_with_celltype_file",
          prediction: "job_annotate_and_plot_prediction_file",
          annotate_tsne: "job_annotate_and_plot_annotate_tsne_file",
          annotate_umap: "job_annotate_and_plot_annotate_umap_file",
          top3: "job_annotate_and_plot_top3_genes_dotplot_file",
          stderr: "job_annotate_and_plot_stderr_file",
        };
        rootKey = "JobAnnotateAndPlotFileOutput";
        break;
      case "Treatment vs Control":
        endpoint = `/api/jobs/api/job_treatment_vs_control_file_output_query_by_id/`;
        payload = { job_treatment_vs_control_file_output_id: filesId };
        fileKeys = {
          cond1_marker: "job_treatment_vs_control_condition1_marker_genes_file",
          cond1_top25: "job_treatment_vs_control_condition1_top25_markers_file",
          cond1_top10_dot: "job_treatment_vs_control_condition1_top10_genes_dotplot_file",
          cond2_marker: "job_treatment_vs_control_condition2_marker_genes_file",
          cond2_top25: "job_treatment_vs_control_condition2_top25_markers_file",
          cond2_top10_dot: "job_treatment_vs_control_condition2_top10_genes_dotplot_file",
          t_vs_ctrl_ctrl_vs_con: "job_treatment_vs_control_control_vs_conditions_markers_file",
          t_vs_ctrl_con_vs_ctrl: "job_treatment_vs_control_conditions_vs_control_markers_file",
          stderr: "job_annotate_and_plot_stderr_file",
        };
        rootKey = "JobTreatmentVsControlFileOutput";
        break;
        case "Compare Cell Type Distribution":
          endpoint = `/api/jobs/api/job_compare_cell_type_dist_file_output_query_by_id/`;
          payload = { job_compare_cell_type_dist_file_output_id: filesId };
          fileKeys = {
            compare_output: "job_compare_cell_type_dist_output_file",
            stderr: "job_annotate_and_plot_stderr_file",
          };
          rootKey = "JobCompareCellTypeDistFileOutput";
          break;
      default:
        alert(`Unsupported job type: ${type}`);
        setLoading(false);
        return;
    }
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
          
        },
        credentials: "include",
       body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      const fileUrls = {};
      const responseRoot = data[rootKey]; 
      if (!responseRoot) {
        console.error(`Invalid response structure: Missing ${rootKey}`);
        alert("Failed to process file data.");
        setLoading(false);
        return;
      }
      // URLs to fetch the files (assume they are hosted on the server)
      // const fileUrls = {  
      //   prediction: `http://digbio-g2pdeep.rnet.missouri.edu:8449${data.JobInferenceFileOutput.job_inference_prediction_file}`,
      //   stderr: `http://digbio-g2pdeep.rnet.missouri.edu:8449${data.JobInferenceFileOutput.job_inference_stderr_file}`,
      // };
     // console.log(fileUrls);
      // Combine files into a ZIP

      for (const [key, value] of Object.entries(fileKeys)) {
        if (responseRoot[value]) {
          fileUrls[key] = `/api${responseRoot[value]}`;
        }
      }

      const zip = new JSZip();
      // for (const [key, url] of Object.entries(fileUrls)) {
      //   const fileResponse = await fetch(url);
      //   if (!fileResponse.ok) {
      //     console.warn(`Failed to fetch ${key} file`);
      //     continue;
      //   }
      //   const fileBlob = await fileResponse.blob();
      //   const fileName = url.split('/').pop()
      //   zip.file(fileName, fileBlob);
      // }

      for (const [key, url] of Object.entries(fileUrls)) {
        if (!url) continue; // Skip missing files
  
        try {
          const fileResponse = await fetch(url);
          if (!fileResponse.ok) {
            console.warn(`Failed to fetch ${key} file`);
            continue;
          }
          const fileBlob = await fileResponse.blob();
          const fileName = url.split("/").pop();
          zip.file(fileName, fileBlob);
        } catch (fetchError) {
          console.error(`Error fetching ${key} file:`, fetchError);
        }
      }
  
      // Generate ZIP blob
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `job_${row.testName}_output_files.zip`);
    } catch (error) {
      console.error("Error fetching or downloading files:", error);
      alert("Failed to download files.");
    } finally {
      // Hide loading after completion
      setLoading(false);
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
        onClick={() => handleDownload(params.row)}
        variant="contained"
        disabled={loading}      
      >
        Results ZIP
      </Button>
      ),
    },
  ];

  if (!user) {
    // If the user is not logged in, show login prompt
    return (
      <Container id="pricing"
      sx={{
        pt: { xs: 8, sm: 16 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}>
        <Typography variant="h4" gutterBottom>
          Please log in to view the results
        </Typography>
        <Button variant="contained" onClick={() => navigate('/signin')} >
          Sign in
        </Button>
      </Container>
    );
  }



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