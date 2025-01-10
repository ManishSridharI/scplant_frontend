import * as React from 'react';
import { Link } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import ScPlantIcon from './scPlantIcon';
import ColorModeIconDropdown from './ColorModeIconDropdown';
import { useAuth } from '../Auth';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '16px 24px',
}));

export default function AppAppBar() {
  const { user, logout: authLogout } = useAuth(); 
  const handleLogout = async () => {
    try {
      // const response = await fetch('http://digbio-g2pdeep.rnet.missouri.edu:8449/accounts/api/logout', {
      const response = await fetch('/api/accounts/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json(); // Parse the JSON response

      if (data.isLogout) {
        authLogout(); // Call the logout function from context to update state
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
        height: '70px'
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <Link to="/">
              <ScPlantIcon />
            </Link>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button component={Link} to="/intro" variant="text" color="info" size="large">
                Introduction
              </Button>
              <Button component={Link} to="/dataset" variant="text" color="info" size="large">
                Datasets
              </Button>
              <Button component={Link} to="/model" variant="text" color="info" size="large">
                Models
              </Button>
              <Button component={Link} to="/results" variant="text" color="info" size="large">
                Results
              </Button>
              <Button component={Link} to="/compare" variant="text" color="info" size="large">
                Compare
              </Button>
              <Button variant="text" target="_blank" href="https://github.com/ManishSridharI/scplant_backend" color="info" size="large">
                GitHub
              </Button>
              <Button component={Link} to="/about" variant="text" color="info" size="large" sx={{ minWidth: 0 }}>
                About Us
              </Button>
              {/* <Button component={Link} to="/contact" variant="text" color="info" size="large" sx={{ minWidth: 0 }}>
                Contact
              </Button> */}
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            {user ? (
              <>
              <span style={{color:'black'}}>Hello, {user.first_name}!!</span> {/* Display the user's first name */}
              <Button onClick={handleLogout} color="primary" variant="contained" size="large">
                Log out
              </Button>
            </>
            ) : (
              <>
                <Button component={Link} to="/signin" color="primary" variant="text" size="large">
                  Sign in
                </Button>
                <Button component={Link} to="/signup" color="primary" variant="contained" size="large">
                  Sign up
                </Button>
              </>
            )}
            {/* <Button component={Link} to="/signin" color="primary" variant="text" size="large">
              Sign in
            </Button>
            <Button component={Link} to="/signup" color="primary" variant="contained" size="large">
              Sign up
            </Button> */}
            <ColorModeIconDropdown />
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
