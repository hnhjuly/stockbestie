import { motion } from 'framer-motion';
import { Flame, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const days = [
  { label: 'M', status: 'done' },
  { label: 'T', status: 'done' },
  { label: 'W', status: 'done' },
  { label: 'T', status: 'done' },
  { label: 'F', status: 'done' },
  { label: 'S', status: 'done' },
  { label: 'S', status: 'done' },
  { label: 'M', status: 'done' },
  { label: 'T', status: 'done' },
  { label: 'W', status: 'done' },
  { label: 'T', status: 'done' },
  { label: 'F', status: 'today' },
  { label: 'S', status: 'future' },
  { label: 'S', status: 'future' },
];

export const LearningStreak = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-card border border-border rounded-2xl p-5 shadow-sm"
    >
      <div className="text-[11px] uppercase tracking-wider font-mono text-muted-foreground flex items-center gap-1.5 mb-3">
        <Flame className="w-3.5 h-3.5 text-warning" /> Learning Streak
      </div>

      <div className="flex justify-between mb-3">
        <div>
          <div className="text-[22px] font-semibold font-mono text-warning">12</div>
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Day Streak</div>
        </div>
        <div className="text-right">
          <div className="text-[22px] font-semibold font-mono">4,210</div>
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Total XP</div>
        </div>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {days.map((day, i) => (
          <div
            key={i}
            className={cn(
              'w-7 h-7 rounded-md flex items-center justify-center text-[9px] font-mono border transition-all',
              day.status === 'done' && 'bg-success/10 border-success/25 text-success',
              day.status === 'today' && 'bg-success text-background border-success font-bold shadow-[0_0_12px_hsl(var(--success)/0.4)]',
              day.status === 'future' && 'bg-muted border-border text-muted-foreground/40'
            )}
          >
            {day.label}
          </div>
        ))}
      </div>

      <div className="mt-3.5 p-2.5 bg-success/10 border border-success/20 rounded-lg flex items-center gap-2">
        <Target className="w-4 h-4 text-success flex-shrink-0" />
        <div>
          <div className="text-xs font-medium text-success">Daily Goal</div>
          <div className="text-[11px] text-muted-foreground">Complete 1 lesson to keep your streak</div>
        </div>
      </div>
    </motion.div>
  );
};
