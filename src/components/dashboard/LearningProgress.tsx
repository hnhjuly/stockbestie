import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Package, Building2 } from 'lucide-react';

interface Lesson {
  title: string;
  sub: string;
  progress: number;
  status: 'done' | 'in-progress' | 'locked';
  icon: React.ReactNode;
  iconBg: string;
}

const lessons: Lesson[] = [
  { title: 'Stock Basics', sub: 'What stocks are and how they work', progress: 100, status: 'done', icon: <TrendingUp className="w-4 h-4" />, iconBg: 'bg-success/10 text-success' },
  { title: 'Dividends', sub: 'Earning passive income from stocks', progress: 100, status: 'done', icon: <DollarSign className="w-4 h-4" />, iconBg: 'bg-success/10 text-success' },
  { title: 'ETFs Explained', sub: 'Bundles, index funds & diversification', progress: 60, status: 'in-progress', icon: <Package className="w-4 h-4" />, iconBg: 'bg-warning/10 text-warning' },
  { title: 'Bonds & Fixed Income', sub: 'Safer alternatives to stocks', progress: 0, status: 'locked', icon: <Building2 className="w-4 h-4" />, iconBg: 'bg-muted text-muted-foreground' },
];

const statusBadge = (status: Lesson['status']) => {
  switch (status) {
    case 'done':
      return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-success/10 text-success border border-success/20">Done ✓</span>;
    case 'in-progress':
      return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-warning/10 text-warning border border-warning/20">In Progress</span>;
    case 'locked':
      return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">🔒 Locked</span>;
  }
};

export const LearningProgress = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-card border border-border rounded-2xl p-5 shadow-sm"
    >
      <div className="flex justify-between items-center mb-1">
        <div className="text-[11px] uppercase tracking-wider font-mono text-muted-foreground flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5" /> Learning Progress
        </div>
        <span className="text-[11px] text-success font-mono">3/5 complete</span>
      </div>

      <div className="divide-y divide-border">
        {lessons.map((lesson) => (
          <div key={lesson.title} className="flex items-center gap-3 py-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${lesson.iconBg}`}>
              {lesson.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium truncate">{lesson.title}</div>
              <div className="text-[11px] text-muted-foreground truncate">{lesson.sub}</div>
            </div>
            <div className="w-20 flex-shrink-0">
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    lesson.status === 'done'
                      ? 'bg-gradient-to-r from-success to-success/60'
                      : lesson.status === 'in-progress'
                      ? 'bg-gradient-to-r from-warning to-warning/60'
                      : 'bg-muted-foreground/30'
                  }`}
                  style={{ width: `${Math.max(lesson.progress, 5)}%` }}
                />
              </div>
              <div className={`text-[10px] font-mono text-right mt-1 ${
                lesson.status === 'in-progress' ? 'text-warning' : lesson.status === 'done' ? 'text-muted-foreground' : 'text-muted-foreground/50'
              }`}>
                {lesson.progress}%
              </div>
            </div>
            <div className="flex-shrink-0 hidden sm:block">{statusBadge(lesson.status)}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
