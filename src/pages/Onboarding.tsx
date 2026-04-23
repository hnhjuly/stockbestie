import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Star, TrendingUp, BarChart3, DollarSign, Brain, Home, Sprout, RefreshCw, Zap, CheckCircle,
  Gamepad2, Puzzle, Lightbulb, Flame, Trophy, LayoutDashboard, BookOpen, LineChart, 
  Wallet, GraduationCap, Award, Hand, Repeat, CircleCheck
} from 'lucide-react';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import sbLogo from '@/assets/sb-logo.png';
import mascotBusiness from '@/assets/mascot-business.png';
import mascotTeach from '@/assets/mascot-teach.png';
import mascotTrophy from '@/assets/mascot-trophy.png';
import mascotFlying from '@/assets/mascot-flying.png';
import mascotMoneybag from '@/assets/mascot-moneybag.png';

const Onboarding = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      {/* NAV */}
      <nav className="sticky top-0 z-[500] bg-background/90 backdrop-blur-2xl border-b border-border flex items-center justify-between px-6 md:px-12 h-[58px]">
        <a href="#" className="flex items-center gap-2.5">
          <img src={sbLogo} alt="StockBestie" className="w-8 h-8 object-contain" />
          <span className="text-[17px] font-bold tracking-tight">Stock<em className="text-primary not-italic">Bestie</em></span>
        </a>
        <div className="hidden md:flex items-center gap-0.5">
          <button className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all">Features</button>
          <button className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all">How it works</button>
          <button className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all">Pricing</button>
          <button onClick={() => navigate('/auth')} className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all">Sign in</button>
          <button onClick={() => navigate('/auth')} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold ml-1 hover:opacity-90 transition-opacity">Sign up</button>
        </div>
        <div className="md:hidden flex items-center gap-2">
          <button onClick={() => navigate('/auth')} className="px-3 py-2 text-sm font-medium text-muted-foreground">Sign in</button>
          <button onClick={() => navigate('/auth')} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold">Sign up</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-[1120px] mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16 px-6 md:px-12 py-16 md:py-20">
        <div className="flex-1 max-w-[510px]">
          <div className="inline-flex items-center gap-2 border border-border rounded-full px-3.5 py-1 text-xs font-medium text-muted-foreground mb-5">
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-bold"><Star className="w-3 h-3" /></div>
            Free to start · No credit card needed
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-[1.06] mb-4 tracking-[-2px]">
            The fun way to finally<br />understand <span className="text-primary">investing.</span>
          </h1>
          <p className="text-base md:text-[17px] text-muted-foreground leading-relaxed mb-6">
            Bite-sized lessons, daily streaks, and real knowledge. StockBestie makes financial literacy feel like a game — not a chore.
          </p>
          <div className="flex gap-2.5">
            <button onClick={() => setModalOpen(true)} className="px-5 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">Start learning free</button>
            <button onClick={() => setModalOpen(true)} className="px-5 py-3 bg-background text-foreground border-[1.5px] border-border rounded-xl text-sm font-semibold hover:border-primary hover:text-primary transition-all">I have an account</button>
          </div>
        </div>
        <div className="flex-1 relative">
          {/* Dashboard Card */}
          <div className="bg-card border border-border rounded-2xl p-5 md:p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-foreground text-background flex items-center justify-center font-bold text-sm">$$</div>
                <div>
                  <h3 className="font-bold text-sm flex items-center gap-1.5">Good morning <Hand className="w-4 h-4 text-warning" /></h3>
                  <p className="text-xs text-muted-foreground">Monday, March 09, 2026</p>
                </div>
              </div>
              <div className="bg-muted rounded-full px-2.5 py-1 text-[11px] font-semibold flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-success" /> +10 XP
              </div>
            </div>
            
            <div className="space-y-3">
              {/* Market Indices */}
              <div className="flex gap-2 text-xs">
                <span className="font-medium">S&P500 5,782 <span className="text-success">+0.43%</span></span>
                <span className="font-medium">NASDAQ 18,241 <span className="text-success">+0.61%</span></span>
              </div>
              
              {/* Portfolio Section */}
              <div className="bg-muted rounded-xl p-4 border border-border">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Portfolio Value</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black tracking-tight">$12,847</span>
                  <span className="text-muted-foreground text-sm">.32</span>
                </div>
                <p className="text-sm text-success font-semibold mt-2 flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> +$342.18 today (+2.73%)</p>
              </div>
              
              {/* XP & Rank Section */}
              <div className="bg-muted rounded-xl p-4 border border-border">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">XP & Rank</p>
                <p className="text-2xl font-black text-warning mb-1">4,210 XP</p>
                <p className="text-sm font-semibold flex items-center gap-1"><Star className="w-3.5 h-3.5 text-warning" /> Rank #38 · Bull Tier</p>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-muted rounded-lg p-3 text-center border border-border">
                  <p className="text-lg font-black flex items-center justify-center gap-1"><Flame className="w-4 h-4 text-destructive" />7</p>
                  <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mt-1">Streak</p>
                </div>
                <div className="bg-muted rounded-lg p-3 text-center border border-border">
                  <p className="text-lg font-black flex items-center justify-center gap-1"><GraduationCap className="w-4 h-4 text-primary" />3</p>
                  <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mt-1">Lessons</p>
                </div>
                <div className="bg-muted rounded-lg p-3 text-center border border-border">
                  <p className="text-lg font-black">#38</p>
                  <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mt-1">Rank</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mascot Overlapping */}
          <div className="absolute -top-16 -right-12 md:-top-20 md:-right-16 w-56 md:w-72">
            <img src={mascotBusiness} alt="StockBestie mascot" className="w-full h-auto object-contain" />
            {/* Floating badges */}
            <div className="absolute -top-8 -right-6 md:-top-10 md:-right-8 bg-card border border-border rounded-xl shadow-md px-3 py-1.5 text-[11px] font-semibold flex items-center gap-1.5 whitespace-nowrap animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="w-[7px] h-[7px] rounded-full bg-success" /> +10 XP earned!
            </div>
            <div className="absolute -bottom-8 -right-6 md:-bottom-10 md:-right-8 bg-card border border-border rounded-xl shadow-md px-3 py-1.5 text-[11px] font-semibold flex items-center gap-1.5 whitespace-nowrap animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.8s' }}>
              <Flame className="w-3.5 h-3.5 text-destructive" /> 7-day streak
            </div>
            <div className="absolute top-1/2 -left-6 md:-left-8 bg-card border border-border rounded-xl shadow-md px-3 py-1.5 text-[11px] font-semibold flex items-center gap-1.5 whitespace-nowrap animate-bounce" style={{ animationDuration: '3s', animationDelay: '1.3s', transform: 'translateY(-50%)' }}>
              <div className="w-[7px] h-[7px] rounded-full bg-primary" /> Rank #38 · Bull Tier
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="bg-muted border-t border-b border-border py-5 px-6 md:px-12 flex justify-center gap-10 md:gap-16 flex-wrap">
        {[
          { n: '2M+', l: 'Active Learners' },
          { n: '50+', l: 'Bite-sized Lessons' },
          { n: '4.9', l: 'App Store Rating', icon: <Star className="w-4 h-4 text-warning inline" /> },
          { n: 'Free', l: 'Always Free to Start' },
          { n: '5 min', l: 'Per Day Is Enough' },
        ].map(s => (
          <div key={s.l} className="text-center">
            <div className="text-2xl font-black tracking-tight flex items-center justify-center gap-1">{s.n}{'icon' in s && s.icon}</div>
            <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider font-mono mt-1">{s.l}</div>
          </div>
        ))}
      </div>

      {/* SPLIT 1 — Learn by doing */}
      <section className="max-w-[1120px] mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-[72px] px-6 md:px-12 py-16 md:py-[88px]">
        <div className="flex-1">
          <div className="text-[10px] font-bold text-primary uppercase tracking-[1.5px] font-mono mb-3 flex items-center gap-1.5">
            <span className="w-3.5 h-[1.5px] bg-primary" /> Learn by doing
          </div>
          <h2 className="text-3xl font-black tracking-[-1.2px] leading-tight mb-3">Finally understand what your money is doing</h2>
          <p className="text-base text-muted-foreground leading-relaxed">No textbooks. No jargon. Clear, interactive lessons built for real people with real goals.</p>
          <div className="flex flex-col gap-3.5 mt-6">
            {[
              { icon: <Gamepad2 className="w-[18px] h-[18px] text-primary" />, t: 'Gamified lessons', d: 'Earn XP, unlock badges, level up. Each lesson feels like a mini-game.', color: 'bg-primary/5 border-primary/20' },
              { icon: <Puzzle className="w-[18px] h-[18px] text-success" />, t: 'Bite-sized format', d: '5-minute lessons that fit your commute, coffee break, or lunch.', color: 'bg-success/5 border-success/20' },
              { icon: <Lightbulb className="w-[18px] h-[18px] text-warning" />, t: 'Real-world examples', d: 'Actual companies, real market events, everyday money decisions.', color: 'bg-warning/5 border-warning/20' },
            ].map(f => (
              <div key={f.t} className="flex gap-3 items-start">
                <div className={`w-[38px] h-[38px] rounded-[9px] shrink-0 flex items-center justify-center border ${f.color}`}>{f.icon}</div>
                <div>
                  <div className="text-sm font-bold tracking-tight mb-0.5">{f.t}</div>
                  <div className="text-[13px] text-muted-foreground leading-relaxed">{f.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <img src={mascotTeach} alt="StockBestie teaching" className="w-64 md:w-80 object-contain" />
        </div>
      </section>

      {/* SPLIT 2 — Stay consistent (banded) */}
      <section className="bg-muted border-t border-b border-border">
        <div className="max-w-[1120px] mx-auto flex flex-col md:flex-row-reverse items-center gap-12 md:gap-[72px] px-6 md:px-12 py-16 md:py-[88px]">
          <div className="flex-1">
            <div className="text-[10px] font-bold text-primary uppercase tracking-[1.5px] font-mono mb-3 flex items-center gap-1.5">
              <span className="w-3.5 h-[1.5px] bg-primary" /> Stay consistent
            </div>
            <h2 className="text-3xl font-black tracking-[-1.2px] leading-tight mb-3">Build a habit that actually sticks</h2>
            <p className="text-base text-muted-foreground leading-relaxed">The secret isn't one big lesson — it's 5 minutes every day. StockBestie makes it addictive.</p>
            <div className="flex flex-col gap-3.5 mt-6">
              {[
                { icon: <Flame className="w-[18px] h-[18px] text-destructive" />, t: 'Daily streaks', d: "Miss a day, lose your streak. A powerful motivator — ask any Duolingo user.", color: 'bg-destructive/5 border-destructive/20' },
                { icon: <Trophy className="w-[18px] h-[18px] text-warning" />, t: 'XP & rank tiers', d: 'Bull Tier, Bear Tier — earn your way up as your knowledge grows.', color: 'bg-warning/5 border-warning/20' },
                { icon: <LayoutDashboard className="w-[18px] h-[18px] text-primary" />, t: 'Portfolio dashboard', d: 'Track simulated investments alongside your real learning progress.', color: 'bg-primary/5 border-primary/20' },
              ].map(f => (
                <div key={f.t} className="flex gap-3 items-start">
                  <div className={`w-[38px] h-[38px] rounded-[9px] shrink-0 flex items-center justify-center border ${f.color}`}>{f.icon}</div>
                  <div>
                    <div className="text-sm font-bold tracking-tight mb-0.5">{f.t}</div>
                    <div className="text-[13px] text-muted-foreground leading-relaxed">{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <img src={mascotTrophy} alt="StockBestie trophy" className="w-56 md:w-72 object-contain" />
          </div>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section className="max-w-[1120px] mx-auto px-6 md:px-12 pt-16 md:pt-[88px] pb-7 text-center">
        <div className="text-[10px] font-bold text-primary uppercase tracking-[1.5px] font-mono mb-3 flex items-center justify-center gap-1.5">
          <span className="w-3.5 h-[1.5px] bg-primary" /> Everything you need
        </div>
        <h2 className="text-3xl font-black tracking-[-1.2px] leading-tight mb-2">Built for real people, not finance bros</h2>
      </section>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 max-w-[1120px] mx-auto px-6 md:px-12 pb-16 md:pb-[88px]">
        {[
          { icon: <TrendingUp className="w-5 h-5 text-primary" />, t: 'Stocks & ETFs', d: 'Learn the fundamentals of owning stocks, what ETFs are, and why diversification matters.' },
          { icon: <BarChart3 className="w-5 h-5 text-primary" />, t: 'Reading the market', d: 'Understand charts, trends, and how to make sense of what the market is telling you.' },
          { icon: <DollarSign className="w-5 h-5 text-primary" />, t: 'Investing basics', d: 'From index funds to compound interest — master the concepts every investor needs.' },
          { icon: <Brain className="w-5 h-5 text-primary" />, t: 'Behavioral finance', d: 'Why do we make bad money decisions? Learn the psychology and how to overcome it.' },
          { icon: <Home className="w-5 h-5 text-primary" />, t: 'Real estate & loans', d: "Mortgages, rent vs buy, debt management — the stuff they never taught you in school." },
          { icon: <Sprout className="w-5 h-5 text-primary" />, t: 'Retirement planning', d: '401k, IRA, Roth — start early, build smart. We make retirement planning feel achievable.' },
        ].map(f => (
          <div key={f.t} className="bg-card rounded-2xl border border-border p-5 transition-all hover:border-primary/40 hover:shadow-lg group">
            <div className="w-10 h-10 rounded-[9px] bg-muted border border-border flex items-center justify-center mb-3 group-hover:bg-primary/5 group-hover:border-primary/30 transition-all">{f.icon}</div>
            <div className="text-sm font-bold tracking-tight mb-1">{f.t}</div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">{f.d}</p>
          </div>
        ))}
      </div>

      {/* SCIENCE */}
      <section className="bg-muted border-t border-b border-border">
        <div className="max-w-[1120px] mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-[72px] px-6 md:px-12 py-16 md:py-[88px]">
          <div className="flex-1">
            <div className="text-[10px] font-bold text-primary uppercase tracking-[1.5px] font-mono mb-3 flex items-center gap-1.5">
              <span className="w-3.5 h-[1.5px] bg-primary" /> Backed by science
            </div>
            <h2 className="text-3xl font-black tracking-[-1.2px] leading-tight mb-3">Learning science built in from day one</h2>
            <p className="text-base text-muted-foreground leading-relaxed">StockBestie uses the same principles behind the world's most effective education apps.</p>
            <div className="flex flex-col gap-3.5 mt-6">
              {[
                { icon: <Repeat className="w-[18px] h-[18px] text-primary" />, t: 'Spaced repetition', d: 'Concepts revisited at optimal intervals so they stick long-term.', color: 'bg-primary/5 border-primary/20' },
                { icon: <Zap className="w-[18px] h-[18px] text-success" />, t: 'Active recall', d: "You're tested, not just shown. Doing beats reading every time.", color: 'bg-success/5 border-success/20' },
                { icon: <CircleCheck className="w-[18px] h-[18px] text-warning" />, t: 'Instant feedback', d: 'Know immediately if you\'re right — with a clear explanation why.', color: 'bg-warning/5 border-warning/20' },
              ].map(f => (
                <div key={f.t} className="flex gap-3 items-start">
                  <div className={`w-[38px] h-[38px] rounded-[9px] shrink-0 flex items-center justify-center border ${f.color}`}>{f.icon}</div>
                  <div>
                    <div className="text-sm font-bold tracking-tight mb-0.5">{f.t}</div>
                    <div className="text-[13px] text-muted-foreground leading-relaxed">{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 flex-1">
            {[
              { n: '94%', d: 'of users understand investing better after 2 weeks' },
              { n: '3×', d: 'better retention vs reading articles alone' },
              { n: '5 min', d: 'average daily session — fits any schedule' },
              { n: '78%', d: 'of users hit their daily goal for 30+ consecutive days' },
            ].map(s => (
              <div key={s.n} className="bg-background rounded-2xl border border-border p-4">
                <div className="text-[29px] font-black tracking-[-1.5px] text-primary mb-1">{s.n}</div>
                <p className="text-xs text-muted-foreground leading-snug">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-[1120px] mx-auto px-6 md:px-12 py-16 md:py-[88px]">
        <div className="text-center mb-8">
          <div className="text-[10px] font-bold text-primary uppercase tracking-[1.5px] font-mono mb-3 flex items-center justify-center gap-1.5">
            <span className="w-3.5 h-[1.5px] bg-primary" /> Real people, real results
          </div>
          <h2 className="text-3xl font-black tracking-[-1.2px] leading-tight">People are actually learning</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {[
            { q: "I've tried finance books and YouTube but nothing stuck. StockBestie finally made it click. I opened my first brokerage account last month!", n: 'Sarah M.', m: 'Teacher', streak: 42, color: 'bg-primary', init: 'S' },
            { q: "The gamification is addictive in the best way. I look forward to my 5 minutes every morning. My partner thinks I'm obsessed — they're right.", n: 'James T.', m: 'Designer', streak: 89, color: 'bg-success', init: 'J' },
            { q: "I felt embarrassed not knowing what a 401k was. Now I'm maxing mine out. No shame, just progress. Thank you StockBestie.", n: 'Ana R.', m: 'Nurse', streak: 31, color: 'bg-warning', init: 'A' },
          ].map(t => (
            <div key={t.n} className="bg-card rounded-2xl border border-border p-5">
              <div className="flex items-center gap-0.5 mb-2.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-warning fill-warning" />)}
              </div>
              <p className="text-[13.5px] leading-relaxed mb-4">{t.q}</p>
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-[9px] ${t.color} text-primary-foreground flex items-center justify-center text-[13px] font-extrabold shrink-0`}>{t.init}</div>
                <div>
                  <div className="text-[13px] font-bold tracking-tight">{t.n}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">{t.m} · <Flame className="w-3 h-3 text-destructive" /> {t.streak}-day streak</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RATINGS */}
      <section className="bg-foreground py-14 md:py-[68px] px-6 md:px-12 text-center">
        <h2 className="text-[28px] font-black text-background tracking-tight mb-1.5">Loved by learners everywhere</h2>
        <p className="text-sm text-muted-foreground mb-8">Consistently rated among the top finance education apps</p>
        <div className="flex justify-center gap-3.5 flex-wrap">
          {[
            { store: 'App Store', rating: '4.9', type: 'stars', cnt: '48,200 ratings' },
            { store: 'Google Play', rating: '4.8', type: 'stars', cnt: '31,500 ratings' },
            { store: 'Product Hunt', rating: '#1', type: 'trophy', cnt: 'Product of the Day' },
          ].map(r => (
            <div key={r.store} className="bg-background/5 border border-background/10 rounded-2xl px-6 py-4 min-w-[155px]">
              <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider font-mono mb-1">{r.store}</div>
              <div className="text-4xl font-black text-background tracking-[-1.5px]">{r.rating}</div>
              <div className="flex items-center justify-center gap-0.5 my-1">
                {r.type === 'stars' 
                  ? [...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-warning fill-warning" />)
                  : <><Trophy className="w-4 h-4 text-warning" /> <span className="text-sm text-background font-semibold">Finance</span></>
                }
              </div>
              <div className="text-[10px] text-muted-foreground">{r.cnt}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="text-center py-20 md:py-24 px-6 md:px-12 bg-gradient-to-br from-primary/5 to-background border-t border-border">
        <img src={mascotFlying} alt="StockBestie flying" className="w-24 mx-auto mb-4 animate-bounce" style={{ animationDuration: '2.5s' }} />
        <h2 className="text-3xl md:text-[40px] font-black tracking-[-2px] leading-[1.08] mb-3">
          Your financial glow-up<br />starts today.
        </h2>
        <p className="text-base text-muted-foreground mb-7">Free to start. 5 minutes a day. No excuses.</p>
        <button onClick={() => setModalOpen(true)} className="px-9 py-3.5 bg-primary text-primary-foreground rounded-xl text-[15px] font-semibold hover:opacity-90 transition-opacity">
          Get started for free
        </button>
      </section>

      {/* FOOTER */}
      <footer className="bg-card border-t border-border py-6 px-6 md:px-12 flex items-center justify-between flex-wrap gap-3.5">
        <span className="text-[15px] font-bold tracking-tight">Stock<em className="text-primary not-italic">Bestie</em></span>
        <div className="flex gap-4 flex-wrap">
          {['About', 'Blog', 'Careers', 'Privacy', 'Terms'].map(l => (
            <a key={l} href="#" className="text-[13px] text-muted-foreground font-medium hover:text-foreground transition-colors">{l}</a>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">© 2025 StockBestie. All rights reserved.</span>
      </footer>

      {/* ONBOARDING MODAL */}
      {modalOpen && <OnboardingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />}
    </div>
  );
};

export default Onboarding;
