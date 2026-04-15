import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Insight {
  icon: typeof TrendingUp;
  iconBg: string;
  iconColor: string;
  text: React.ReactNode;
}

export const AIInsights = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data, error } = await supabase
        .from('tickers')
        .select('ticker, price, change_percent, company')
        .eq('auth_user_id', user.id)
        .order('change_percent', { ascending: true });

      if (error || !data || data.length === 0) {
        setInsights([{
          icon: Lightbulb,
          iconBg: 'bg-primary/10',
          iconColor: 'text-primary',
          text: <>Add tickers to your watchlist to get personalised AI insights.</>,
        }]);
        setIsLoading(false);
        return;
      }

      const generated: Insight[] = [];

      // Top gainer
      const sorted = [...data].sort((a, b) => (b.change_percent ?? 0) - (a.change_percent ?? 0));
      const topGainer = sorted[0];
      if (topGainer && (topGainer.change_percent ?? 0) > 0) {
        generated.push({
          icon: TrendingUp,
          iconBg: 'bg-success/10',
          iconColor: 'text-success',
          text: <><strong className="text-foreground font-medium">{topGainer.ticker}</strong> is your top gainer today at <strong className="text-success font-medium">+{topGainer.change_percent?.toFixed(2)}%</strong>. {topGainer.company && `(${topGainer.company})`}</>,
        });
      }

      // Top loser
      const topLoser = sorted[sorted.length - 1];
      if (topLoser && (topLoser.change_percent ?? 0) < 0) {
        generated.push({
          icon: TrendingDown,
          iconBg: 'bg-destructive/10',
          iconColor: 'text-destructive',
          text: <><strong className="text-foreground font-medium">{topLoser.ticker}</strong> is down <strong className="text-destructive font-medium">{topLoser.change_percent?.toFixed(2)}%</strong> today. Keep an eye on it.</>,
        });
      }

      // Volatility check
      const highVol = data.filter(t => Math.abs(t.change_percent ?? 0) > 3);
      if (highVol.length > 0) {
        generated.push({
          icon: AlertTriangle,
          iconBg: 'bg-warning/10',
          iconColor: 'text-warning',
          text: <><strong className="text-foreground font-medium">{highVol.map(t => t.ticker).join(', ')}</strong> {highVol.length === 1 ? 'shows' : 'show'} elevated volatility ({'>'}3% move). Consider reviewing your positions.</>,
        });
      }

      // Diversification tip
      if (data.length < 5) {
        generated.push({
          icon: Lightbulb,
          iconBg: 'bg-primary/10',
          iconColor: 'text-primary',
          text: <>You're tracking {data.length} ticker{data.length !== 1 ? 's' : ''}. Diversifying across 8–12 positions can help reduce risk.</>,
        });
      }

      setInsights(generated.length > 0 ? generated : [{
        icon: Lightbulb,
        iconBg: 'bg-primary/10',
        iconColor: 'text-primary',
        text: <>Your portfolio looks stable today. No major moves detected.</>,
      }]);
      setIsLoading(false);
    };
    load();
  }, [user]);

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

      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
      ) : (
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
      )}
    </motion.div>
  );
};
