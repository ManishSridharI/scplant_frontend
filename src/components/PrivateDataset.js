import React, { useEffect, useState } from 'react';
import { useAuth } from '../Auth';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';

export default function PrivateData({ onDatasetSelect }) {
  const { user } = useAuth(); // Get the logged-in user's info
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  
  useEffect(() => {
    if (user) {
      fetch(`http://digbio-g2pdeep.rnet.missouri.edu:8449/datasets/user/${user.id}`) // Replace with your API endpoint
        .then((response) => response.json())
        .then((data) => {
          setDatasets(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching datasets:', error);
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!datasets.length) {
    return <p>No datasets available for this user.</p>;
  }

  const columns = [
    { field: 'dataset_name', headerName: 'Dataset Name', flex: 1 },
    // { field: 'num_samples', headerName: '# Samples', type: 'number', flex: 0.75 },
    // { field: 'num_features', headerName: '# Features', type: 'number', flex: 0.75 },
    { field: 'description', headerName: 'Description', flex: 1 },
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
        <Typography variant="h5" component="h2" >
        Your Datasets
      </Typography>
      <Typography variant="body2" sx={{ color: 'grey.600' }}>
        To select a dataset, upload your file and then choose from the table below.
      </Typography>
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={datasets}
        columns={columns}
        getRowId={(row) => row.dataset_info_id}
        pageSize={5}
        checkboxSelection
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
      
          const selectedDatasetIds = newRowSelectionModel.map((id) => id);
          onDatasetSelect(selectedDatasetIds);
        }}
      //   onRowSelectionModelChange={(newRowSelectionModel) => {
      //     // Update the row selection model state
      //     setRowSelectionModel(newRowSelectionModel);
      
      //     // Find the selected datasets based on the new selection model
      //     const selectedDatasets = datasets.filter((dataset) =>
      //       newRowSelectionModel.includes(dataset.dataset_info_id)
      //     );
      // console.log(selectedDatasets);
      //     // Notify the parent or handle the selected datasets
      //     onDatasetSelect(selectedDatasets);
      //   }}
      //   // onSelectionModelChange={(ids) => {
      //   //   const selected = datasets.find((dataset) => ids.includes(dataset.dataset_info_id));
      //   //   onDatasetSelect(selected); // Notify parent of the selected dataset
      //   // }}
        rowsPerPageOptions={[5, 10, 20]}
        sx={{
            '& .MuiDataGrid-root': {
              borderColor: 'black', // Set the border color for the entire grid
            },
            '& .MuiDataGrid-cell': {
              borderColor: 'black', // Set the border color for cells
            },
            '& .MuiDataGrid-columnHeaders': {
              borderColor: 'black', // Set the border color for column headers
            },
          }}
      />
    </div>
    </Container>
    </Box>
  );
}
