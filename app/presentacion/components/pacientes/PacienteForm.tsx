// Formulario de paciente — por implementar
// Ver implementación completa en presentacion/pages/pacientes/PacientesPage.tsx
import React from 'react';
import { Stack, TextField, Button } from '@mui/material';
import type { Paciente } from '~/negocio/entidades/Paciente';

interface PacienteFormProps {
  onSubmit: (data: Omit<Paciente, 'id'>) => void;
  loading?: boolean;
}

export default function PacienteForm({ onSubmit, loading }: PacienteFormProps) {
  const [nombre, setNombre] = React.useState('');
  const [documento, setDocumento] = React.useState('');
  const [correo, setCorreo] = React.useState('');
  const [telefono, setTelefono] = React.useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ nombre, documento, correo, telefono });
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
        label="Documento"
        value={documento}
        onChange={(e) => setDocumento(e.target.value)}
        fullWidth
      />
      <TextField
        label="Correo"
        type="email"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        fullWidth
      />
      <TextField
        label="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        fullWidth
      />
      <Button type="submit" variant="contained" disabled={loading}>
        Guardar
      </Button>
    </Stack>
  );
}
