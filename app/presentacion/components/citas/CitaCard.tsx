// Tarjeta de cita — por implementar
import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import type { Cita } from '~/negocio/entidades/Cita';
import Badge from '../common/Badge';

export default function CitaCard({ cita }: { cita: Cita }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {cita.fecha_hora}
          </Typography>
          <Typography variant="caption" sx={{ color: '#7C8FAC' }}>
            {cita.duracion_min} min — {cita.motivo}
          </Typography>
        </Box>
        <Badge estado={cita.estado ?? 'ACTIVA'} />
      </Box>
    </Paper>
  );
}
