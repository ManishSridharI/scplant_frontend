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
    title: 'Arabidopsis thaliana (SRP171040)',
    dataset_info_id: 4,
    dataset_gene_count: 20000,
    description: 'SRP 171',
    genes: '53,678',
    cells: '1.2M',
    datasets: '28',
    cell_types: '50',
  },
  {
    icon: <InsightsIcon />,
    title: 'Arabidopsis thaliana (SRP235541)',
    dataset_info_id: 5,
    dataset_gene_count: 20000,
    description: 'SRP 235',
    genes: '53,678',
    cells: '1.2M',
    datasets: '28',
    cell_types: '50',
  },
  {
    icon: <InsightsIcon />,
    title: 'Arabidopsis thaliana (SRP330542)',
    dataset_info_id: 6,
    dataset_gene_count: 20000,
    description: 'SRP 330',
    genes: '53,678',
    cells: '1.2M',
    datasets: '28',
    cell_types: '50',
  },
  {
    icon: <InsightsIcon />,
    title: 'Zea mays (SRP335180)',
    dataset_info_id: 1,
    description: 'SRP 335',
    dataset_gene_count: 10000,
    genes: '67,300',
    cells: '35K',
    datasets: '9',
    cell_types: '38',
  },
  {
    icon: <InsightsIcon />,
    title: 'Oryza sativa (SRP286275)',
    dataset_info_id: 2,
    description: 'SRP 286',
    dataset_gene_count: 20000,
    genes: '57,623',
    cells: '417K',
    datasets: '5',
    cell_types: '38',
  },
  {
    icon: <InsightsIcon />,
    title: 'Glycine max (in-house dataset)',
    dataset_info_id: 3,
    description: 'Flowerbud',
    dataset_gene_count: 20000,
    genes: '97,824',
    cells: '141K',
    datasets: '11',
    cell_types: '49',
  },
];


export default function Data({ onDatasetClick }) {
  const [selectedId, setSelectedId] = React.useState(null);

  const handleDatasetClick = (datasetId, datasetName, geneCountNumber) => {
    onDatasetClick({ id: datasetId, name: datasetName, geneCountNumber: geneCountNumber});
    setSelectedId(datasetId); // Update the selected ID
    // if (onDatasetClick) {
    //   onDatasetClick(datasetId); // Trigger the parent handler if provided
    // }
  };
  return (
    <Box
      id="pricing"
      sx={{
       pt: { xs: 2, sm: 4 },
        pb: { xs: 4, sm: 8 },
        // color: 'white',
        // bgcolor: 'grey.900',
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
          <Typography component="h6" variant="h6" gutterBottom>
           Public  Datasets
          </Typography>
          {/* <Typography variant="body1" sx={{ color: 'grey.400' }}>
            Upload your own/ use our datasets
          </Typography> */}
        </Box>
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid size={{ xs: 12, sm: 4, md: 4 }} key={index}>
              <ButtonBase
              component="div"
              sx={{
                width: '100%',
                height: "100%",
                textAlign: 'left',
                display: 'block',
                color: selectedId === item.dataset_info_id ? 'hsl(210, 100%, 35%)' : 'inherit',
              }}
             // onClick={() => console.log(`${item.title} button clicked!`)} // You can add your actual click handler here
              //onClick={() => onDatasetClick(item.dataset_info_id)}
              onClick={() => handleDatasetClick(item.dataset_info_id,item.title,item.dataset_gene_count)}
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
                  // backgroundColor: 'grey.800',
                }}
              >
                <Box sx={{ opacity: '50%' }}>{item.icon}</Box>
                <div>
                  <Typography gutterBottom sx={{ fontWeight: 'medium', fontSize: '18px', fontStyle: 'italic' }}>
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
