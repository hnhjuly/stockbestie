import { motion } from 'framer-motion';
import { Briefcase, BarChart3, Trophy } from 'lucide-react';

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
    {/* Top accent line */}
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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      <StatCard
        label="Portfolio Value"
        value="$12,847"
        valueSuffix=".32"
        sub="▲ +$342.18 today (+2.73%)"
        icon={<Briefcase className="w-5 h-5" />}
        subColor="hsl(var(--success))"
        delay={0.05}
      />
      <StatCard
        label="Today's P&L"
        value="+$342"
        valueSuffix=".18"
        sub="Unrealized gain this session"
        icon={<BarChart3 className="w-5 h-5" />}
        accentColor="hsl(var(--destructive))"
        valueColor="hsl(var(--success))"
        subColor="hsl(var(--muted-foreground))"
        delay={0.1}
      />
      <StatCard
        label="XP & Rank"
        value="4,210"
        valueSuffix=" XP"
        sub="★ Rank #38 · Bull Tier"
        icon={<Trophy className="w-5 h-5" />}
        accentColor="hsl(var(--warning))"
        valueColor="hsl(var(--warning))"
        subColor="hsl(var(--warning))"
        delay={0.15}
      />
    </div>
  );
};
