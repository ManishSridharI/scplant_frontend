import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FacebookIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/X';
import SitemarkIcon from './scPlantIcon';
import ScPlantIconFooter from './scPlantIconFooter';

function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
      {'Copyright © '}
        scPlantAnnotate
      &nbsp;
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 4, sm: 8 },
        py: { xs: 8, sm: 10 },
        textAlign: { sm: 'center', md: 'left' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            minWidth: { xs: '100%', sm: '60%' },
          }}
        >
          <Box sx={{ width: { xs: '100%', sm: '60%' } }}>
            <ScPlantIconFooter />
            <Typography variant="body2" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
              Have questions?
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Connect with us!
            </Typography>
            <InputLabel htmlFor="email-newsletter">Email</InputLabel>
            <Stack direction="row" spacing={1} useFlexGap>
              <TextField
                id="email-newsletter"
                hiddenLabel
                size="small"
                variant="outlined"
                fullWidth
                aria-label="Enter your email address"
                placeholder="Your email address"
                slotProps={{
                  htmlInput: {
                    autoComplete: 'off',
                    'aria-label': 'Enter your email address',
                  },
                }}
                sx={{ width: '250px' }}
              />
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ flexShrink: 0 }}
              >
                Send
              </Button>
            </Stack>
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            Other Products
          </Typography>
          <Link color="text.secondary" variant="body2" target="_blank" href="https://g2pdeep.org/">
            G2PDeep
          </Link>
          <Link color="text.secondary" variant="body2" target="_blank" href="https://irnet.missouri.edu/">
            IRNet
          </Link>
          <Link color="text.secondary" variant="body2" target="_blank" href="https://kbcommons.org/">
            KBCommons
          </Link>
          <Link color="text.secondary" variant="body2" target="_blank" href="https://soykb.org/">
            SoyKB
          </Link>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            Company
          </Typography>
          <Link color="text.secondary" variant="body2" href="/about">
            About us
          </Link>
          <Link color="text.secondary" variant="body2" href="/contact">
            Contact
          </Link>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            Team
          </Typography>
          <Typography color="text.secondary" variant="body2" href="#">
            Trupti Joshi
          </Typography>
          <Typography color="text.secondary" variant="body2" href="#">
            Chunyang Lu
          </Typography>
          <Typography color="text.secondary" variant="body2" href="#">
            Manish Sridhar Immadi
          </Typography>
          <Typography color="text.secondary" variant="body2" href="#">
            Yen On Chan
          </Typography>
          
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          pt: { xs: 4, sm: 8 },
          width: '100%',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
       
        
          <Copyright />
        
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{ justifyContent: 'left', color: 'text.secondary' }}
        >
          <img 
            src="MUlogo.png" 
            alt="Logo" 
            style={{ width: '200px', height: '40px', alignSelf: 'center' }} 
          />
          <IconButton
            color="inherit"
            size="small"
            target="_blank"
            href="https://github.com/ManishSridharI/scplant_backend"
            aria-label="GitHub"
            sx={{ alignSelf: 'center' }}
          >
            <FacebookIcon />
          </IconButton>
          <IconButton
            color="inherit"
            size="small"
            target="_blank"
            href="https://x.com/mizzou"
            aria-label="X"
            sx={{ alignSelf: 'center' }}
          >
            <TwitterIcon />
          </IconButton>
          <IconButton
            color="inherit"
            size="small"
            target="_blank"
            href="https://www.linkedin.com/school/university-of-missouri/"
            aria-label="LinkedIn"
            sx={{ alignSelf: 'center' }}
          >
            <LinkedInIcon />
          </IconButton>
        </Stack>
      </Box>
    </Container>
  );
}
