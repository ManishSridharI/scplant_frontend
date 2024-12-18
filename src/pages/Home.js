import * as React from 'react';
import Divider from '@mui/material/Divider';
import Hero from '../components/Hero';
import { useAuth } from '../Auth';
import DataHome from '../components/DataHome';
import ModelsHome from '../components/ModelsHome';

export default function Home(props) {
  const { user } = useAuth();
  const { csrfToken } = useAuth();
  const { authToken } = useAuth();
  if (user) {
    console.log('Welcome', csrfToken);
  }
  return (
      <div>
        <Hero />
        <Divider />
        <DataHome/>
        <Divider />
        <ModelsHome />
      </div>
  );
}