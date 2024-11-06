import * as React from 'react';
import Divider from '@mui/material/Divider';
import Hero from '../components/Hero';
import Data from '../components/Data';
import Models from '../components/Models';
import { useAuth } from '../Auth';

export default function Home(props) {
  const { user } = useAuth();
  if (user) {
    console.log('Welcome', user.first_name);
  }
  return (
      <div>
        <Hero />
        <Divider />
        <Data />
        <Divider />
        <Models />
      </div>
  );
}