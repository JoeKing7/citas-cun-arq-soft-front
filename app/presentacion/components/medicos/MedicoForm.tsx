// Formulario de médico — por implementar
// Ver implementación completa en presentacion/pages/medicos/MedicosPage.tsx
import React from 'react';
import { Stack, TextField, Button } from '@mui/material';
import type { Medico } from '~/negocio/entidades/Medico';

interface MedicoFormProps {
  onSubmit: (data: Omit<Medico, 'id'>) => void;
  loading?: boolean;
}

export default function MedicoForm({ onSubmit, loading }: MedicoFormProps) {
  const [nombre, setNombre] = React.useState('');
  const [especialidad, setEspecialidad] = React.useState('');
  const [numLicencia, setNumLicencia] = React.useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ nombre, especialidad, num_licencia: numLicencia });
  }

  return (
    <Stack component="form" onSubmit={handleSubmit} spacing={2}>
      <TextField
        label="Nombre completo"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        fullWidth
      />
      <TextField
        label="Especialidad"
        value={especialidad}
        onChange={(e) => setEspecialidad(e.target.value)}
        fullWidth
      />
      <TextField
        label="Nº Licencia"
        value={numLicencia}
        onChange={(e) => setNumLicencia(e.target.value)}
        fullWidth
      />
      <Button type="submit" variant="contained" disabled={loading}>
        Guardar
      </Button>
    </Stack>
  );
}
