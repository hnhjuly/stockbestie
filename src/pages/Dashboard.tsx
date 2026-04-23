
import { useEffect, useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { MarketBar } from '@/components/dashboard/MarketBar';
import { StatCards } from '@/components/dashboard/StatCards';
import { PortfolioChart } from '@/components/dashboard/PortfolioChart';
import { AIInsights } from '@/components/dashboard/AIInsights';
import { WatchlistCard } from '@/components/dashboard/WatchlistCard';
import { LearningProgress } from '@/components/dashboard/LearningProgress';
import { LearningStreak } from '@/components/dashboard/LearningStreak';
import { Search, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import stockBestieLogo from '@/assets/stock-bestie-logo.png';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useSyncTickerPrices } from '@/hooks/useSyncTickerPrices';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('there');
  useSyncTickerPrices();

  const handleLogout = async () => {
    await signOut();
    toast.success('Signed out');
    navigate('/', { replace: true });
  };

  useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single();
      if (data?.display_name) {
        setFirstName(data.display_name.split(' ')[0]);
      }
    };
    loadProfile();
  }, [user]);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: '2-digit', year: 'numeric' });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={stockBestieLogo} alt="Stock Bestie" className="h-9 w-9 object-contain logo-float" />
              <div>
                <h1 className="text-lg font-semibold tracking-tight">{greeting}, {firstName} 👋</h1>
                <p className="text-[11px] font-mono text-muted-foreground">{dateStr}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-muted border border-border rounded-full text-xs text-muted-foreground cursor-pointer hover:border-success hover:text-foreground transition-all">
                <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                Live Data
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-muted border border-border rounded-full text-xs text-muted-foreground cursor-pointer hover:border-success hover:text-foreground transition-all">
                <Search className="w-3 h-3" />
                Search ticker…
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Log out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-5 space-y-4">
        <MarketBar />
        <StatCards />

        {/* Main grid: chart + insights | watchlist */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
          <div className="space-y-4">
            <PortfolioChart />
            <AIInsights />
            <LearningProgress />
          </div>
          <div className="space-y-4">
            <WatchlistCard />
            <LearningStreak />
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
