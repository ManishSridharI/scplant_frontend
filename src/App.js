import * as React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppAppBar from './components/AppAppBar';
// import Hero from './components/Hero';
// import LogoCollection from './components/LogoCollection';
// import Highlights from './components/Highlights';
// import Pricing from './components/Pricing';
// import Features from './components/Features';
// import Testimonials from './components/Testimonials';
// import FAQ from './components/FAQ';
import Footer from './components/Footer';
import AppTheme from './AppTheme';
import Home from './pages/Home';
import Intro from './pages/Intro';
import Dataset from './pages/Dataset'
import Model from './pages/Model';
import About from './pages/About';
import ContactForm from './pages/Contact';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { AuthProvider } from './Auth';


export default function App(props) {
  return (
    <Router>
      <AuthProvider>
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <AppAppBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/dataset" element={<Dataset />} />
          <Route path="/model" element={<Model />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
        <Divider />
        <Footer />
      </AppTheme>
      </AuthProvider>
    </Router>
  );
}
