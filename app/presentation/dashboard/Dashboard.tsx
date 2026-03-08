import React from 'react';
import { Box, Toolbar, Stack } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import Topbar from '../ui/Topbar';
import Sidebar from '../ui/Sidebar';
import StatCard from '../ui/StatCard';
import OverviewCharts from './OverviewCharts';
import RecentTransactions from './RecentTransactions';
import MedicosPanel from './MedicosPanel';
import PacientesPanel from './PacientesPanel';
import CitasPanel from './CitasPanel';
import YearlyBreakup from './YearlyBreakup';
import MonthlyEarnings from './MonthlyEarnings';
import ProximasCitas from './ProximasCitas';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

type View = 'dashboard' | 'medicos' | 'pacientes' | 'citas';

export default function Dashboard() {
  const [open, setOpen] = React.useState(true);
  const [view, setView] = React.useState<View>('dashboard');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  React.useEffect(() => {
    if (isMobile) setOpen(false);
  }, [isMobile]);

  const handleSelect = (v: View) => {
    setView(v);
    if (isMobile) setOpen(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Topbar
        onToggle={() => setOpen((s) => !s)}
        sidebarOpen={open}
        isMobile={isMobile}
      />

      <Sidebar
        open={open}
        variant={isMobile ? 'temporary' : 'persistent'}
        onSelect={handleSelect}
        onClose={() => setOpen(false)}
        currentView={view}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          minWidth: 0,
          overflow: 'hidden',
          transition: theme.transitions.create('all', {
            easing: theme.transitions.easing.sharp,
            duration: 300,
          }),
        }}
      >
        <Toolbar sx={{ minHeight: '64px !important' }} />

        {view === 'dashboard' && (
          <Stack spacing={3}>
            {/* KPI cards */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
                gap: 2,
              }}
            >
              <StatCard
                title="Citas Hoy"
                value={24}
                icon={<EventAvailableIcon fontSize="small" />}
                color="#5D87FF"
                trend={{ value: '+3% ayer', positive: true }}
              />
              <StatCard
                title="Médicos Activos"
                value={12}
                icon={<LocalHospitalIcon fontSize="small" />}
                color="#13DEB9"
                trend={{ value: '+1 este mes', positive: true }}
              />
              <StatCard
                title="Pacientes"
                value={1240}
                icon={<PeopleIcon fontSize="small" />}
                color="#FFAE1F"
                trend={{ value: '+18 semana', positive: true }}
              />
              <StatCard
                title="Citas Semana"
                value={58}
                icon={<CalendarTodayIcon fontSize="small" />}
                color="#FA896B"
                subtitle="próximos 7 días"
              />
            </Box>

            {/* Charts */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
                gap: 2,
                alignItems: 'start',
              }}
            >
              <OverviewCharts />
              <Stack spacing={2}>
                <YearlyBreakup />
                <MonthlyEarnings />
              </Stack>
            </Box>

            {/* Activity + Upcoming */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '1fr 2fr' },
                gap: 2,
                alignItems: 'start',
              }}
            >
              <RecentTransactions />
              <ProximasCitas />
            </Box>
          </Stack>
        )}

        {view === 'medicos' && <MedicosPanel />}
        {view === 'pacientes' && <PacientesPanel />}
        {view === 'citas' && <CitasPanel />}
      </Box>
    </Box>
  );
}
