import * as React from 'react';
import Data from '../components/Data';
import Upload from '../components/Upload'
import Divider from '@mui/material/Divider';

export default function Dataset(props) {
  return (
      <div>
        <Data />
        <Divider />
        <Upload />
      </div>
  );
}