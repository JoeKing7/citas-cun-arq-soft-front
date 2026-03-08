import React from 'react';
import {
  Stack,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Snackbar,
  Alert,
  Box,
  Avatar,
  Chip,
  Tooltip,
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { v4 as uuid } from 'uuid';
import * as api from '../../application/services/api';
import type { Cita, Medico, Paciente } from '../../repository/storage';

export default function CitasPanel() {
  const [open, setOpen] = React.useState(false);
  const [medicos, setMedicos] = React.useState<Medico[]>([]);
  const [pacientes, setPacientes] = React.useState<Paciente[]>([]);
  const [idMedico, setIdMedico] = React.useState('');
  const [idPaciente, setIdPaciente] = React.useState('');
  const [fechaHora, setFechaHora] = React.useState('');
  const [duracion, setDuracion] = React.useState(30);
  const [motivo, setMotivo] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [snack, setSnack] = React.useState<{
    open: boolean;
    message: string;
    severity?: 'success' | 'error';
  }>({ open: false, message: '' });
  const [citas, setCitas] = React.useState<Cita[]>([]);
  const [reprogOpen, setReprogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Cita | null>(null);

  async function handleAdd() {
    if (!idMedico || !idPaciente || !fechaHora) {
      setError('Complete todos los campos obligatorios');
      return;
    }
    const dt = new Date(fechaHora);
    if (isNaN(dt.getTime())) {
      setError('Fecha inválida');
      return;
    }
    const now = new Date();
    if (dt < now) {
      setError('No se puede agendar en el pasado');
      return;
    }
    if (duracion < 15 || duracion > 120) {
      setError('Duración debe estar entre 15 y 120 minutos');
      return;
    }
    if (await api.hasConflictAsync(idMedico, fechaHora, duracion)) {
      setError('El médico tiene un solapamiento con otra cita');
      return;
    }

    const c: Cita = {
      id: uuid(),
      id_medico: idMedico,
      id_paciente: idPaciente,
      fecha_hora: fechaHora,
      duracion_min: duracion,
      motivo,
      estado: 'ACTIVA',
    } as any;
    await api.createCitaAsync(c);
    setCitas(await api.getCitasAsync());
    setSnack({ open: true, message: 'Cita agendada', severity: 'success' });
    setOpen(false);
    setIdMedico('');
    setIdPaciente('');
    setFechaHora('');
    setDuracion(30);
    setMotivo('');
    setError(null);
  }

  async function handleCancel(id: string) {
    await api.cancelCitaAsync(id);
    setCitas(await api.getCitasAsync());
    setSnack({ open: true, message: 'Cita cancelada', severity: 'success' });
  }

  function openReprogram(c: Cita) {
    setEditing(c);
    setReprogOpen(true);
  }

  async function handleReprogram() {
    if (!editing) return;
    if (!editing.fecha_hora) return;
    const dt = new Date(editing.fecha_hora);
    if (isNaN(dt.getTime())) {
      setError('Fecha inválida');
      return;
    }
    const now = new Date();
    if (dt < now) {
      setError('No se puede agendar en el pasado');
      return;
    }
    if (editing.duracion_min < 15 || editing.duracion_min > 120) {
      setError('Duración debe estar entre 15 y 120 minutos');
      return;
    }
    if (
      await api.hasConflictAsync(
        editing.id_medico,
        editing.fecha_hora,
        editing.duracion_min,
        editing.id,
      )
    ) {
      setError('Conflicto con otra cita');
      return;
    }
    await api.updateCitaAsync(editing.id, {
      fecha_hora: editing.fecha_hora,
      duracion_min: editing.duracion_min,
      motivo: editing.motivo,
    });
    setCitas(await api.getCitasAsync());
    setReprogOpen(false);
    setEditing(null);
    setSnack({ open: true, message: 'Cita reprogramada', severity: 'success' });
  }

  React.useEffect(() => {
    (async () => {
      setMedicos(await api.getMedicosAsync());
      setPacientes(await api.getPacientesAsync());
      setCitas(await api.getCitasAsync());
    })();
  }, []);

  return (
    <Stack spacing={2}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <Avatar
          sx={{ bgcolor: '#E6FBF7', color: '#13DEB9', width: 40, height: 40 }}
        >
          <EventAvailableIcon fontSize="small" />
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight={700} sx={{ color: '#2A3547' }}>
            Citas
          </Typography>
          <Typography variant="caption" sx={{ color: '#7C8FAC' }}>
            Agenda, reprograma y cancela citas médicas
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{ color: '#2A3547' }}
          >
            Listado de citas
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            size="small"
          >
            + Agendar cita
          </Button>
        </Box>

        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Paciente</TableCell>
                <TableCell>Médico</TableCell>
                <TableCell>Fecha y hora</TableCell>
                <TableCell>Duración</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {citas.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{ color: '#7C8FAC', py: 4 }}
                  >
                    No hay citas registradas
                  </TableCell>
                </TableRow>
              )}
              {citas.map((c) => {
                const med = medicos.find((m) => m.id === c.id_medico);
                const pac = pacientes.find((p) => p.id === c.id_paciente);
                const isActive = c.estado !== 'CANCELADA';
                return (
                  <TableRow key={c.id} hover>
                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{ color: '#2A3547' }}
                      >
                        {pac ? pac.nombre : c.id_paciente}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#2A3547' }}>
                          {med ? med.nombre : c.id_medico}
                        </Typography>
                        {med && (
                          <Typography
                            variant="caption"
                            sx={{ color: '#7C8FAC' }}
                          >
                            {med.especialidad}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: '#7C8FAC', fontSize: 12 }}
                      >
                        {c.fecha_hora}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#7C8FAC' }}>
                        {c.duracion_min} min
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {isActive ? (
                        <Chip
                          label="Activa"
                          size="small"
                          sx={{
                            bgcolor: '#E6FBF7',
                            color: '#13DEB9',
                            fontWeight: 700,
                          }}
                        />
                      ) : (
                        <Chip
                          label="Cancelada"
                          size="small"
                          sx={{
                            bgcolor: '#FEF0EB',
                            color: '#FA896B',
                            fontWeight: 700,
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {isActive && (
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 0.5,
                            justifyContent: 'flex-end',
                          }}
                        >
                          <Tooltip title="Reprogramar">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => openReprogram(c)}
                              sx={{
                                fontSize: 11,
                                py: 0.25,
                                minWidth: 0,
                                px: 1,
                              }}
                            >
                              Reprog.
                            </Button>
                          </Tooltip>
                          <Tooltip title="Cancelar cita">
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleCancel(c.id)}
                              sx={{
                                fontSize: 11,
                                py: 0.25,
                                minWidth: 0,
                                px: 1,
                              }}
                            >
                              Cancelar
                            </Button>
                          </Tooltip>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Paper>

      {/* Agendar dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Agendar Cita</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
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
              value={duracion}
              onChange={(e) => setDuracion(Number(e.target.value))}
              fullWidth
            />
            <TextField
              label="Motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              fullWidth
              multiline
              rows={2}
            />
            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} variant="outlined">
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleAdd}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reprogramar dialog */}
      <Dialog
        open={reprogOpen}
        onClose={() => {
          setReprogOpen(false);
          setEditing(null);
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Reprogramar Cita</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              select
              label="Médico"
              value={editing?.id_medico || ''}
              disabled
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
              value={editing?.id_paciente || ''}
              disabled
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
              value={editing?.fecha_hora || ''}
              onChange={(e) =>
                setEditing(
                  editing
                    ? { ...editing, fecha_hora: e.target.value }
                    : editing,
                )
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              type="number"
              label="Duración (min)"
              value={editing?.duracion_min || 30}
              onChange={(e) =>
                setEditing(
                  editing
                    ? { ...editing, duracion_min: Number(e.target.value) }
                    : editing,
                )
              }
              fullWidth
            />
            <TextField
              label="Motivo"
              value={editing?.motivo || ''}
              onChange={(e) =>
                setEditing(
                  editing ? { ...editing, motivo: e.target.value } : editing,
                )
              }
              fullWidth
              multiline
              rows={2}
            />
            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setReprogOpen(false);
              setEditing(null);
            }}
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleReprogram}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert severity={snack.severity || 'success'} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
