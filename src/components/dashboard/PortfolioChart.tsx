import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { RefreshCw } from 'lucide-react';

interface ChartPoint {
  label: string;
  value: number;
}

export const PortfolioChart = () => {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [totalChange, setTotalChange] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tickers')
        .select('ticker, price, change_percent')
        .eq('auth_user_id', user.id)
        .order('added_at', { ascending: true });

      if (error || !data || data.length === 0) {
        setIsLoading(false);
        return;
      }

      const total = data.reduce((s, t) => s + (t.price ?? 0), 0);
      setTotalValue(total);

      const avgChangePct = data.reduce((s, t) => s + (t.change_percent ?? 0), 0) / data.length;
      setTotalChange(avgChangePct);

      // Build chart points from individual ticker prices
      const points: ChartPoint[] = data.map(t => ({
        label: t.ticker,
        value: t.price ?? 0,
      }));
      setChartData(points);
      setIsLoading(false);
    };
    load();
  }, [user]);

  const up = totalChange >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-card border border-border rounded-2xl p-5 shadow-sm"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-[13px] font-mono text-muted-foreground uppercase tracking-wide">Portfolio Overview</div>
          <div className="text-[26px] font-semibold tracking-tight mt-1">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`text-xs mt-1 ${up ? 'text-success' : 'text-destructive'}`}>
            {up ? '▲' : '▼'} Avg {up ? '+' : ''}{totalChange.toFixed(2)}% today
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="h-[140px] flex items-center justify-center">
          <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-[140px] flex items-center justify-center text-xs text-muted-foreground">
          Add tickers to see your portfolio chart
        </div>
      ) : (
        <div className="h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={`hsl(var(--${up ? 'success' : 'destructive'}))`} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={`hsl(var(--${up ? 'success' : 'destructive'}))`} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
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
                formatter={(value: number) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Price']}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={`hsl(var(--${up ? 'success' : 'destructive'}))`}
                strokeWidth={2}
                fill="url(#portfolioGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};
