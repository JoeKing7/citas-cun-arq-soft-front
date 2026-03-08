import React from 'react';
import { Paper, Typography, Box, Avatar } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import type { ActividadItem } from '~/negocio/entidades';

function iconForTipo(tipo: ActividadItem['tipo']) {
  switch (tipo) {
    case 'cita_creada':
    case 'cita_reprogramada':
      return <EventAvailableIcon sx={{ fontSize: 16 }} />;
    case 'cita_cancelada':
      return <EventBusyIcon sx={{ fontSize: 16 }} />;
    case 'paciente_registrado':
      return <PersonAddIcon sx={{ fontSize: 16 }} />;
    case 'medico_agregado':
      return <LocalHospitalIcon sx={{ fontSize: 16 }} />;
    default:
      return <EventAvailableIcon sx={{ fontSize: 16 }} />;
  }
}

export default function RecentTransactions({
  data,
}: {
  data?: ActividadItem[];
}) {
  const items = (data && data.length ? data : []).map((it) => {
    const time = it.tiempo ? new Date(it.tiempo).toLocaleString('es-CO') : '';
    let title = '';
    const sub = it.descripcion;
    switch (it.tipo) {
      case 'cita_creada':
        title = 'Cita creada';
        break;
      case 'cita_cancelada':
        title = 'Cita cancelada';
        break;
      case 'paciente_registrado':
        title = 'Paciente registrado';
        break;
      case 'medico_agregado':
        title = 'Médico registrado';
        break;
      case 'cita_reprogramada':
        title = 'Cita reprogramada';
        break;
      default:
        title = 'Actividad';
    }
    return { time, title, sub, icon: iconForTipo(it.tipo) };
  });

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
        {items.map((ev, i) => (
          <Box
            key={i}
            sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}
          >
            <Typography
              variant="caption"
              sx={{
                color: '#7C8FAC',
                minWidth: 120,
                pt: 0.3,
                whiteSpace: 'nowrap',
              }}
            >
              {ev.time}
            </Typography>

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
                  bgcolor: '#F5F7FA',
                  color: '#4B5563',
                }}
              >
                {ev.icon}
              </Avatar>
              {i < items.length - 1 && (
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

            <Box sx={{ pb: i < items.length - 1 ? 1 : 0 }}>
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
