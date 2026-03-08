import React from 'react';
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Box,
  Chip,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import type { ProximaCita } from '../../domain/types';

const estadoChip = (estado: string) => {
  if (estado === 'ACTIVA')
    return (
      <Chip
        label="Activa"
        size="small"
        sx={{ bgcolor: '#E6FBF7', color: '#13DEB9', fontWeight: 700 }}
      />
    );
  return (
    <Chip
      label="Cancelada"
      size="small"
      sx={{ bgcolor: '#FEF0EB', color: '#FA896B', fontWeight: 700 }}
    />
  );
};

export default function ProximasCitas({ data }: { data?: ProximaCita[] }) {
  const rows = data && data.length ? data : [];

  return (
    <Paper sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{ color: '#2A3547' }}
          >
            Próximas Citas
          </Typography>
          <Typography variant="caption" sx={{ color: '#7C8FAC' }}>
            Hoy —{' '}
            {new Date().toLocaleDateString('es-CO', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
        </Box>
        <AccessTimeIcon sx={{ color: '#7C8FAC' }} />
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Paciente</TableCell>
            <TableCell>Médico</TableCell>
            <TableCell>Horario</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: 11,
                      fontWeight: 700,
                      bgcolor: '#F3F6F9',
                      color: '#334155',
                    }}
                  >
                    {row.pacienteNombre
                      ?.split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ color: '#2A3547', lineHeight: 1.2 }}
                    >
                      {row.pacienteNombre}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#7C8FAC' }}>
                      {row.especialidad}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ color: '#2A3547' }}>
                  {row.medicoNombre}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{ color: '#7C8FAC', fontSize: 12 }}
                >
                  {row.hora}
                </Typography>
              </TableCell>
              <TableCell>{estadoChip(row.estado)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
