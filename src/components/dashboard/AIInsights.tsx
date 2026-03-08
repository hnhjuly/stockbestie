import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Lightbulb, GraduationCap } from 'lucide-react';

const insights = [
  {
    icon: TrendingUp,
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
    text: <><strong className="text-foreground font-medium">AAPL</strong> is up 3.2% after strong earnings. Your position is in the green. Consider your exit target.</>,
  },
  {
    icon: AlertTriangle,
    iconBg: 'bg-destructive/10',
    iconColor: 'text-destructive',
    text: <><strong className="text-foreground font-medium">NVDA</strong> sees elevated volatility. VIX spiked — high risk window this week.</>,
  },
  {
    icon: Lightbulb,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    text: <>You haven't diversified into bonds. A <strong className="text-foreground font-medium">60/40 portfolio</strong> historically reduces drawdown risk.</>,
  },
  {
    icon: GraduationCap,
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
    text: <>Complete today's <strong className="text-foreground font-medium">ETF lesson</strong> to earn 50 XP and unlock the Dividend module.</>,
  },
];

export const AIInsights = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-card border border-border rounded-2xl p-5 shadow-sm"
    >
      <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-success/15 to-primary/10 border border-success/20 rounded-full px-2.5 py-0.5 text-[10px] font-mono font-medium text-success uppercase tracking-wide mb-4">
        ✦ AI Insights
      </div>

      <div className="space-y-0">
        {insights.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className={`flex gap-2.5 py-3.5 ${i < insights.length - 1 ? 'border-b border-border' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.iconBg}`}>
                <Icon className={`w-3.5 h-3.5 ${item.iconColor}`} />
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">{item.text}</p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
