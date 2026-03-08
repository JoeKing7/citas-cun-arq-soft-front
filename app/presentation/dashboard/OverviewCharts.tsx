import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Paper, Box, Typography, Select, MenuItem } from '@mui/material';

const sample = [
  { name: 'Lun', activas: 12, canceladas: 3 },
  { name: 'Mar', activas: 18, canceladas: 5 },
  { name: 'Mié', activas: 15, canceladas: 2 },
  { name: 'Jue', activas: 24, canceladas: 6 },
  { name: 'Vie', activas: 20, canceladas: 4 },
  { name: 'Sáb', activas: 8, canceladas: 1 },
  { name: 'Dom', activas: 4, canceladas: 1 },
];

export default function OverviewCharts() {
  const [period, setPeriod] = React.useState('Semana');

  return (
    <Paper sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{ color: '#2A3547' }}
          >
            Resumen de Citas
          </Typography>
          <Typography variant="caption" sx={{ color: '#7C8FAC' }}>
            Distribución semanal de citas activas y canceladas
          </Typography>
        </Box>
        <Select
          size="small"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          sx={{
            fontSize: 13,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0,0,0,0.12)',
            },
            borderRadius: 2,
          }}
        >
          <MenuItem value="Semana">Esta semana</MenuItem>
          <MenuItem value="Mes">Este mes</MenuItem>
          <MenuItem value="Año">Este año</MenuItem>
        </Select>
      </Box>
      <Box sx={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sample} barGap={4} barCategoryGap="30%">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(0,0,0,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: '#7C8FAC' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#7C8FAC' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                border: 'none',
                borderRadius: 8,
                boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                fontSize: 12,
              }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, color: '#7C8FAC', paddingTop: 8 }}
            />
            <Bar
              dataKey="activas"
              name="Activas"
              fill="#5D87FF"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="canceladas"
              name="Canceladas"
              fill="#49BEFF"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
