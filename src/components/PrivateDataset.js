import React, { useEffect, useState } from 'react';
import { useAuth } from '../Auth';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';

export default function PrivateData({ onDatasetSelect, refreshTrigger }) {
  const { user, csrfToken } = useAuth(); // Get the logged-in user's info and CSRF token
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  useEffect(() => {
    console.log("useEffect triggered. Refresh Trigger:", refreshTrigger);
    if (user && csrfToken) {
      // Sending user.id as a query parameter
      fetch(`/api/datasets/api/dataset_query/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,  // Set CSRF token in the header
            // Send authentication token
        },
        credentials: 'include',  // Ensure cookies are included in the request
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.isDatasetQuery) {
            // Map the dataset response to the structure required by the DataGrid
            const formattedDatasets = data.Dataset.map(dataset => ({
              id: dataset.id,
              dataset_name: dataset.dataset_name,
              dataset_file: dataset.dataset_file,
              dataset_gene_count: dataset.dataset_gene_count,
              dataset_public_flag: dataset.dataset_public_flag ? 'Yes' : 'No', // Convert boolean to display-friendly value
              dataset_creation_timestamp: new Date(dataset.dataset_creation_timestamp).toLocaleString(), // Format timestamp
            }));
            setDatasets(formattedDatasets);  // Set the formatted datasets to state
          //  setRefreshKey((prevKey) => prevKey + 1);
          } else {
            console.error('Error fetching datasets:', data.error);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching datasets:', error);
          setLoading(false);
        });
    } else {
      console.error('User or CSRF token not found');
      setLoading(false);
    }
  }, [user, csrfToken, refreshTrigger]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!datasets.length) {
    return <p>No datasets available for this user.</p>;
  }

  const columns = [
    { field: 'dataset_name', headerName: 'Dataset Name', flex: 1 },
    // { field: 'dataset_gene_count', headerName: 'Gene Count', flex: 0.5 },
    { field: 'dataset_public_flag', headerName: 'Public', flex: 0.5 },
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
                  onDatasetSelect({ id: selectedId, name: selectedDataset.dataset_name, geneCountNumber: selectedDataset.dataset_gene_count }); // Pass both ID and name
                }
              } 
              // const singleSelection = newRowSelectionModel.slice(-1); // Keep only the last selected row
              // setRowSelectionModel(singleSelection);
              // onDatasetSelect(singleSelection);
              // setRowSelectionModel(newRowSelectionModel);
              // const selectedDatasetIds = newRowSelectionModel.map((id) => id);
              // onDatasetSelect(selectedDatasetIds);
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
