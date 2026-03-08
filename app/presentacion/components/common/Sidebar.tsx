import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  Chip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PeopleIcon from '@mui/icons-material/People';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export const DRAWER_WIDTH = 270;

type View = 'dashboard' | 'medicos' | 'pacientes' | 'citas';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  view: View;
}

const sections: { title: string; items: NavItem[] }[] = [
  {
    title: 'PRINCIPAL',
    items: [
      {
        label: 'Dashboard',
        icon: <DashboardIcon fontSize="small" />,
        view: 'dashboard',
      },
    ],
  },
  {
    title: 'GESTIÓN',
    items: [
      {
        label: 'Médicos',
        icon: <LocalHospitalIcon fontSize="small" />,
        view: 'medicos',
      },
      {
        label: 'Pacientes',
        icon: <PeopleIcon fontSize="small" />,
        view: 'pacientes',
      },
      {
        label: 'Citas',
        icon: <EventAvailableIcon fontSize="small" />,
        view: 'citas',
      },
    ],
  },
];

export default function Sidebar({
  open,
  onSelect,
  onClose,
  currentView,
  variant = 'persistent',
}: {
  open: boolean;
  onSelect: (view: View) => void;
  onClose?: () => void;
  currentView: View;
  variant?: 'persistent' | 'temporary';
}) {
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: '#ffffff',
        borderRight: '1px solid rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 3,
          py: 2.5,
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CalendarMonthIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 800, color: '#2A3547', letterSpacing: '-0.5px' }}
        >
          CUN Citas
        </Typography>
      </Box>

      {/* Nav sections */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, pt: 1.5, pb: 2 }}>
        {sections.map((section) => (
          <Box key={section.title} sx={{ mb: 1 }}>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                fontWeight: 700,
                color: '#7C8FAC',
                letterSpacing: '0.8px',
                fontSize: 11,
                px: 1.5,
                py: 1,
              }}
            >
              {section.title}
            </Typography>
            <List disablePadding>
              {section.items.map((item) => {
                const active = currentView === item.view;
                return (
                  <ListItemButton
                    key={item.view}
                    onClick={() => onSelect(item.view)}
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      px: 1.5,
                      py: 1,
                      bgcolor: active ? '#ECF2FF' : 'transparent',
                      color: active ? '#5D87FF' : '#2A3547',
                      '&:hover': {
                        bgcolor: active ? '#ECF2FF' : '#F6F9FB',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 36,
                        color: active ? '#5D87FF' : '#7C8FAC',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight: active ? 600 : 500,
                      }}
                    />
                    {active && (
                      <Box
                        sx={{
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          bgcolor: '#5D87FF',
                          ml: 1,
                        }}
                      />
                    )}
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width:
          variant === 'persistent' ? (open ? DRAWER_WIDTH : 0) : DRAWER_WIDTH,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          border: 'none',
          overflowX: 'hidden',
          transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1) !important',
          ...(variant === 'persistent' && !open && { width: 0 }),
          boxShadow:
            variant === 'temporary' ? '4px 0 24px rgba(0,0,0,0.08)' : 'none',
        },
      }}
    >
      {content}
    </Drawer>
  );
}
