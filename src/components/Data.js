import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InsightsIcon from '@mui/icons-material/Insights';
import ButtonBase from '@mui/material/ButtonBase'

const items = [
  {
    icon: <InsightsIcon />,
    title: 'Arabidopsis (SRP 171)',
    dataset_info_id: 5,
    description: 'SRP 171',
    genes: '53,678',
    cells: '1.2M',
    datasets: '28',
    cell_types: '50',
  },
  {
    icon: <InsightsIcon />,
    title: 'Zmays (SRP 335)',
    dataset_info_id: 6,
    description: 'SRP 335',
    genes: '67,300',
    cells: '35K',
    datasets: '9',
    cell_types: '38',
  },
  {
    icon: <InsightsIcon />,
    title: 'Osativia (SRP 286)',
    dataset_info_id: 7,
    description: 'SRP 286',
    genes: '57,623',
    cells: '417K',
    datasets: '5',
    cell_types: '38',
  },
  {
    icon: <InsightsIcon />,
    title: 'GlycineMax (Flowerbud)',
    dataset_info_id: 8,
    description: 'Flowerbud',
    genes: '56,044(Public), 41,780(Private)',
    cells: '25K(Public), 116k(Private)',
    datasets: '1(Public), 10(Private)',
    cell_types: '7(Public), 42(Private)',
  },
];


export default function Data({ onDatasetClick }) {
  const [selectedId, setSelectedId] = React.useState(null);

  const handleDatasetClick = (datasetId) => {
    setSelectedId(datasetId); // Update the selected ID
    if (onDatasetClick) {
      onDatasetClick(datasetId); // Trigger the parent handler if provided
    }
  };
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 8, sm: 16 },
        pb: { xs: 8, sm: 16 },
        color: 'white',
        bgcolor: 'grey.900',
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
        <Box
          sx={{
            width: { sm: '100%', md: '60%' },
            textAlign: { sm: 'left', md: 'center' },
          }}
        >
          <Typography component="h2" variant="h4" gutterBottom>
            Datasets
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.400' }}>
            Upload your own/ use our datasets
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 6 }} key={index}>
              <ButtonBase
              component="div"
              sx={{
                width: '100%',
                textAlign: 'left',
                display: 'block',
                color: selectedId === item.dataset_info_id ? 'hsl(210, 100%, 35%)' : 'inherit',
              }}
             // onClick={() => console.log(`${item.title} button clicked!`)} // You can add your actual click handler here
              //onClick={() => onDatasetClick(item.dataset_info_id)}
              onClick={() => handleDatasetClick(item.dataset_info_id)}
            >
              <Stack
                direction="column"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  color: 'inherit',
                  p: 4,
                  height: '100%',
                  borderColor: 'hsla(220, 25%, 25%, 0.3)',
                  backgroundColor: 'grey.800',
                }}
              >
                <Box sx={{ opacity: '50%' }}>{item.icon}</Box>
                <div>
                  <Typography gutterBottom sx={{ fontWeight: 'medium', fontSize: '18px' }}>
                    {item.title}
                  </Typography>
                  {/* <Typography variant="body2" sx={{ color: 'grey.400' }}>
                    Name - {item.description}
                  </Typography> */}
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                    Genes - {item.genes}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                  Cells - {item.cells}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                  Datasets - {item.datasets}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                  Cell Types - {item.cell_types}
                  </Typography>
                </div>
              </Stack>
              </ButtonBase>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
