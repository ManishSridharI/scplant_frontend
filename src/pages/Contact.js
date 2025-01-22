import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InsightsIcon from '@mui/icons-material/Insights';
import ButtonBase from '@mui/material/ButtonBase'
import EmailIcon from '@mui/icons-material/Email';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';

export default function Data() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 8, sm: 16 },
        pb: { xs: 8, sm: 16 },
        color: 'black',
     //   bgcolor: 'grey.900',
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
            Contact Us
          </Typography>
          <Typography variant="h6" sx={{ marginTop:'1.5rem', color: 'grey.400' }}>
             Our Location <GpsFixedIcon />
          </Typography>
          <Typography component="h4" variant="h4" gutterBottom sx={{ marginTop:'1rem', fontSize: '1rem' }}>
          Math Science Builing, University of Missouri
          </Typography>
          <Typography component="h4" variant="h4" gutterBottom sx={{ fontSize: '1rem' }}>
          Columbia, Missouri
          </Typography>
          <Typography variant="h6" sx={{ marginTop:'2rem',color: 'grey.400' }}>
             Email your queries and feedback to below
          </Typography>
          <Typography component="h4" variant="h4" gutterBottom sx={{ marginTop:'1rem', fontSize: '1rem' }}>
          <a href="mailto:JoshiTr@missouri.edu" style={{ color: 'inherit'}}><EmailIcon />&nbsp;Trupti Joshi</a>
          </Typography>
          <Typography component="h4" variant="h4" gutterBottom sx={{ fontSize: '1rem' }}>
          <a href="mailto:clcdp@missouri.edu" style={{ color: 'inherit'}}><EmailIcon />&nbsp;Chunyang Lu</a>
          </Typography>
        </Box>
        
      </Container>
    </Box>
  );
}
