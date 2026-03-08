// Calendario de citas — por implementar
// Componente para visualización de citas en formato calendario.
import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import type { Cita } from '~/negocio/entidades/Cita';

export default function CalendarioCitas({ citas }: { citas: Cita[] }) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
        Calendario de Citas
      </Typography>
      <Box sx={{ color: '#7C8FAC', textAlign: 'center', py: 4 }}>
        Implementación de vista calendario pendiente ({citas.length} citas)
      </Box>
    </Paper>
  );
}
