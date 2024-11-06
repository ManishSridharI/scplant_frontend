import * as React from 'react';
import Divider from '@mui/material/Divider';
import Hero from '../components/Hero';
import Data from '../components/Data';
import Models from '../components/Models';

export default function Home(props) {
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