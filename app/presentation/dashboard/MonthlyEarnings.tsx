import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { Paper, Typography, Box, Avatar } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import type * as api from '../../application/services/api';

export default function MonthlyEarnings({
  data,
}: {
  data?: api.MonthlyEarnings;
}) {
  const total = data?.total ?? 0;
  const spark = (data?.sparkline ?? []).map((v) => ({ v }));

  return (
    <Paper sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          mb: 1,
        }}
      >
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{ color: '#2A3547' }}
          >
            Citas del Mes
          </Typography>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ color: '#2A3547', mt: 0.5 }}
          >
            {total}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: '#13DEB9', fontWeight: 700 }}
          >
            {data?.porcentaje ?? ''}
          </Typography>
        </Box>

        <Avatar
          sx={{
            width: 44,
            height: 44,
            bgcolor: '#E8F7FF',
            color: '#49BEFF',
            borderRadius: 3,
          }}
        >
          <EventAvailableIcon />
        </Avatar>
      </Box>

      {/* Sparkline */}
      <Box sx={{ height: 60, mt: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={spark}>
            <defs>
              <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#49BEFF" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#49BEFF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke="#49BEFF"
              strokeWidth={2}
              fill="url(#sparkGrad)"
              dot={false}
            />
            <Tooltip
              contentStyle={{
                fontSize: 11,
                border: 'none',
                borderRadius: 6,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
              formatter={(v: number) => [v, 'Citas']}
              labelFormatter={() => ''}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
