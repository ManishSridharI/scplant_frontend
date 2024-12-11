import * as React from 'react';
import Box from '@mui/material/Box';
import { useAuth } from '../Auth';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function Results(props) {
  

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
          Find and donwload your results here.<br />
        </Typography>
      </Box>
      
    </Container>
      </div>
  );
}