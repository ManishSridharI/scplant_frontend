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
          '/api/jobs/api/job_annotate_and_plot_query/',
          '/api/jobs/api/job_treatment_vs_control_query/',
          '/api/jobs/api/job_convert_rds_to_h5ad_query/',          
        ];

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

        const annotateandplotData = data[0]?.JobAnnotateAndPlot?.map((job, index) => ({
          type: `Annotate and Plot`, 
          id: `Annotate and Plot-${job.id}`,
          testName: job.job_name,
          status: job.job_celery_task_status,
          creationTime: new Date(job.job_creation_timestamp).toLocaleString(),
          filesId: job.job_annotate_and_plot_file_output,
        })) || [];
        console.log(annotateandplotData);

        const TreatmentVsControl = data[1]?.JobTreatmentVsControl?.map((job, index) => ({
          type: `Treatment vs Control`, 
          id: `Treatment vs Control-${job.id}`,
          testName: job.job_name,
          status: job.job_celery_task_status,
          creationTime: new Date(job.job_creation_timestamp).toLocaleString(),
          filesId: job.job_treatment_vs_control_file_output,
        })) || [];

        const rdsToh5ad = data[2]?.JobConvertRdsToH5ad?.map((job,index) => ({
          type: `rds to h5ad`, 
          id: `rds to h5ad-${job.id}`,
          testName: job.job_name,
          status: job.job_celery_task_status,
          creationTime: new Date(job.job_creation_timestamp).toLocaleString(),
          filesId: job.job_compare_cell_type_dist_file_output,
        })) || [];

        const combinedData = [
          ...annotateandplotData,
          ...TreatmentVsControl,
          ...rdsToh5ad,
        ];      
        
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
      case "Annotate and Plot":
        endpoint = `/api/jobs/api/job_annotate_and_plot_file_output_query_by_id/`;
        payload = { job_annotate_and_plot_file_output_id: filesId };
        fileKeys = {
          prediction: "job_annotate_and_plot_prediction_file",
          stats: "job_annotate_and_plot_stats_csv_file",
          stats_plot: "job_annotate_and_plot_stats_csv_file",
          top25: "job_annotate_and_plot_top25_markers_file",
          marker_genes: "job_annotate_and_plot_marker_genes_file",
          annotate_tsne: "job_annotate_and_plot_annotate_tsne_file",
          annotate_umap: "job_annotate_and_plot_annotate_umap_file",
          top3: "job_annotate_and_plot_top3_genes_dotplot_file",
          all_markers: 'job_annotate_and_plot_all_markers_file',
          top5_markers: 'job_annotate_and_plot_top5_markers_file',
          top10_markers: 'job_annotate_and_plot_top10_markers_file',
          top25_markers: 'job_annotate_and_plot_top25_markers_file',
          stderr: "job_annotate_and_plot_stderr_file",
        };
        rootKey = "JobAnnotateAndPlotFileOutput";
        break;
      case "Treatment vs Control":
        endpoint = `/api/jobs/api/job_treatment_vs_control_file_output_query_by_id/`;
        payload = { job_treatment_vs_control_file_output_id: filesId };
        fileKeys = {
          comp_celltype_dist: "job_treatment_vs_control_comp_celltype_dist_file",
          control_vs_conditions_markers: "job_treatment_vs_control_control_vs_conditions_markers_file",
          conditions_vs_control_markers: "job_treatment_vs_control_conditions_vs_control_markers_file",
          ctrl_vs_cond1_cond1_all_DEGs: "job_treatment_vs_control_ctrl_vs_cond1_cond1_all_DEGs_file",
          ctrl_vs_cond1_cond1_top10_DEGs: "job_treatment_vs_control_ctrl_vs_cond1_cond1_top10_DEGs_file",
          ctrl_vs_cond1_cond1_top25_DEGs: "job_treatment_vs_control_ctrl_vs_cond1_cond1_top25_DEGs_file",
          ctrl_vs_cond1_cond1_top5_DEGs: "job_treatment_vs_control_ctrl_vs_cond1_cond1_top5_DEGs_file",
          ctrl_vs_cond1_ctrl_all_DEGs: "job_treatment_vs_control_ctrl_vs_cond1_ctrl_all_DEGs_file",
          ctrl_vs_cond1_ctrl_top10_DEGs: "job_treatment_vs_control_ctrl_vs_cond1_ctrl_top10_DEGs_file",
          ctrl_vs_cond1_ctrl_top25_DEGs: "job_treatment_vs_control_ctrl_vs_cond1_ctrl_top25_DEGs_file",
          ctrl_vs_cond1_ctrl_top5_DEGs: "job_treatment_vs_control_ctrl_vs_cond1_ctrl_top5_DEGs_file",
          ctrl_vs_cond2_cond2_all_DEGs: "job_treatment_vs_control_ctrl_vs_cond2_cond2_all_DEGs_file", 
          ctrl_vs_cond2_cond2_top10_DEGs: "job_treatment_vs_control_ctrl_vs_cond2_cond2_top10_DEGs_file", 
          ctrl_vs_cond2_cond2_top25_DEGs: "job_treatment_vs_control_ctrl_vs_cond2_cond2_top25_DEGs_file", 
          ctrl_vs_cond2_cond2_top5_DEGs: "job_treatment_vs_control_ctrl_vs_cond2_cond2_top5_DEGs_file", 
          ctrl_vs_cond2_ctrl_all_DEGs: "job_treatment_vs_control_ctrl_vs_cond2_ctrl_all_DEGs_file", 
          ctrl_vs_cond2_ctrl_top10_DEGs: "job_treatment_vs_control_ctrl_vs_cond2_ctrl_top10_DEGs_file", 
          ctrl_vs_cond2_ctrl_top25_DEGs: "job_treatment_vs_control_ctrl_vs_cond2_ctrl_top25_DEGs_file", 
          ctrl_vs_cond2_ctrl_top5_DEGs: "job_treatment_vs_control_ctrl_vs_cond2_ctrl_top5_DEGs_file", 
          stderr: "job_treatment_vs_control_stderr_file",
        };
        rootKey = "JobTreatmentVsControlFileOutput";
        break;
        case "rds to h5ad":
          endpoint = `/api/jobs/api/job_convert_rds_to_h5ad_file_output_query_by_id/`;
          payload = { job_convert_rds_to_h5ad_file_output_id: filesId };
          fileKeys = {
            compare_output: "job_convert_rds_to_h5ad_file",
            stderr: "job_annotate_and_plot_stderr_file",
          };
          rootKey = "JobConvertRdsToH5adFileOutput";
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

      for (const [key, value] of Object.entries(fileKeys)) {
        if (responseRoot[value]) {
          fileUrls[key] = `/api${responseRoot[value]}`;
        }
      }

      const zip = new JSZip();

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
    { field: 'testName', headerName: 'Prediction Name', flex: 1.5 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.5,
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
    { field: 'type', headerName: 'Prediction Type', flex: 0.75 },
    { field: 'creationTime', headerName: 'Creation Time', flex: 0.75 },
    {
      field: 'download',
      headerName: 'Download',
      flex: 0.6,
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
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
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
          initialState={{
            sorting: {
              sortModel: [{ field: 'creationTime', sort: 'desc' }], // Default sorting by 'creationTime' in descending order
            },
          }}
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