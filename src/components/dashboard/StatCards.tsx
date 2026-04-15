import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, BarChart3, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface StatCardProps {
  label: string;
  value: string;
  valueSuffix?: string;
  sub: string;
  icon: React.ReactNode;
  accentColor?: string;
  valueColor?: string;
  subColor?: string;
  delay?: number;
}

const StatCard = ({ label, value, valueSuffix, sub, icon, accentColor, valueColor, subColor, delay = 0 }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className="relative bg-card border border-border rounded-2xl p-5 overflow-hidden shadow-sm hover:border-border/80 hover:shadow-md transition-all"
  >
    <div
      className="absolute top-0 left-0 right-0 h-0.5 opacity-60"
      style={{
        background: `linear-gradient(90deg, transparent, ${accentColor || 'hsl(var(--success))'}, transparent)`,
      }}
    />
    <div className="text-[11px] uppercase tracking-wider font-mono text-muted-foreground mb-3">{label}</div>
    <div className="text-[28px] font-semibold tracking-tight font-mono leading-none" style={{ color: valueColor }}>
      {value}
      {valueSuffix && <span className="text-base text-muted-foreground">{valueSuffix}</span>}
    </div>
    <div className="mt-2 text-xs flex items-center gap-1.5" style={{ color: subColor }}>{sub}</div>
    <div className="absolute top-4 right-4 opacity-15">{icon}</div>
  </motion.div>
);

export const StatCards = () => {
  const { user } = useAuth();
  const [portfolioValue, setPortfolioValue] = useState<number | null>(null);
  const [todayChange, setTodayChange] = useState<number | null>(null);
  const [todayChangePct, setTodayChangePct] = useState<number | null>(null);
  const [tickerCount, setTickerCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data, error } = await supabase
        .from('tickers')
        .select('price, change_percent')
        .eq('auth_user_id', user.id);

      if (error || !data) return;

      setTickerCount(data.length);
      const totalValue = data.reduce((sum, t) => sum + (t.price ?? 0), 0);
      setPortfolioValue(totalValue);

      if (data.length > 0) {
        const avgChange = data.reduce((sum, t) => sum + (t.change_percent ?? 0), 0) / data.length;
        const estimatedDayChange = totalValue * (avgChange / 100);
        setTodayChange(estimatedDayChange);
        setTodayChangePct(avgChange);
      }
    };
    load();
  }, [user]);

  const formatDollars = (val: number) => {
    const whole = Math.floor(Math.abs(val));
    const cents = `.${Math.abs(val - Math.floor(val)).toFixed(2).slice(2)}`;
    const prefix = val >= 0 ? '$' : '-$';
    return { whole: `${prefix}${whole.toLocaleString()}`, cents };
  };

  const pv = portfolioValue != null ? formatDollars(portfolioValue) : { whole: '—', cents: '' };
  const tc = todayChange != null ? formatDollars(todayChange) : { whole: '—', cents: '' };
  const changeUp = (todayChangePct ?? 0) >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      <StatCard
        label="Portfolio Value"
        value={pv.whole}
        valueSuffix={pv.cents}
        sub={todayChange != null
          ? `${changeUp ? '▲' : '▼'} ${tc.whole}${tc.cents} today (${changeUp ? '+' : ''}${todayChangePct?.toFixed(2)}%)`
          : `${tickerCount} tickers tracked`}
        icon={<Briefcase className="w-5 h-5" />}
        subColor={changeUp ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
        delay={0.05}
      />
      <StatCard
        label="Today's P&L"
        value={tc.whole}
        valueSuffix={tc.cents}
        sub="Estimated daily change"
        icon={<BarChart3 className="w-5 h-5" />}
        accentColor={changeUp ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
        valueColor={changeUp ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
        subColor="hsl(var(--muted-foreground))"
        delay={0.1}
      />
      <StatCard
        label="Watchlist"
        value={String(tickerCount)}
        valueSuffix=" tickers"
        sub="Tracked in your portfolio"
        icon={<Trophy className="w-5 h-5" />}
        accentColor="hsl(var(--warning))"
        valueColor="hsl(var(--warning))"
        subColor="hsl(var(--warning))"
        delay={0.15}
      />
    </div>
  );
};
