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
    title: 'Arabidopsis thaliana',
    dataset_info_id: 4,
    description: 'SRP 171',
    genes: '53,678',
    cells: '1.2M',
    datasets: '28',
    cell_types: '50',
  },
  {
    icon: <InsightsIcon />,
    title: 'Zea mays ',
    dataset_info_id: 1,
    description: 'SRP 335',
    genes: '67,300',
    cells: '35K',
    datasets: '9',
    cell_types: '38',
  },
  {
    icon: <InsightsIcon />,
    title: 'Oryza sativa ',
    dataset_info_id: 2,
    description: 'SRP 286',
    genes: '57,623',
    cells: '417K',
    datasets: '5',
    cell_types: '38',
  },
  {
    icon: <InsightsIcon />,
    title: 'Glycine max',
    dataset_info_id: 3,
    description: 'Flowerbud',
    genes: '97,824',
    cells: '141K',
    datasets: '11',
    cell_types: '49',
  },
];


export default function DataHome() {
  

  
  return (
    <Box
      id="pricing"
      sx={{
        pt: { xs: 8, sm: 16 },
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
          <Typography component="h2" variant="h4" gutterBottom>
            Datasets
          </Typography>
          <Typography variant="h6" sx={{ color: 'grey.400' }}>
            Use our demo datasets as examples
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid size={{ xs: 12, sm: 3, md: 3 }} key={index}>
              <ButtonBase
              component="div"
              sx={{
                width: '250px',
                height: "100%",
                textAlign: 'left',
                display: 'block',
                color:  'inherit',
              }}
             
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
                  <Typography gutterBottom sx={{ fontWeight: 'medium', fontSize: '18px' , fontStyle: 'italic'}}>
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
