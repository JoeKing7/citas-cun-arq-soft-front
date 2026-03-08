// Componente Modal reutilizable — por implementar
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  actions,
}: ModalProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {title && <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>}
      <DialogContent>{children}</DialogContent>
      {actions && (
        <DialogActions sx={{ px: 3, pb: 2 }}>{actions}</DialogActions>
      )}
    </Dialog>
  );
}
