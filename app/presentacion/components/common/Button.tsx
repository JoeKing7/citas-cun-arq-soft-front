// Componente Button reutilizable — por implementar
import React from 'react';
import { Button as MuiButton } from '@mui/material';

interface ButtonProps extends React.ComponentProps<typeof MuiButton> {
  children: React.ReactNode;
}

export default function Button({ children, ...props }: ButtonProps) {
  return <MuiButton {...props}>{children}</MuiButton>;
}
