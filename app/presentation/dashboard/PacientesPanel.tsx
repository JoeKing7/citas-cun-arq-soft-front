import React from 'react';
import {
  Box,
  Stack,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Table,
  TableHead,
  TableCell,
  TableBody,
  IconButton,
  Snackbar,
  Alert,
  Avatar,
  Tooltip,
  TableRow,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import { v4 as uuid } from 'uuid';
import type { Paciente } from '~/domain/types';
import * as api from '../../application/services';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function PacientesPanel() {
  const [open, setOpen] = React.useState(false);
  const [lista, setLista] = React.useState<Paciente[]>([]);
  const [nombre, setNombre] = React.useState('');
  const [documento, setDocumento] = React.useState('');
  const [correo, setCorreo] = React.useState('');
  const [telefono, setTelefono] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [snack, setSnack] = React.useState<{
    open: boolean;
    message: string;
    severity?: 'success' | 'error';
  }>({ open: false, message: '' });

  React.useEffect(() => {
    (async () => {
      const all = await api.getPacientesAsync();
      setLista(all.filter((p) => p.estado === 'ACTIVO'));
    })();
  }, []);

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleAdd() {
    setError(null);
    // All fields required
    if (
      !nombre.trim() ||
      !documento.trim() ||
      !correo.trim() ||
      !telefono.trim()
    ) {
      setError('Todos los campos obligatorios deben completarse');
      return;
    }
    // Nombre: only letters, spaces and basic accents
    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nombre.trim())) {
      setError('El nombre sólo debe contener letras y espacios');
      return;
    }
    // Documento: digits only, reasonable length
    if (!/^[0-9]{6,11}$/.test(documento.trim())) {
      setError('El documento debe ser numérico (6-11 dígitos)');
      return;
    }
    // Teléfono: digits only, reasonable length
    if (!/^[0-9]{10}$/.test(telefono.trim())) {
      setError('El teléfono debe ser numérico (10 dígitos)');
      return;
    }
    if (!isValidEmail(correo)) {
      setError('Correo inválido');
      return;
    }
    const existing = (await api.getPacientesAsync()).find(
      (p) => p.documento === documento.trim(),
    );
    if (existing) {
      setError('El documento ya está registrado');
      return;
    }
    const p: Paciente = {
      id: uuid(),
      nombre: nombre.trim(),
      documento: documento.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
    } as any;
    await api.createPacienteAsync(p);
    setSnack({
      open: true,
      message: 'Paciente registrado',
      severity: 'success',
    });
    setOpen(false);
    setNombre('');
    setDocumento('');
    setCorreo('');
    setTelefono('');
    const all = await api.getPacientesAsync();
    setLista(all.filter((p) => p.estado === 'ACTIVO'));
  }

  async function handleDelete(id: string) {
    try {
      await api.deletePacienteAsync(id);
      const all = await api.getPacientesAsync();
      setLista(all.filter((p) => p.estado === 'ACTIVO'));
      setSnack({
        open: true,
        message: 'Paciente inactivado',
        severity: 'success',
      });
    } catch (err: any) {
      const message =
        err &&
        (err.message ||
          err?.error ||
          (Array.isArray(err.message) && err.message.join(', ')))
          ? err.message || err.error
          : JSON.stringify(err);
      setSnack({ open: true, message: String(message), severity: 'error' });
    }
  }

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <Avatar
          sx={{ bgcolor: '#FEF5E5', color: '#FFAE1F', width: 40, height: 40 }}
        >
          <PeopleIcon fontSize="small" />
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight={700} sx={{ color: '#2A3547' }}>
            Pacientes
          </Typography>
          <Typography variant="caption" sx={{ color: '#7C8FAC' }}>
            Registra y consulta la información básica de pacientes
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
            Listado de pacientes
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            size="small"
          >
            + Registrar paciente
          </Button>
        </Box>

        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Paciente</TableCell>
                <TableCell>Documento</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lista.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ color: '#7C8FAC', py: 4 }}
                  >
                    No hay pacientes registrados
                  </TableCell>
                </TableRow>
              )}
              {lista.map((p) => (
                <TableRow key={p.id} hover>
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
                          bgcolor: '#FEF5E5',
                          color: '#FFAE1F',
                        }}
                      >
                        {getInitials(p.nombre)}
                      </Avatar>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{ color: '#2A3547' }}
                      >
                        {p.nombre}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ color: '#7C8FAC', fontFamily: 'monospace' }}
                    >
                      {p.documento}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#2A3547' }}>
                      {p.correo}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#7C8FAC' }}>
                      {p.telefono || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Eliminar paciente">
                      <IconButton
                        onClick={() => handleDelete(p.id)}
                        size="small"
                        sx={{
                          color: '#FA896B',
                          '&:hover': { bgcolor: '#FEF0EB' },
                        }}
                        aria-label={`Eliminar ${p.nombre}`}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
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
        <DialogTitle sx={{ fontWeight: 700 }}>Registrar Paciente</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              fullWidth
            />
            <TextField
              label="Documento"
              value={documento}
              onChange={(e) =>
                setDocumento(e.target.value.replace(/[^0-9]/g, ''))
              }
              inputProps={{
                inputMode: 'numeric',
                pattern: '\\d*',
                maxLength: 20,
              }}
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
              onChange={(e) =>
                setTelefono(e.target.value.replace(/[^0-9]/g, ''))
              }
              inputProps={{
                inputMode: 'numeric',
                pattern: '\\d*',
                maxLength: 15,
              }}
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
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snack.severity || 'success'} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
