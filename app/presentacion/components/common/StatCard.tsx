import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

export default function StatCard({
  title,
  value,
  subtitle,
  color = '#5D87FF',
  icon,
  trend,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  icon?: React.ReactNode;
  trend?: { value: string; positive: boolean };
}) {
  const bgColor = color + '18';

  return (
    <Paper
      sx={{
        p: 3,
        flex: 1,
        minWidth: 200,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        cursor: 'default',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 'rgba(145, 158, 171, 0.3) 0px 8px 24px',
        },
      }}
      role="region"
      aria-label={title}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography
            variant="caption"
            sx={{
              color: '#7C8FAC',
              fontWeight: 600,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              fontSize: 11,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: '#2A3547', mt: 0.5, lineHeight: 1.2 }}
          >
            {value}
          </Typography>
        </Box>

        {/* Icon bubble */}
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 3,
            bgcolor: bgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
            flexShrink: 0,
          }}
          aria-hidden
        >
          {icon ?? (
            <Box
              component="span"
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                bgcolor: color,
                opacity: 0.8,
              }}
            />
          )}
        </Box>
      </Box>

      {/* Trend */}
      {(trend || subtitle) && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
          {trend && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.25,
                color: trend.positive ? '#13DEB9' : '#FA896B',
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              {trend.positive ? (
                <TrendingUpIcon sx={{ fontSize: 14 }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: 14 }} />
              )}
              {trend.value}
            </Box>
          )}
          {subtitle && (
            <Typography variant="caption" sx={{ color: '#7C8FAC' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      )}
    </Paper>
  );
}
