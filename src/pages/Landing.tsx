import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, TrendingUp, Bot, ChartLine, Loader2 } from 'lucide-react';
import sbLogo from '@/assets/sb-logo.png';
import InteractiveRobot from '@/components/InteractiveRobot';
const Landing = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  
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
  return <div className="h-[100dvh] bg-gradient-to-br from-background via-background to-primary/5 flex flex-col overflow-hidden">
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

      {/* Top-right auth actions */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="text-foreground">
          <Link to="/auth">Sign in</Link>
        </Button>
        <Button asChild size="sm" className="liquid-glass text-foreground font-semibold rounded-xl">
          <Link to="/auth">Sign up</Link>
        </Button>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-2 md:py-12 relative z-10">
        {/* SB Logo at top center with parallax */}
        <div className="mb-2 md:mb-6 parallax-scale">
          <img src={sbLogo} alt="Stock Bestie logo" className="w-20 h-20 md:w-32 md:h-32 object-contain" />
        </div>

        {/* Title with parallax */}
        <h1 className="text-[25px] md:text-6xl font-bold text-center mb-1 md:mb-4 parallax-up stagger-1">
          Stock <span className="text-muted-foreground/70">Bestie</span>
        </h1>

        <p className="text-[13px] md:text-xl text-muted-foreground text-center max-w-md mb-3 md:mb-8 parallax-blur stagger-2">
          Your friendly AI-powered stock market companion is almost here 
        </p>

        {/* Features with parallax */}
        <div className="grid grid-cols-2 gap-1.5 md:gap-4 max-w-md mb-8 md:mb-10 parallax-up stagger-3">
          <div className="flex items-center gap-1.5 text-[11px] md:text-sm text-muted-foreground">
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-primary" />
            <span>Real-time tracking</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] md:text-sm text-muted-foreground">
            <Bot className="h-3 w-3 md:h-4 md:w-4 text-primary" />
            <span>AI chatbot assistant</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] md:text-sm text-muted-foreground">
            <ChartLine className="h-3 w-3 md:h-4 md:w-4 text-primary" />
            <span>Analyst predictions</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] md:text-sm text-muted-foreground">
            <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-primary" />
            <span>Budget planner</span>
          </div>
        </div>

        {/* Waitlist Form with parallax */}
        {!isSubmitted ? <form onSubmit={handleSubmit} className="w-full max-w-md parallax-up stagger-4">
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
              <Input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} onFocus={() => setIsInputFocused(true)} onBlur={() => setIsInputFocused(false)} className="flex-1 h-10 md:h-12 text-[15px] md:text-base bg-card/50 backdrop-blur-sm border-border/50" disabled={isSubmitting} />
              <Button type="submit" size="lg" className="h-10 md:h-12 px-6 md:px-8 liquid-glass text-foreground font-semibold rounded-xl text-[15px] md:text-base" disabled={isSubmitting}>
                {isSubmitting ? <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Joining...
                  </span> : 'Join Waitlist'}
              </Button>
            </div>
            <p className="text-[13px] md:text-xs text-muted-foreground text-center mt-4 md:mt-3">
              Be the first to know when we launch. No spam, promise! 
            </p>
          </form> : <div className="text-center parallax-scale bg-card/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-border/50">
            
            <h2 className="text-[19px] md:text-xl font-semibold mb-2">You're on the list!</h2>
            <p className="text-[15px] md:text-base text-muted-foreground">
              We'll let you know as soon as Stock Bestie is ready for you.
            </p>
          </div>}

      </main>

      {/* Footer with parallax */}
      <footer className="py-2 md:py-6 text-center relative z-10 parallax-up stagger-5">
        <p className="text-[13px] md:text-xs text-muted-foreground">
          © 2025 Stock Bestie by{' '}
          <a href="https://www.hanahjuly.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Hanah July
          </a>
        </p>
      </footer>
    </div>;
};
export default Landing;