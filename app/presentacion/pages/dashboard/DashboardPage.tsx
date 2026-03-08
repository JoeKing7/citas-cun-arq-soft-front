import React from 'react';
import { Box, Toolbar, Stack } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import Topbar from '../../components/common/Topbar';
import Sidebar from '../../components/common/Sidebar';
import StatCard from '../../components/common/StatCard';
import OverviewCharts from './OverviewCharts';
import RecentTransactions from './RecentTransactions';
import MedicosPage from '../medicos/MedicosPage';
import PacientesPage from '../pacientes/PacientesPage';
import CitasPage from '../citas/CitasPage';
import YearlyBreakupChart from './YearlyBreakup';
import MonthlyEarningsChart from './MonthlyEarnings';
import ProximasCitas from './ProximasCitas';
import * as api from '~/aplicacion/hooks';
import type {
  DashboardStats as DashboardStatsType,
  WeeklyOverviewItem as WeeklyOverviewItemType,
  YearlyBreakup as YearlyBreakupType,
  MonthlyEarnings as MonthlyEarningsType,
  ActividadItem as ActividadItemType,
  ProximaCita as ProximaCitaType,
} from '~/negocio/entidades';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

type View = 'dashboard' | 'medicos' | 'pacientes' | 'citas';

export default function DashboardPage() {
  const [open, setOpen] = React.useState(true);
  const [view, setView] = React.useState<View>('dashboard');
  const initialStats: DashboardStatsType = {
    citasHoy: 0,
    medicosActivos: 0,
    totalPacientes: 0,
    citasSemana: 0,
    tendencias: { citasHoy: '', medicos: '', pacientes: '' },
  };
  const [stats, setStats] = React.useState<DashboardStatsType>(initialStats);
  const [overview, setOverview] = React.useState<WeeklyOverviewItemType[]>([]);
  const [yearly, setYearly] = React.useState<YearlyBreakupType>({
    activas: 0,
    canceladas: 0,
    year: new Date().getFullYear(),
  });
  const [monthly, setMonthly] = React.useState<MonthlyEarningsType>({
    total: 0,
    sparkline: [],
  });
  const [actividad, setActividad] = React.useState<ActividadItemType[]>([]);
  const [proximas, setProximas] = React.useState<ProximaCitaType[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  React.useEffect(() => {
    if (isMobile) setOpen(false);
  }, [isMobile]);

  const handleSelect = (v: View) => {
    setView(v);
    if (isMobile) setOpen(false);
  };

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res: any = await api.getDashboardStatsAsync();
        if (!mounted) return;
        setStats({
          citasHoy: res.citasHoy ?? 0,
          medicosActivos: res.medicosActivos ?? 0,
          totalPacientes: res.totalPacientes ?? 0,
          citasSemana: res.citasSemana ?? 0,
          tendencias: res.tendencias ?? {
            citasHoy: '',
            medicos: '',
            pacientes: '',
          },
        });
        setOverview((res.graficoBarras as WeeklyOverviewItemType[]) ?? []);
        setYearly(
          (res['anual-breakup'] as YearlyBreakupType) ?? {
            activas: 0,
            canceladas: 0,
            year: new Date().getFullYear(),
          },
        );
        setMonthly(
          (res.sparklineMensual as MonthlyEarningsType) ?? {
            total: 0,
            sparkline: [],
          },
        );
        setActividad((res['actividad-reciente'] as ActividadItemType[]) ?? []);
        setProximas((res['proximas-citas'] as ProximaCitaType[]) ?? []);
      } catch {
        // mantener defaults si la API falla
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

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
                value={stats.citasHoy}
                icon={<EventAvailableIcon fontSize="small" />}
                color="#5D87FF"
                trend={{ value: stats.tendencias.citasHoy, positive: true }}
              />
              <StatCard
                title="Médicos Activos"
                value={stats.medicosActivos}
                icon={<LocalHospitalIcon fontSize="small" />}
                color="#13DEB9"
                trend={{ value: stats.tendencias.medicos, positive: true }}
              />
              <StatCard
                title="Pacientes"
                value={stats.totalPacientes}
                icon={<PeopleIcon fontSize="small" />}
                color="#FFAE1F"
                trend={{ value: stats.tendencias.pacientes, positive: true }}
              />
              <StatCard
                title="Citas Semana"
                value={stats.citasSemana}
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
              <OverviewCharts data={overview} />
              <Stack spacing={2}>
                <YearlyBreakupChart data={yearly} />
                <MonthlyEarningsChart data={monthly} />
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
              <RecentTransactions data={actividad} />
              <ProximasCitas data={proximas} />
            </Box>
          </Stack>
        )}

        {view === 'medicos' && <MedicosPage />}
        {view === 'pacientes' && <PacientesPage />}
        {view === 'citas' && <CitasPage />}
      </Box>
    </Box>
  );
}
