// Tarjeta de médico — por implementar
import React from 'react';
import { Paper, Typography, Avatar, Box, Chip } from '@mui/material';
import type { Medico } from '~/negocio/entidades/Medico';

export default function MedicoCard({ medico }: { medico: Medico }) {
  const initials = medico.nombre
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar sx={{ bgcolor: '#ECF2FF', color: '#5D87FF' }}>{initials}</Avatar>
      <Box>
        <Typography variant="body2" fontWeight={600}>
          {medico.nombre}
        </Typography>
        <Chip label={medico.especialidad} size="small" sx={{ mt: 0.5 }} />
      </Box>
    </Paper>
  );
}
