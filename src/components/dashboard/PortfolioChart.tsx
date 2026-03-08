import { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

const chartData = [
  { day: 'Mon', value: 11600 },
  { day: 'Tue', value: 11850 },
  { day: 'Wed', value: 12100 },
  { day: 'Thu', value: 11950 },
  { day: 'Fri', value: 12400 },
  { day: 'Today', value: 12847 },
];

const timeTabs = ['1D', '1W', '1M', '3M', '1Y'];

export const PortfolioChart = () => {
  const [activeTab, setActiveTab] = useState('1W');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-card border border-border rounded-2xl p-5 shadow-sm"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-[13px] font-mono text-muted-foreground uppercase tracking-wide">Portfolio Performance</div>
          <div className="text-[26px] font-semibold tracking-tight mt-1">$12,847.32</div>
          <div className="text-xs text-success mt-1">▲ +$1,247.32 this month (+10.75%)</div>
        </div>
        <div className="flex gap-1">
          {timeTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-2.5 py-1 rounded-md text-[11px] font-mono transition-all border border-transparent',
                activeTab === tab
                  ? 'bg-success/10 text-success border-success/25'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.25} />
                <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontFamily: 'monospace' }}
            />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'monospace',
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--success))"
              strokeWidth={2}
              fill="url(#portfolioGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
