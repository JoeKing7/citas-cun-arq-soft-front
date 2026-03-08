import type {
  DashboardStats,
  WeeklyOverviewItem,
  YearlyBreakup,
  MonthlyEarnings,
  ActividadItem,
  ProximaCita,
} from '~/negocio/entidades/Dashboard';
import * as repo from '~/repositorio/implementaciones/DashboardRepository';

export async function getDashboardStatsAsync(): Promise<DashboardStats> {
  return repo.getDashboardStats();
}

export async function getWeeklyOverviewAsync(): Promise<WeeklyOverviewItem[]> {
  return repo.getDashboardOverview();
}

export async function getYearlyBreakupAsync(): Promise<YearlyBreakup> {
  return repo.getYearlyBreakup();
}

export async function getMonthlyEarningsAsync(): Promise<MonthlyEarnings> {
  return repo.getMonthly();
}

export async function getActividadRecienteAsync(): Promise<ActividadItem[]> {
  return repo.getRecentActivity();
}

export async function getProximasCitasAsync(): Promise<ProximaCita[]> {
  return repo.getUpcomingAppointments();
}
