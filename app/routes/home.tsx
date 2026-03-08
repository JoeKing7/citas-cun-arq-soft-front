import type { Route } from './+types/home';
import Dashboard from '../presentation/dashboard/Dashboard';

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
  return <Dashboard />;
}
