import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Snackbar,
  Alert,
  Avatar,
  Chip,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { v4 as uuid } from 'uuid';
import type { Medico } from '../../repository/storage';
import * as api from '../../application/services/api';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const SPECIALTY_COLORS: Record<string, { bg: string; text: string }> = {
  default: { bg: '#ECF2FF', text: '#5D87FF' },
  Cardiología: { bg: '#FEF0EB', text: '#FA896B' },
  Pediatría: { bg: '#FEF5E5', text: '#FFAE1F' },
  Neurología: { bg: '#E6FBF7', text: '#13DEB9' },
};

function specialtyColor(esp: string) {
  return SPECIALTY_COLORS[esp] || SPECIALTY_COLORS.default;
}

export default function MedicosPanel() {
  const [open, setOpen] = React.useState(false);
  const [lista, setLista] = React.useState<Medico[]>([]);
  const [nombre, setNombre] = React.useState('');
  const [especialidad, setEspecialidad] = React.useState('');
  const [numLicencia, setNumLicencia] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [snack, setSnack] = React.useState<{
    open: boolean;
    message: string;
    severity?: 'success' | 'error';
  }>({ open: false, message: '' });

  React.useEffect(() => {
    (async () => setLista(await api.getMedicosAsync()))();
  }, []);

  async function refresh() {
    setLista(await api.getMedicosAsync());
  }

  async function handleAdd() {
    setError(null);
    if (!nombre.trim() || !especialidad.trim() || !numLicencia.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }
    const existing = lista.find((x) => x.num_licencia === numLicencia.trim());
    if (existing) {
      setError('El número de licencia ya está registrado');
      return;
    }
    const m: Medico = {
      id: uuid(),
      nombre: nombre.trim(),
      especialidad: especialidad.trim(),
      num_licencia: numLicencia.trim(),
    } as any;
    await api.createMedicoAsync(m);
    setSnack({ open: true, message: 'Médico registrado', severity: 'success' });
    setOpen(false);
    setNombre('');
    setEspecialidad('');
    setNumLicencia('');
    refresh();
  }

  async function handleDelete(id: string) {
    await api.deleteMedicoAsync(id);
    refresh();
    setSnack({ open: true, message: 'Médico eliminado', severity: 'success' });
  }

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <Avatar
          sx={{ bgcolor: '#ECF2FF', color: '#5D87FF', width: 40, height: 40 }}
        >
          <LocalHospitalIcon fontSize="small" />
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight={700} sx={{ color: '#2A3547' }}>
            Médicos
          </Typography>
          <Typography variant="caption" sx={{ color: '#7C8FAC' }}>
            Gestiona los profesionales y sus especialidades
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
            Listado de médicos
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            size="small"
          >
            + Registrar médico
          </Button>
        </Box>

        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Médico</TableCell>
                <TableCell>Especialidad</TableCell>
                <TableCell>Nº Licencia</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lista.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                    sx={{ color: '#7C8FAC', py: 4 }}
                  >
                    No hay médicos registrados
                  </TableCell>
                </TableRow>
              )}
              {lista.map((m) => {
                const col = specialtyColor(m.especialidad);
                return (
                  <TableRow key={m.id} hover>
                    <TableCell>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            fontSize: 11,
                            fontWeight: 700,
                            bgcolor: '#ECF2FF',
                            color: '#5D87FF',
                          }}
                        >
                          {getInitials(m.nombre)}
                        </Avatar>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{ color: '#2A3547' }}
                        >
                          {m.nombre}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={m.especialidad}
                        size="small"
                        sx={{
                          bgcolor: col.bg,
                          color: col.text,
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: '#7C8FAC', fontFamily: 'monospace' }}
                      >
                        {m.num_licencia}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Eliminar médico">
                        <IconButton
                          onClick={() => handleDelete(m.id)}
                          size="small"
                          sx={{
                            color: '#FA896B',
                            '&:hover': { bgcolor: '#FEF0EB' },
                          }}
                          aria-label={`Eliminar ${m.nombre}`}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Paper>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Registrar Médico</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
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
              label="Número de licencia"
              value={numLicencia}
              onChange={(e) => setNumLicencia(e.target.value)}
              fullWidth
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
