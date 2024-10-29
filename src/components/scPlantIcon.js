import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

export default function ScPlantIcon() {
  return (
    <SvgIcon sx={{ height: 21, width: 100, mr: 2 }}>
      <svg
        width={100}
        height={19}
        viewBox="0 0 90 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* EcoTwoTone Icon (Blue, Green, and White) */}
        <g>
          <circle cx="10" cy="10" r="9" fill="#4876EE" /> {/* Outer blue circle */}
          <path 
            d="M7 10C7 12.2 8.8 14 11 14C13.2 14 15 12.2 15 10C15 7.8 13.2 6 11 6C9.8 6 8.7 6.6 8 7.5C7.3 8.4 7 9.2 7 10Z" 
            fill="#00D3AB" 
          /> {/* Green leaf */}
          <path 
            d="M11 8C12.1 8 13 8.9 13 10C13 11.1 12.1 12 11 12C9.9 12 9 11.1 9 10C9 8.9 9.9 8 11 8Z" 
            fill="white" 
          /> {/* White inner circle */}
        </g>

        {/* scPlant Text */}
        <text
          x="22"
          y="15"
          fill="#4876EE"
          fontFamily="'Inter', sans-serif"
          fontSize="18"
          fontWeight="bold"
        >
          scPlant
        </text>
      </svg>
    </SvgIcon>
  );
}
