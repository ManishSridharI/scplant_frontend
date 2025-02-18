import React, { useEffect, useState } from 'react';
import { useAuth } from '../Auth';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';

export default function PrivateData({ selectedModel, onDatasetSelect, refreshTrigger }) {
  const { user, csrfToken } = useAuth(); // Get the logged-in user's info and CSRF token
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  useEffect(() => {
    // console.log("useEffect triggered. Refresh Trigger:", refreshTrigger);
    if (user && csrfToken) {
      const fetchData = async () => {
        try {
          // Fetch from the first API: /api/h5addatasets/api/h5ad_dataset_query_uploaded_and_public/
          const h5adResponse = await fetch(`/api/h5addatasets/api/h5ad_dataset_query_uploaded_and_public/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrfToken,
              // Send authentication token
            },
            credentials: 'include',
          });
          const h5adData = await h5adResponse.json();
  
          // Fetch from the second API: /rdsdatasets/api/rds_dataset_query_uploaded_and_public/
          const rdsResponse = await fetch(`/api/rdsdatasets/api/rds_dataset_query_uploaded_and_public/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
          });
          const rdsData = await rdsResponse.json();
  
          // Fetch from the third API: /tenxfeaturebcmatrixdatasets/api/tenxfbcm_dataset_query_uploaded_and_public/
          const tenxResponse = await fetch(`/api/tenxfeaturebcmatrixdatasets/api/tenxfbcm_dataset_query_uploaded_and_public/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
          });
          const tenxData = await tenxResponse.json();
  
          // Combine the responses from all three APIs
          const combinedData = [
            ...h5adData.H5adDataset,
            // ...rdsData.RdsDataset,
            ...tenxData.TenxfbcmDataset,
          ];
          console.log(combinedData);
          const datasetMapping = {
            1: "Arabidopsis thaliana",
            2: "Zea mays",
            3: "Oryza sativa",
            4: "Glycine max",
          };
  
          // Format the combined dataset
          const formattedDatasets = combinedData
            .map((dataset) => ({
              id: dataset.id,
              dataset_name: dataset.h5ad_dataset_name || dataset.rds_dataset_name || dataset.tenxfbcm_dataset_name,
              dataset_type: (dataset.h5ad_dataset_file_extension || dataset.rds_dataset_file_extension) ? 'h5ad/rds' : '10x',
              dataset_organism: dataset.h5ad_dataset_organism || dataset.rds_dataset_organism || dataset.tenxfbcm_dataset_organism, 
              dataset_public_flag: (dataset.h5ad_dataset_public_flag || dataset.rds_dataset_public_flag || dataset.tenxfbcm_dataset_public_flag) ? 'Yes' : 'No',
              dataset_creation_timestamp: new Date(dataset.h5ad_dataset_creation_timestamp || dataset.rds_dataset_creation_timestamp || dataset.tenxfbcm_dataset_creation_timestamp).toLocaleString(),
              dataset_upload_user: dataset.h5ad_dataset_upload_user || dataset.rds_dataset_upload_user || dataset.tenxfbcm_dataset_upload_user,
            }))
            .filter((dataset) => dataset.dataset_upload_user !== 1)
            .filter((dataset) => dataset.dataset_organism === selectedModel) // Filter by selected organism
            .map((dataset) => ({
              ...dataset,
              dataset_organism: datasetMapping[dataset.dataset_organism] || "Unknown", // Map number to name after filtering
            }));
  
          setDatasets(formattedDatasets); // Set the formatted datasets to state
          setLoading(false);
  
        } catch (error) {
          console.error('Error fetching datasets:', error);
          setLoading(false);
        }
      };
  
      // Call the fetchData function
      fetchData();
    } else {
      console.error('User or CSRF token not found');
      setLoading(false);
    }
  }, [user, csrfToken, refreshTrigger, selectedModel]); // Add selectedModel to the dependency array if needed
  

  if (loading) {
    return <CircularProgress />;
  }

  if (!datasets.length) {
    return <p>No datasets available for this user (Select an <Link to="/organism" style={{ color: 'blue', textDecoration: 'none' }}>Organism</Link> to view your datasets).</p>;
  }

  const columns = [
    { field: 'dataset_name', headerName: 'Dataset Name', flex: 1 },
    { field: 'dataset_organism', headerName: 'Organism', flex: 0.75 },
    { field: 'dataset_type', headerName: 'Dataset Type', flex: 0.5 },
    { field: 'dataset_public_flag', headerName: 'Public', flex: 0.25 },
    { field: 'dataset_creation_timestamp', headerName: 'Creation Date', flex: 1 },
  ];

  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 8 },
      }}
    >
      <Container
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Typography variant="h5" component="h2">
          Your Datasets
        </Typography>
        <Typography variant="body2" sx={{ color: 'grey.600' }}>
          To select a dataset, upload your file and then choose from the table below.
        </Typography>
        <Box sx={{ height: '100%', width: '100%' }}>
          <DataGrid
            rows={datasets}
            columns={columns}
            getRowId={(row) => row.id}  // Ensure rows are uniquely identified by `id`
            pageSize={5}
            checkboxSelection
            rowSelectionModel={rowSelectionModel}
            onRowSelectionModelChange={(newRowSelectionModel) => {
              if (newRowSelectionModel.length > 0) {
                const selectedId = parseInt(newRowSelectionModel[newRowSelectionModel.length - 1], 10); // Convert to int
                const selectedDataset = datasets.find(dataset => dataset.id === selectedId); // Find dataset by ID
               
                if (selectedDataset) {
                  setRowSelectionModel(selectedId);
                   // Pass both ID and name
                }onDatasetSelect({ id: selectedId, name:selectedDataset.dataset_name, type: selectedDataset.dataset_type === 'h5ad/rds' ? 'h5ad' : selectedDataset.dataset_type });
              } 
            }}
            rowsPerPageOptions={[5, 10, 20]}
            autoHeight
            disableMultipleSelection
            sx={{
              '& .MuiDataGrid-container--top [role="row"], & .MuiDataGrid-container--bottom [role="row"]': {
                background: 'lightgrey', // Ensure background is light grey for both top and bottom rows
              },
            }}
          />
        </Box>
      </Container>
    </Box>
  );
}
