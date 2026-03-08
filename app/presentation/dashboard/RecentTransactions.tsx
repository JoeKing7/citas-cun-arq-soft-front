import React from 'react';
import { Paper, Typography, Box, Avatar } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const events = [
  {
    time: '09:30 am',
    title: 'Cita confirmada',
    sub: 'Juan Pérez — Dr. Rodríguez',
    icon: <EventAvailableIcon sx={{ fontSize: 16 }} />,
    color: '#13DEB9',
    bg: '#E6FBF7',
  },
  {
    time: '10:00 am',
    title: 'Cita cancelada',
    sub: 'María López — Dra. García',
    icon: <EventBusyIcon sx={{ fontSize: 16 }} />,
    color: '#FA896B',
    bg: '#FEF0EB',
  },
  {
    time: '11:15 am',
    title: 'Nuevo paciente',
    sub: 'Ana Torres registrada',
    icon: <PersonAddIcon sx={{ fontSize: 16 }} />,
    color: '#5D87FF',
    bg: '#ECF2FF',
  },
  {
    time: '12:00 pm',
    title: 'Médico registrado',
    sub: 'Dr. Carlos Muñoz — Cardiología',
    icon: <LocalHospitalIcon sx={{ fontSize: 16 }} />,
    color: '#FFAE1F',
    bg: '#FEF5E5',
  },
  {
    time: '02:30 pm',
    title: 'Cita reprogramada',
    sub: 'Luis Ramírez — Dr. Herrera',
    icon: <EventAvailableIcon sx={{ fontSize: 16 }} />,
    color: '#49BEFF',
    bg: '#E8F7FF',
  },
];

export default function RecentTransactions() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography
        variant="subtitle1"
        fontWeight={700}
        sx={{ color: '#2A3547', mb: 0.5 }}
      >
        Actividad Reciente
      </Typography>
      <Typography
        variant="caption"
        sx={{ color: '#7C8FAC', display: 'block', mb: 2.5 }}
      >
        Últimos eventos del sistema
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {events.map((ev, i) => (
          <Box
            key={i}
            sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}
          >
            {/* Time */}
            <Typography
              variant="caption"
              sx={{
                color: '#7C8FAC',
                minWidth: 64,
                pt: 0.3,
                whiteSpace: 'nowrap',
              }}
            >
              {ev.time}
            </Typography>

            {/* Timeline dot */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                pt: 0.3,
              }}
            >
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: ev.bg,
                  color: ev.color,
                }}
              >
                {ev.icon}
              </Avatar>
              {i < events.length - 1 && (
                <Box
                  sx={{
                    width: 1,
                    flex: 1,
                    bgcolor: 'rgba(0,0,0,0.06)',
                    mt: 0.5,
                    minHeight: 20,
                  }}
                />
              )}
            </Box>

            {/* Content */}
            <Box sx={{ pb: i < events.length - 1 ? 1 : 0 }}>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ color: '#2A3547', lineHeight: 1.3 }}
              >
                {ev.title}
              </Typography>
              <Typography variant="caption" sx={{ color: '#7C8FAC' }}>
                {ev.sub}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
