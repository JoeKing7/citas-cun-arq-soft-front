import type {
  DashboardStats,
  WeeklyOverviewItem,
  YearlyBreakup,
  MonthlyEarnings,
  ActividadItem,
  ProximaCita,
} from '../../domain/types';
import { fetchJson } from '../../config/api';

export async function getDashboardStatsAsync(): Promise<DashboardStats> {
  return fetchJson('/dashboard/stats');
}

export async function getWeeklyOverviewAsync(): Promise<WeeklyOverviewItem[]> {
  return fetchJson('/dashboard/overview');
}

export async function getYearlyBreakupAsync(): Promise<YearlyBreakup> {
  return fetchJson('/dashboard/yearly-breakup');
}

export async function getMonthlyEarningsAsync(): Promise<MonthlyEarnings> {
  return fetchJson('/dashboard/monthly');
}

export async function getActividadRecienteAsync(): Promise<ActividadItem[]> {
  return fetchJson('/dashboard/actividad-reciente');
}

export async function getProximasCitasAsync(): Promise<ProximaCita[]> {
  return fetchJson('/dashboard/proximas-citas');
}
