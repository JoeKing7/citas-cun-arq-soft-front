// Componente Spinner de carga — por implementar
import React from 'react';
import { CircularProgress, Box } from '@mui/material';

export default function Spinner({ size = 40 }: { size?: number }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
      <CircularProgress size={size} />
    </Box>
  );
}
