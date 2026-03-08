import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Badge,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { DRAWER_WIDTH } from './Sidebar';

export default function Topbar({
  onToggle,
  sidebarOpen,
  isMobile,
}: {
  onToggle?: () => void;
  sidebarOpen?: boolean;
  isMobile?: boolean;
}) {
  const theme = useTheme();

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        zIndex: (t) => t.zIndex.drawer + 1,
        bgcolor: '#ffffff',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        width:
          !isMobile && sidebarOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
        ml: !isMobile && sidebarOpen ? `${DRAWER_WIDTH}px` : 0,
        transition: theme.transitions.create(['width', 'margin'], {
          duration: 300,
        }),
      }}
    >
      <Toolbar
        sx={{ px: { xs: 2, sm: 3 }, minHeight: '64px !important', gap: 1 }}
      >
        {/* Hamburger */}
        <Tooltip title={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}>
          <IconButton
            edge="start"
            onClick={onToggle}
            aria-label="toggle sidebar"
            size="medium"
            sx={{ color: '#2A3547' }}
          >
            {sidebarOpen && !isMobile ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
        </Tooltip>

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Notifications */}
        {/* <Tooltip title="Notificaciones">
          <IconButton
            aria-label="notificaciones"
            sx={{
              color: '#2A3547',
              bgcolor: '#F6F9FB',
              borderRadius: 2,
              '&:hover': { bgcolor: '#ECF2FF' },
            }}
          >
            <Badge badgeContent={3} color="error" variant="dot">
              <NotificationsNoneIcon fontSize="small" />
            </Badge>
          </IconButton>
        </Tooltip> */}

        {/* Divider */}
        <Box
          sx={{ width: 1, height: 32, bgcolor: 'rgba(0,0,0,0.08)', mx: 0.5 }}
        />

        {/* Avatar */}
        <Tooltip title="Administrador">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              px: 1,
            }}
          >
            <Avatar
              alt="Admin"
              sx={{
                width: 36,
                height: 36,
                bgcolor: '#5D87FF',
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              A
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ color: '#2A3547', lineHeight: 1.2 }}
              >
                Administrador
              </Typography>
              <Typography variant="caption" sx={{ color: '#7C8FAC' }}>
                admin@cun.edu.co
              </Typography>
            </Box>
          </Box>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
