import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, TrendingUp, Bot, ChartLine, Loader2, Users } from 'lucide-react';
import sbLogo from '@/assets/sb-logo.png';
import InteractiveRobot from '@/components/InteractiveRobot';
const Landing = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchWaitlistCount = async () => {
      const { count } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true });
      setWaitlistCount(count);
    };
    fetchWaitlistCount();
  }, [isSubmitted]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setIsSubmitting(true);
    try {
      const {
        error
      } = await supabase.from('waitlist').insert({
        email
      });
      if (error) {
        if (error.code === '23505') {
          toast.info("You're already on the list! We'll be in touch soon 💙");
        } else {
          throw error;
        }
      } else {
        setIsSubmitted(true);
        toast.success("You're on the list! 🎉");
      }
    } catch (error: any) {
      console.error('Waitlist error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col overflow-hidden">
      {/* Floating shapes background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{
        animationDelay: '1s'
      }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Interactive 3D Robot - looks at form when user is typing */}
      <InteractiveRobot isLookingAtForm={isInputFocused} />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative z-10">
        {/* SB Logo at top center with parallax */}
        <div className="mb-6 parallax-scale">
          <img src={sbLogo} alt="Stock Bestie logo" className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)]" />
        </div>

        {/* Title with parallax */}
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-4 parallax-up stagger-1">
          Stock <span className="text-muted-foreground/70">Bestie</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground text-center max-w-md mb-8 parallax-blur stagger-2">
          Your friendly AI-powered stock market companion is almost here 
        </p>

        {/* Features with parallax */}
        <div className="grid grid-cols-2 gap-4 max-w-md mb-10 parallax-up stagger-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span>Real-time tracking</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Bot className="h-4 w-4 text-primary" />
            <span>AI chatbot assistant</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ChartLine className="h-4 w-4 text-primary" />
            <span>Analyst predictions</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Budget planner</span>
          </div>
        </div>

        {/* Waitlist Form with parallax */}
        {!isSubmitted ? <form onSubmit={handleSubmit} className="w-full max-w-md parallax-up stagger-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} onFocus={() => setIsInputFocused(true)} onBlur={() => setIsInputFocused(false)} className="flex-1 h-12 text-base bg-card/50 backdrop-blur-sm border-border/50" disabled={isSubmitting} />
              <Button type="submit" size="lg" className="h-12 px-8 liquid-glass text-foreground font-semibold rounded-xl" disabled={isSubmitting}>
                {isSubmitting ? <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Joining...
                  </span> : 'Join Waitlist'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Be the first to know when we launch. No spam, promise! 
            </p>
          </form> : <div className="text-center parallax-scale bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-xl font-semibold mb-2">You're on the list!</h2>
            <p className="text-muted-foreground">
              We'll let you know as soon as Stock Bestie is ready for you.
            </p>
          </div>}
      </main>

      {/* Waitlist Count */}
      {waitlistCount !== null && waitlistCount > 0 && (
        <div className="text-center relative z-10 mb-4 parallax-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/30 backdrop-blur-sm rounded-full border border-border/30">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{waitlistCount.toLocaleString()}</span> people on the waitlist
            </span>
          </div>
        </div>
      )}

      {/* Footer with parallax */}
      <footer className="py-6 text-center relative z-10 parallax-up stagger-5">
        <p className="text-xs text-muted-foreground">
          © 2025 Stock Bestie by{' '}
          <a href="https://www.hanahjuly.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Hanah July
          </a>
        </p>
      </footer>
    </div>;
};
export default Landing;