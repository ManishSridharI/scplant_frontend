import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router-dom';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

const tiers = [
  {
    title: 'Regular',
    script: 'Inference',
    id: 1,
    buttonText: 'Select',
    buttonVariant: 'contained',
    buttonColor: 'primary',
  },
  {
    title: 'Regular',
    subheader: 'Our best model',
    script: 'Annotate and Plot',
    id: 2,
    buttonText: 'Select',
    buttonVariant: 'contained',
    buttonColor: 'primary',
  },
  // {
  //   title: 'Regular',
  //   script: 'Control vs Treatment',
  //   id: 3,
  //   buttonText: 'Select',
  //   buttonVariant: 'contained',
  //   buttonColor: 'primary',
  // },
  // {
  //   title: 'Regular',
  //   script: 'Compare Celltype Distribution',
  //   id: 4,
  //   buttonText: 'Select',
  //   buttonVariant: 'contained',
  //   buttonColor: 'primary',
  // },
];

export default function Scripts({ onScriptSelect }) {
  const [selectedScript, setselectedScript] = useState(null);
  const handleButtonClick = (script) => {
    setselectedScript(script); // Update selected model
    if (onScriptSelect) {
      onScriptSelect(script); // Pass the selected model to the parent
    }
  };
  return (
    <Container
      id="pricing"
      sx={{
        pt: { xs: 8, sm: 16 },
        pb: { xs: 6, sm: 8 },
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
          Predictors
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          Choose the type of prediction you need to run. <br />
          
        </Typography>
      </Box>
      <Grid
        container
        spacing={3}
        sx={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}
      >
        {tiers.map((tier) => (
          <Grid
            size={{ xs: 12, sm: tier.title === 'Regular' ? 12 : 6, md: 3 }}
            key={tier.script}
          >
            <Card
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  {/* <Typography component="h3" variant="h6">
                    {tier.title}
                  </Typography> */}
                  {tier.title === 'Accurate' && (
                    <Chip icon={<AutoAwesomeIcon />} label={tier.subheader} />
                  )}
                </Box>
                <Box
                  sx={[
                    {
                      display: 'flex',
                      alignItems: 'baseline',
                    },
                    tier.title === 'Accurate'
                      ? { color: 'grey.50' }
                      : { color: null },
                  ]}
                >
                  <Typography component="h3" variant="h2" sx={{fontSize: "1rem"}}>
                    {tier.script}
                  </Typography>
                  <Typography component="h3" variant="h6">
                    &nbsp; 
                  </Typography>
                </Box>
                {/* <Divider sx={{ my: 2, opacity: 0.8, borderColor: 'divider' }} /> */}
                {/* {tier.description.map((line) => (
                  <Box
                    key={line}
                    sx={{ py: 1, display: 'flex', gap: 1.5, alignItems: 'center' }}
                  >
                    <CheckCircleRoundedIcon
                      sx={[
                        {
                          width: 20,
                        },
                        tier.title === 'Accurate'
                          ? { color: 'primary.light' }
                          : { color: 'primary.main' },
                      ]}
                    />
                    <Typography
                      variant="subtitle2"
                      component={'span'}
                      sx={[
                        tier.title === 'Accurate'
                          ? { color: 'grey.50' }
                          : { color: null },
                      ]}
                    >
                      {line}
                    </Typography>
                  </Box>
                ))} */}
              </CardContent>
              <CardActions>
              <Button
                  fullWidth
                  variant={tier.buttonVariant}
                  color={selectedScript === tier.id ? 'secondary' : tier.buttonColor}
                  onClick={() => handleButtonClick(tier.id)}
                >
                  {selectedScript === tier.id
                    ? 'Selected'
                    : tier.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
