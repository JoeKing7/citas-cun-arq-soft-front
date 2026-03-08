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
  Button,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const proximas = [
  {
    id: 1,
    paciente: 'Juan Pérez',
    rol: 'Cardiología',
    medico: 'Dr. Rodríguez',
    hora: '09:00 — 09:30',
    estado: 'ACTIVA',
    avatar: 'JP',
    avatarColor: '#ECF2FF',
    avatarText: '#5D87FF',
  },
  {
    id: 2,
    paciente: 'María López',
    rol: 'Pediatría',
    medico: 'Dra. García',
    hora: '10:00 — 10:30',
    estado: 'ACTIVA',
    avatar: 'ML',
    avatarColor: '#FEF5E5',
    avatarText: '#FFAE1F',
  },
  {
    id: 3,
    paciente: 'Carlos Ruiz',
    rol: 'Neurología',
    medico: 'Dr. Herrera',
    hora: '11:00 — 11:45',
    estado: 'CANCELADA',
    avatar: 'CR',
    avatarColor: '#FEF0EB',
    avatarText: '#FA896B',
  },
  {
    id: 4,
    paciente: 'Ana Torres',
    rol: 'Geriatría',
    medico: 'Dra. Muñoz',
    hora: '14:00 — 14:30',
    estado: 'ACTIVA',
    avatar: 'AT',
    avatarColor: '#E6FBF7',
    avatarText: '#13DEB9',
  },
];

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

export default function ProximasCitas() {
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
          {proximas.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: 11,
                      fontWeight: 700,
                      bgcolor: row.avatarColor,
                      color: row.avatarText,
                    }}
                  >
                    {row.avatar}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ color: '#2A3547', lineHeight: 1.2 }}
                    >
                      {row.paciente}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#7C8FAC' }}>
                      {row.rol}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ color: '#2A3547' }}>
                  {row.medico}
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
