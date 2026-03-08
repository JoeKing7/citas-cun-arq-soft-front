// Badge para indicar el estado de una cita — por implementar
import React from 'react';
import { Chip } from '@mui/material';
import type { EstadoCita } from '~/negocio/enums/EstadoCita';

const CONFIG: Record<string, { bg: string; color: string; label: string }> = {
  ACTIVA: { bg: '#E6FBF7', color: '#13DEB9', label: 'Activa' },
  CANCELADA: { bg: '#FEF0EB', color: '#FA896B', label: 'Cancelada' },
  COMPLETADA: { bg: '#ECF2FF', color: '#5D87FF', label: 'Completada' },
  REPROGRAMADA: { bg: '#FEF5E5', color: '#FFAE1F', label: 'Reprogramada' },
};

export default function Badge({ estado }: { estado: string }) {
  const cfg = CONFIG[estado] ?? CONFIG['ACTIVA'];
  return (
    <Chip
      label={cfg.label}
      size="small"
      sx={{ bgcolor: cfg.bg, color: cfg.color, fontWeight: 700 }}
    />
  );
}
