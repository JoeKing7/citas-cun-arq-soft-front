// Lista de citas — por implementar
// Ver implementación completa en presentacion/pages/citas/CitasPage.tsx
import React from 'react';
import { Stack } from '@mui/material';
import type { Cita } from '~/negocio/entidades/Cita';
import CitaCard from './CitaCard';

export default function CitaList({ citas }: { citas: Cita[] }) {
  return (
    <Stack spacing={1}>
      {citas.map((c) => (
        <CitaCard key={c.id} cita={c} />
      ))}
    </Stack>
  );
}
