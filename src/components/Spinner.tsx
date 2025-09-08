// src/components/Spinner.tsx
import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className='h-6 w-6 animate-spin rounded-full border-2 border-gray-400 border-t-transparent' />
  );
};

export default Spinner;
