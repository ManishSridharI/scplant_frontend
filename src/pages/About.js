import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/system';

const userTestimonials = [
  {
    avatar: <Avatar alt="Trupti Joshi" src="/Trupti.jpg" />,
    name: 'Dr. Trupti Joshi',
    email: "joshitr@health.missouri.edu",
    occupation: 'Associate Professor',
    testimonial:
      "Core Faculty MUIDSI, DPST, LSC, IPG, EECS",
      testimonial2:
      "Department of Biomedical Informatics, Biostatistics and Medical Epidemiology",
  },
  {
    avatar: <Avatar alt="Chunyang Lu" src="chunyang.jpg" />,
    email: "clcdp@missouri.edu",
    name: 'Chunyang Lu',
    occupation: 'PhD Student',
    testimonial:
      "Department of Electrical Engineering and Computer Science",
  },
  {
    avatar: <Avatar alt="Manish Sridhar Immadi" src="/Manish.jpg" />,
    name: 'Manish Sridhar Immadi',
    email: "mizy9@missouri.edu",
    occupation: 'Masters Student',
    testimonial:
      "Department of Electrical Engineering and Computer Science",
  },
  {
    avatar: <Avatar alt="Yen On Chan" src="/Yen.jpg" />,
    name: 'Yen On Chan',
    email: "chanye@missouri.edu",
    occupation: 'PhD Student',
    testimonial:
      "MU Institute for Data Science and Informatics",
      testimonial2:
      "Department of Electrical Engineering and Computer Science",
  },
  {
    avatar: <Avatar alt="Dong Xu" src="/Dong.jpg" />,
    name: 'Dr. Dong Xu',
    email: "xudong@missouri.edu",
    occupation: 'Curators Distinguished Professor',
    testimonial:
      "Collaborator - AAAAS, AIMBE Core Faculty, LAS, IDSI, IPG",
      testimonial2:
      "Department of Biomedical Informatics, Biostatistics and Medical Epidemiology",
  },

];

const whiteLogos = [
  '/MU_StackedMU_1C_REV.jpg',
  '/MU_StackedMU_1C_REV.jpg',
  '/MU_StackedMU_1C_REV.jpg',
  '/MU_StackedMU_1C_REV.jpg',
  '/MU_StackedMU_1C_REV.jpg',
  '/MU_StackedMU_1C_REV.jpg',
];

const darkLogos = [
  '/MU_StackedMU_1C.jpg',
  '/MU_StackedMU_1C.jpg',
  '/MU_StackedMU_1C.jpg',
  '/MU_StackedMU_1C.jpg',
  '/MU_StackedMU_1C.jpg',
  '/MU_StackedMU_1C.jpg',
];

const logoStyle = {
  width: '64px',
  opacity: 0.3,
};

export default function About() {
  const theme = useTheme();
  const logos = theme.palette.mode === 'light' ? darkLogos : whiteLogos;

  return (
    <Container
      id="testimonials"
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
          About Us
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          We are a research development team from Translational Bio-Informatics lab.
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {userTestimonials.map((testimonial, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 6 }} key={index} sx={{ display: 'flex' }}>
            <Card
              variant="outlined"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flexGrow: 1,
              }}
            >
                <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <CardHeader
                  avatar={testimonial.avatar}
                  title={
                    <Typography
                      component="a"
                      href={`mailto:${testimonial.email}`}
                      sx={{
                        textDecoration: 'none',
                        color: 'inherit',
                      }}
                    >
                      {testimonial.name}
                    </Typography>
                  }
                  subheader={testimonial.occupation}
                />
                <img
                  src={logos[index]}
                  alt={`Logo ${index + 1}`}
                  style={logoStyle}
                />
              </Box>
              <CardContent>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ color: 'text.secondary' }}
                >
                  {testimonial.testimonial}
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ color: 'text.secondary' }}
                >
                  {testimonial.testimonial2}
                </Typography>
              </CardContent>
              
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}