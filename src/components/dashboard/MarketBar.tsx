import { motion } from 'framer-motion';

const marketIndices = [
  { name: 'S&P 500', value: '5,782.94', change: '+0.43%', up: true },
  { name: 'NASDAQ', value: '18,241.11', change: '+0.61%', up: true },
  { name: 'DOW', value: '43,102.47', change: '−0.12%', up: false },
  { name: 'BTC', value: '$83,412', change: '+1.82%', up: true },
  { name: '10Y YIELD', value: '4.31%', change: '−0.04%', up: false },
  { name: 'VIX', value: '18.42', change: '−2.1%', up: false },
];

export const MarketBar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex gap-5 overflow-x-auto py-2.5 px-4 bg-card border border-border rounded-xl items-center scrollbar-hide"
    >
      {marketIndices.map((idx, i) => (
        <div key={idx.name} className="flex items-center gap-2 whitespace-nowrap">
          {i > 0 && <div className="w-px h-4 bg-border flex-shrink-0 -ml-3 mr-0" />}
          <span className="text-[11px] font-mono text-muted-foreground">{idx.name}</span>
          <span className="text-xs font-mono font-medium text-foreground">{idx.value}</span>
          <span className={`text-[10px] font-mono ${idx.up ? 'text-success' : 'text-destructive'}`}>
            {idx.up ? '▲' : '▼'} {idx.change}
          </span>
        </div>
      ))}
    </motion.div>
  );
};
