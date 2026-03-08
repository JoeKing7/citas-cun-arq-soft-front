import { fetchJson } from '../http/axiosClient';

export async function getDashboardStats(): Promise<any> {
  return fetchJson('/dashboard/stats');
}

export async function getDashboardOverview(): Promise<any> {
  return fetchJson('/dashboard/overview');
}

export async function getYearlyBreakup(): Promise<any> {
  return fetchJson('/dashboard/yearly-breakup');
}

export async function getMonthly(): Promise<any> {
  return fetchJson('/dashboard/monthly');
}

export async function getRecentActivity(): Promise<any> {
  return fetchJson('/dashboard/actividad-reciente');
}

export async function getUpcomingAppointments(): Promise<any> {
  return fetchJson('/dashboard/proximas-citas');
}
