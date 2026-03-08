import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Paper, Typography, Box } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const data = [
  { name: 'Activas', value: 68 },
  { name: 'Canceladas', value: 32 },
];

const COLORS = ['#5D87FF', '#ECF2FF'];

export default function YearlyBreakup() {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography
        variant="subtitle1"
        fontWeight={700}
        sx={{ color: '#2A3547' }}
      >
        Distribución Anual
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Donut */}
        <Box sx={{ width: 100, height: 100, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={32}
                outerRadius={46}
                paddingAngle={3}
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 12,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                }}
                formatter={(v: number) => [`${v}%`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* Stats */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ color: '#2A3547', mb: 0.5 }}
          >
            {data[0].value}%
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: '#13DEB9', fontWeight: 700 }}
          >
            +9% año anterior
          </Typography>

          <Box
            sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}
          >
            {data.map((d, i) => (
              <Box
                key={i}
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <FiberManualRecordIcon
                  sx={{ fontSize: 10, color: COLORS[i] }}
                />
                <Typography variant="caption" sx={{ color: '#7C8FAC' }}>
                  {d.name}: {d.value}%
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
