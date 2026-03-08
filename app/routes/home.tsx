import type { Route } from './+types/home';
import DashboardPage from '../presentacion/pages/dashboard/DashboardPage';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Panel Administrativo - Clínica' },
    {
      name: 'description',
      content:
        'Dashboard administrativo para gestionar médicos, pacientes y citas.',
    },
  ];
}

export default function Home() {
  return <DashboardPage />;
}
