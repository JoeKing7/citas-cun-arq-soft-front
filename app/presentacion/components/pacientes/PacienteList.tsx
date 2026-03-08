// Lista de pacientes — por implementar
// Ver implementación completa en presentacion/pages/pacientes/PacientesPage.tsx
import React from 'react';
import { Stack, Paper, Typography, Avatar, Box } from '@mui/material';
import type { Paciente } from '~/negocio/entidades/Paciente';

export default function PacienteList({ pacientes }: { pacientes: Paciente[] }) {
  return (
    <Stack spacing={1}>
      {pacientes.map((p) => {
        const initials = p.nombre
          .split(' ')
          .map((w) => w[0])
          .slice(0, 2)
          .join('')
          .toUpperCase();
        return (
          <Paper
            key={p.id}
            sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}
          >
            <Avatar sx={{ bgcolor: '#FEF5E5', color: '#FFAE1F' }}>
              {initials}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {p.nombre}
              </Typography>
              <Typography variant="caption" sx={{ color: '#7C8FAC' }}>
                {p.documento}
              </Typography>
            </Box>
          </Paper>
        );
      })}
    </Stack>
  );
}
