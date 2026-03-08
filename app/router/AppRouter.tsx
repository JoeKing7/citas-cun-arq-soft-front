/**
 * AppRouter — envuelve el sistema de rutas de React Router v7 (framework mode).
 * Las rutas reales se definen en app/routes.ts; este componente es un punto de
 * entrada lógico para configuración futura de Context o Guard de autenticación.
 */
import React from 'react';
import { Outlet } from 'react-router';

export default function AppRouter() {
  return <Outlet />;
}
