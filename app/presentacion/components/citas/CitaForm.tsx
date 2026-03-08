// Formulario para agendar una cita — por implementar
// Ver implementación completa en presentacion/pages/citas/CitasPage.tsx
import React from 'react';
import { Stack, TextField, Button, MenuItem } from '@mui/material';
import type { Cita } from '~/negocio/entidades/Cita';
import type { Medico } from '~/negocio/entidades/Medico';
import type { Paciente } from '~/negocio/entidades/Paciente';

interface CitaFormProps {
  medicos: Medico[];
  pacientes: Paciente[];
  onSubmit: (data: Omit<Cita, 'id'>) => void;
  loading?: boolean;
  error?: string | null;
}

export default function CitaForm({
  medicos,
  pacientes,
  onSubmit,
  loading,
  error,
}: CitaFormProps) {
  const [idMedico, setIdMedico] = React.useState('');
  const [idPaciente, setIdPaciente] = React.useState('');
  const [fechaHora, setFechaHora] = React.useState('');
  const [duracionMin, setDuracionMin] = React.useState(30);
  const [motivo, setMotivo] = React.useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      id_medico: idMedico,
      id_paciente: idPaciente,
      fecha_hora: fechaHora,
      duracion_min: duracionMin,
      motivo,
    });
  }

  return (
    <Stack component="form" onSubmit={handleSubmit} spacing={2}>
      <TextField
        select
        label="Médico"
        value={idMedico}
        onChange={(e) => setIdMedico(e.target.value)}
        fullWidth
      >
        {medicos.map((m) => (
          <MenuItem key={m.id} value={m.id}>
            {m.nombre} — {m.especialidad}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Paciente"
        value={idPaciente}
        onChange={(e) => setIdPaciente(e.target.value)}
        fullWidth
      >
        {pacientes.map((p) => (
          <MenuItem key={p.id} value={p.id}>
            {p.nombre} — {p.documento}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        type="datetime-local"
        label="Fecha y hora"
        value={fechaHora}
        onChange={(e) => setFechaHora(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
      <TextField
        type="number"
        label="Duración (min)"
        value={duracionMin}
        onChange={(e) => setDuracionMin(Number(e.target.value))}
        fullWidth
      />
      <TextField
        label="Motivo"
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
        multiline
        rows={2}
        fullWidth
      />
      <Button type="submit" variant="contained" disabled={loading}>
        Guardar
      </Button>
    </Stack>
  );
}
