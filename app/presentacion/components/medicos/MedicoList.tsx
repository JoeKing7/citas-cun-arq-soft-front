// Lista de médicos — por implementar
// Ver implementación completa en presentacion/pages/medicos/MedicosPage.tsx
import React from 'react';
import { Stack } from '@mui/material';
import type { Medico } from '~/negocio/entidades/Medico';
import MedicoCard from './MedicoCard';

export default function MedicoList({ medicos }: { medicos: Medico[] }) {
  return (
    <Stack spacing={1}>
      {medicos.map((m) => (
        <MedicoCard key={m.id} medico={m} />
      ))}
    </Stack>
  );
}
