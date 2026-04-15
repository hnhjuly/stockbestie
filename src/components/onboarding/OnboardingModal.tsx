import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronLeft, Flame, Star, BookOpen, Zap, CheckCircle, DollarSign, Building2, Landmark, Dices, Home, Heart, TrendingUp, GraduationCap, Trophy, BarChart3, Sparkles, Gamepad2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  { id: 'welcome', type: 'welcome' },
  { id: 'goal', type: 'goal' },
  {
    id: 'why', type: 'choice',
    h: 'Why do you want to learn?',
    sub: "We'll personalise your path.",
    choices: [
      { icon: <Home className="w-4 h-4 text-primary" />, t: 'Buy a home someday', d: 'Big life goals' },
      { icon: <Heart className="w-4 h-4 text-success" />, t: 'Less financial stress', d: 'Understand your money' },
      { icon: <TrendingUp className="w-4 h-4 text-warning" />, t: 'Grow my wealth', d: 'Make money work for you' },
      { icon: <GraduationCap className="w-4 h-4 text-primary" />, t: 'Just learn the basics', d: 'Know what everyone else knows' },
    ]
  },
  {
    id: 'level', type: 'choice',
    h: 'How much do you know about investing?',
    sub: 'Be honest — no judgment.',
    choices: [
      { icon: <Sparkles className="w-4 h-4 text-success" />, t: 'Total beginner', d: 'What even is a stock?' },
      { icon: <Zap className="w-4 h-4 text-warning" />, t: 'Know a little', d: 'Fuzzy on the details' },
      { icon: <BarChart3 className="w-4 h-4 text-primary" />, t: 'Getting comfortable', d: 'Invested a bit before' },
      { icon: <Trophy className="w-4 h-4 text-warning" />, t: 'Pretty confident', d: 'Looking to sharpen my edge' },
    ]
  },
  { id: 'plan', type: 'plan' },
  { id: 'quiz', type: 'quiz' },
  { id: 'promise', type: 'promise' },
  { id: 'signup', type: 'signup' },
] as const;

type StepType = typeof STEPS[number];

const OnboardingModal = ({ isOpen, onClose }: OnboardingModalProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({ goal: 10 });
  const [quizDone, setQuizDone] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState<boolean | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [animDir, setAnimDir] = useState<'up' | 'dn'>('up');
  const bodyRef = useRef<HTMLDivElement>(null);

  const current = STEPS[step];
  const pct = Math.round(step / (STEPS.length - 1) * 100);

  const goNext = () => {
    if (step < STEPS.length - 1) {
      setSelectedChoice(null);
      setAnimDir('up');
      setStep(s => s + 1);
    } else {
      doFinish();
    }
  };

  const goBack = () => {
    if (step > 0) {
      setSelectedChoice(null);
      setAnimDir('dn');
      setStep(s => s - 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setStep(0);
    setAnswers({ goal: 10 });
    setQuizDone(false);
    setQuizCorrect(null);
    setSelectedChoice(null);
    setFinished(false);
    onClose();
  };

  const doFinish = () => setFinished(true);

  const handleChoiceSelect = (value: string, stepId: string) => {
    setSelectedChoice(value);
    setAnswers(a => ({ ...a, [stepId]: value }));
    setTimeout(goNext, 300);
  };

  const handleQuizAnswer = (index: number, correct: boolean) => {
    if (quizDone) return;
    setQuizDone(true);
    setQuizCorrect(correct);
    setSelectedChoice(String(index));
  };

  if (!isOpen) return null;

  const renderStep = () => {
    if (finished) {
      return (
        <>
          <div className="flex-1 overflow-y-auto p-4 text-center">
            <div className="mb-2 flex justify-center"><Sparkles className="w-12 h-12 text-primary animate-bounce" /></div>
            <div className="inline-flex items-center gap-1.5 bg-warning/10 border border-warning/30 rounded-full px-3 py-1 text-xs font-bold text-warning font-mono mb-3">
              <Star className="w-3 h-3" /> +10 XP unlocked!
            </div>
            <h2 className="text-lg font-extrabold tracking-tight text-primary mb-1.5">You're in!</h2>
            <p className="text-sm text-muted-foreground mb-3">Welcome to StockBestie. Your streak starts now.</p>
            <div className="flex gap-1.5 mb-3">
              {[{ n: '1', l: 'Day Streak', icon: <Flame className="w-4 h-4 text-destructive" /> }, { n: '10', l: 'XP Earned', icon: <Zap className="w-4 h-4 text-warning" /> }, { n: '1', l: 'Lesson Done', icon: <BookOpen className="w-4 h-4 text-primary" /> }].map(s => (
                <div key={s.l} className="flex-1 p-2 bg-muted border border-border rounded-lg text-center">
                  <div className="text-lg font-black tracking-tight flex items-center justify-center gap-1">{s.icon}{s.n}</div>
                  <div className="text-[8px] font-semibold text-muted-foreground uppercase tracking-wider font-mono mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="bg-muted border border-border rounded-xl p-3 text-left border-l-[3px] border-l-primary">
              <div className="text-[8.5px] font-bold text-primary uppercase tracking-widest font-mono mb-1">Phase 02 Unlocks Next →</div>
              <div className="text-[12.5px] font-bold mb-0.5">Company Basics</div>
              <div className="text-[11px] text-muted-foreground">Learn how to spot a 'Bestie' business from a 'Basic' one.</div>
            </div>
          </div>
          <div className="p-3 pt-2 border-t border-border bg-card shrink-0">
            <button onClick={() => navigate('/auth')} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold">Go to the app →</button>
            <button onClick={() => { setStep(0); setFinished(false); setQuizDone(false); setQuizCorrect(null); setSelectedChoice(null); }} className="w-full py-2.5 bg-background text-foreground border border-border rounded-xl text-sm font-semibold mt-1.5">↩ Restart demo</button>
          </div>
        </>
      );
    }

    switch (current.type) {
      case 'welcome':
        return (
          <>
            <div className="flex-1 overflow-y-auto p-4 text-center">
              <div className="mb-1 flex justify-center"><Sparkles className="w-14 h-14 text-primary animate-bounce" /></div>
              <h2 className="text-[19px] font-extrabold tracking-tight mt-1 mb-1.5">Meet your money bestie.</h2>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">The fun way to finally understand stocks, investing & wealth — in just 5 minutes a day.</p>
              <div className="flex flex-col gap-1.5 text-left">
                {[
                  { icon: <Gamepad2 className="w-4 h-4 text-primary" />, t: 'Gamified lessons that feel like a game' },
                  { icon: <Flame className="w-4 h-4 text-destructive" />, t: 'Daily streaks that build real habits' },
                  { icon: <Trophy className="w-4 h-4 text-warning" />, t: 'XP, rank tiers & leaderboards' },
                ].map(item => (
                  <div key={item.t} className="flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-2 text-xs font-medium">
                    {item.icon} {item.t}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 pt-2 border-t border-border bg-card shrink-0">
              <button onClick={goNext} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold">Get started — it's free</button>
              <button onClick={goNext} className="w-full py-2.5 bg-background text-foreground border border-border rounded-xl text-sm font-semibold mt-1.5">I already have an account</button>
            </div>
          </>
        );

      case 'goal':
        return (
          <>
            <div className="flex-1 overflow-y-auto p-4 text-center">
              <div className="text-[9px] font-bold text-primary uppercase tracking-widest font-mono mb-2 flex items-center justify-center gap-1.5">
                <span className="w-2.5 h-px bg-primary" /> Step 1 of 3 <span className="w-2.5 h-px bg-primary" />
              </div>
              <h2 className="text-lg font-extrabold tracking-tight mb-1.5">What's your daily XP goal?</h2>
              <p className="text-sm text-muted-foreground mb-3">You can always change this later.</p>
              <div className="flex gap-1.5 justify-center">
                {[
                  { v: 5, icon: <Flame className="w-4 h-4 text-destructive" />, l: 'Casual' },
                  { v: 10, icon: <><Flame className="w-4 h-4 text-destructive" /><Flame className="w-4 h-4 text-destructive" /></>, l: 'Regular' },
                  { v: 15, icon: <><Flame className="w-4 h-4 text-destructive" /><Flame className="w-4 h-4 text-destructive" /><Flame className="w-4 h-4 text-destructive" /></>, l: 'Serious' },
                  { v: 20, icon: <><Zap className="w-4 h-4 text-warning" /><Zap className="w-4 h-4 text-warning" /></>, l: 'Intense' },
                ].map(g => (
                  <button
                    key={g.v}
                    onClick={() => setAnswers(a => ({ ...a, goal: g.v }))}
                    className={cn(
                      "flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border-[1.5px] min-w-[58px] transition-all",
                      answers.goal === g.v ? "border-primary bg-primary/5" : "border-border bg-background hover:border-primary"
                    )}
                  >
                    <span className="flex items-center">{g.icon}</span>
                    <span className="text-[9.5px] font-bold text-primary font-mono">{g.v} XP</span>
                    <span className="text-[8.5px] text-muted-foreground">{g.l}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-3 pt-2 border-t border-border bg-card shrink-0">
              <button onClick={goNext} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold">Set my goal</button>
            </div>
          </>
        );

      case 'choice': {
        const s = current as Extract<StepType, { type: 'choice' }>;
        const stepNum = s.id === 'why' ? '2' : '3';
        return (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="text-[9px] font-bold text-primary uppercase tracking-widest font-mono mb-2 flex items-center justify-center gap-1.5">
                <span className="w-2.5 h-px bg-primary" /> Step {stepNum} of 3 <span className="w-2.5 h-px bg-primary" />
              </div>
              <h2 className="text-lg font-extrabold tracking-tight text-left mb-1.5">{s.h}</h2>
              <p className="text-sm text-muted-foreground text-left mb-3">{s.sub}</p>
              <div className="flex flex-col gap-1.5">
                {s.choices.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => handleChoiceSelect(String(i), s.id)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2.5 border-[1.5px] rounded-xl text-left transition-all",
                      selectedChoice === String(i) ? "border-primary bg-primary/5" : "border-border bg-background hover:border-primary hover:bg-primary/5"
                    )}
                  >
                    <span className="w-5 text-center shrink-0">{c.icon}</span>
                    <span>
                      <div className="text-[12.5px] font-semibold">{c.t}</div>
                      <div className="text-[10.5px] text-muted-foreground mt-0.5">{c.d}</div>
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-3 pt-2 border-t border-border bg-card shrink-0">
              <button disabled={!selectedChoice} onClick={goNext} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold disabled:bg-border disabled:text-muted-foreground">Continue</button>
            </div>
          </>
        );
      }

      case 'plan':
        return (
          <>
            <div className="flex-1 overflow-y-auto p-4 text-center">
              <div className="mb-1 flex justify-center"><CheckCircle className="w-12 h-12 text-success animate-bounce" /></div>
              <h2 className="text-lg font-extrabold tracking-tight mb-1.5">You're all set!</h2>
              <p className="text-sm text-muted-foreground mb-3">Here's your personalised learning plan.</p>
              <div className="flex flex-col gap-1.5">
                {[
                  `Daily goal: ${answers.goal || 10} XP / day`,
                  'Path: Phase 01 — What is a Stock?',
                  'Time: 5 mins / day',
                  'First lesson: What is a Stock?',
                ].map((t, i) => (
                  <div key={i} className="flex items-center gap-2 px-2.5 py-2 bg-muted border border-border rounded-lg" style={{ animationDelay: `${i * 0.07}s` }}>
                    <div className="w-5 h-5 rounded-md bg-primary flex items-center justify-center shrink-0"><CheckCircle className="w-3 h-3 text-primary-foreground" /></div>
                    <span className="text-[11.5px] font-medium" dangerouslySetInnerHTML={{ __html: t.replace(/^(.*?:)/, '<span class="text-muted-foreground">$1</span>') }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 pt-2 border-t border-border bg-card shrink-0">
              <button onClick={goNext} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold">Let's go! →</button>
            </div>
          </>
        );

      case 'quiz':
        return (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="inline-flex items-center gap-1.5 bg-primary/5 border border-primary/30 rounded-lg px-2.5 py-1 text-[9px] font-bold text-primary font-mono uppercase tracking-wider mb-3">
                <Zap className="w-3 h-3" /> Phase 01 Preview
              </div>
              <h2 className="text-base font-extrabold tracking-tight text-left mb-3">
                What does it mean to own a <span className="text-primary">stock</span>?
              </h2>
              <div className="flex flex-col gap-1.5">
                {[
                  { icon: <DollarSign className="w-4 h-4 text-success" />, t: "You're lending money to a company", correct: false },
                  { icon: <Building2 className="w-4 h-4 text-primary" />, t: 'You own a small piece of a company', correct: true },
                  { icon: <Landmark className="w-4 h-4 text-muted-foreground" />, t: "You're opening a savings account", correct: false },
                  { icon: <Dices className="w-4 h-4 text-warning" />, t: "You're betting on the stock price", correct: false },
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuizAnswer(i, q.correct)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2.5 border-[1.5px] rounded-xl text-left transition-all",
                      quizDone && q.correct ? "border-success bg-success/5" :
                      quizDone && selectedChoice === String(i) && !q.correct ? "border-destructive bg-destructive/5 animate-shake" :
                      "border-border bg-background hover:border-primary hover:bg-primary/5",
                      quizDone && "pointer-events-none"
                    )}
                  >
                    <span className="w-5 text-center shrink-0">{q.icon}</span>
                    <span className="text-[12.5px] font-semibold">{q.t}</span>
                  </button>
                ))}
              </div>
              {quizDone && (
                <div className={cn("rounded-xl p-3 mt-2", quizCorrect ? "bg-success/5 border border-success/30" : "bg-destructive/5 border border-destructive/30")}>
                  <div className={cn("text-xs font-bold mb-0.5 flex items-center gap-1", quizCorrect ? "text-success" : "text-destructive")}>
                    {quizCorrect ? <><Sparkles className="w-3.5 h-3.5" /> Correct!</> : "Not quite — that's why we're here!"}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {quizCorrect
                      ? 'A stock = ownership. When the company grows, your slice does too!'
                      : "A stock = ownership in a company. You'll nail it next time!"}
                  </div>
                </div>
              )}
            </div>
            <div className="p-3 pt-2 border-t border-border bg-card shrink-0">
              {quizDone && (
                <button onClick={goNext} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold">Continue</button>
              )}
            </div>
          </>
        );

      case 'promise':
        return (
          <>
            <div className="flex-1 overflow-y-auto p-4 text-center">
              <div className="mb-1 flex justify-center"><Sparkles className="w-12 h-12 text-primary animate-bounce" /></div>
              <div className="inline-flex items-center gap-1.5 bg-warning/10 border border-warning/30 rounded-full px-3 py-1 text-xs font-bold text-warning font-mono mb-3">
                <Star className="w-3 h-3" /> +10 XP — first lesson done!
              </div>
              <h2 className="text-lg font-extrabold tracking-tight mb-1.5">You just learned something real.</h2>
              <p className="text-sm text-muted-foreground mb-3">Here's what's waiting inside the app:</p>
              <div className="flex gap-1.5 mb-3">
                {[{ n: '50+', l: 'Lessons', icon: <BookOpen className="w-4 h-4 text-primary" /> }, { n: '', l: 'Streaks', icon: <Flame className="w-5 h-5 text-destructive" /> }, { n: '', l: 'Rankings', icon: <Trophy className="w-5 h-5 text-warning" /> }].map(s => (
                  <div key={s.l} className="flex-1 p-2 bg-muted border border-border rounded-lg text-center">
                    <div className="text-lg font-black tracking-tight flex items-center justify-center gap-0.5">{s.icon}{s.n}</div>
                    <div className="text-[8px] font-semibold text-muted-foreground uppercase tracking-wider font-mono mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-1.5 text-left">
                {[
                  { icon: <TrendingUp className="w-4 h-4 text-primary" />, t: 'Stocks & ETFs explained simply' },
                  { icon: <BarChart3 className="w-4 h-4 text-primary" />, t: 'Real examples from real companies' },
                  { icon: <Star className="w-4 h-4 text-warning" />, t: 'Daily challenges & XP rewards' },
                  { icon: <BookOpen className="w-4 h-4 text-primary" />, t: 'Glossary of 100+ finance terms' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-2 text-xs font-medium">
                    {item.icon} {item.t}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 pt-2 border-t border-border bg-card shrink-0">
              <button onClick={goNext} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold">Create my free account →</button>
            </div>
          </>
        );

      case 'signup':
        return (
          <>
            <div className="flex-1 overflow-y-auto p-4 text-center pt-2">
              <div className="mb-2 flex justify-center"><Heart className="w-10 h-10 text-success animate-bounce" /></div>
              <h2 className="text-lg font-extrabold tracking-tight mb-1.5">Save your progress!</h2>
              <p className="text-sm text-muted-foreground mb-3">Create a free account to keep your XP, streak & lessons.</p>
              <button onClick={() => navigate('/auth')} className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border border-border bg-background text-foreground hover:bg-muted mb-1.5">
                <svg width="15" height="15" viewBox="0 0 48 48"><path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.3 7.3-10.6 7.3-17.2z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.9 2.2-8 2.2-6.1 0-11.3-4.1-13.1-9.7H2.6v6.2C6.5 42.5 14.7 48 24 48z"/><path fill="#FBBC05" d="M10.9 28.7c-.5-1.4-.7-2.9-.7-4.7s.2-3.3.7-4.7v-6.2H2.6C.9 16.6 0 20.2 0 24s.9 7.4 2.6 10.9l8.3-6.2z"/><path fill="#EA4335" d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.7-6.7C35.9 2.4 30.5 0 24 0 14.7 0 6.5 5.5 2.6 13.1l8.3 6.2C12.7 13.6 17.9 9.5 24 9.5z"/></svg>
                Continue with Google
              </button>
              <button onClick={() => navigate('/auth')} className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-foreground text-background mb-1.5">
                <svg width="13" height="16" viewBox="0 0 18 22" fill="currentColor"><path d="M14.05 11.37c-.02-2.3 1.88-3.41 1.97-3.47-1.08-1.57-2.75-1.79-3.34-1.81-1.42-.14-2.78.84-3.5.84-.72 0-1.83-.82-3.01-.8-1.54.02-2.97.9-3.76 2.28-1.6 2.78-.41 6.9 1.15 9.16.77 1.11 1.68 2.35 2.87 2.31 1.16-.05 1.59-.74 2.99-.74 1.4 0 1.79.74 3.01.72 1.24-.02 2.02-1.13 2.77-2.25.88-1.28 1.24-2.53 1.26-2.59-.03-.01-2.39-.92-2.41-3.65z"/><path d="M11.73 4.48c.64-.78 1.07-1.86.95-2.94-.92.04-2.03.61-2.69 1.38-.59.68-1.1 1.77-.96 2.82 1.02.08 2.07-.52 2.7-1.26z"/></svg>
                Continue with Apple
              </button>
              <div className="flex items-center gap-2 my-2">
                <div className="flex-1 h-px bg-border" />
                <span className="text-[10px] font-semibold text-muted-foreground font-mono">OR</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <input type="email" placeholder="Enter your email" className="w-full px-3 py-2.5 border-[1.5px] border-border rounded-lg text-sm outline-none focus:border-primary transition-colors bg-background mb-2" />
            </div>
            <div className="p-3 pt-2 border-t border-border bg-card shrink-0">
              <button onClick={() => navigate('/auth')} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold">Create free account</button>
              <p className="text-[10px] text-muted-foreground text-center mt-2 leading-snug">
                By continuing you agree to our <u className="cursor-pointer">Terms</u> & <u className="cursor-pointer">Privacy Policy</u>.
              </p>
            </div>
          </>
        );
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[900] bg-foreground/60 backdrop-blur-[10px] flex items-center justify-center p-4 transition-opacity duration-200"
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        {/* Modal Shell */}
        <div className="w-[372px] max-h-[88vh] bg-background rounded-[22px] shadow-2xl overflow-hidden flex flex-col transition-transform duration-300">
          {/* Header */}
          <div className="bg-card border-b border-border px-3.5 py-2.5 flex items-center gap-2.5 shrink-0">
            <div className="w-[26px] h-[26px] bg-foreground rounded-[7px] flex items-center justify-center text-[10px] font-bold text-background tracking-tight">S$</div>
            <div>
              <div className="text-[13px] font-bold tracking-tight">StockBestie</div>
              <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">Let's get you set up <GraduationCap className="w-3 h-3" /></div>
            </div>
          </div>

          {/* Progress Bar */}
          {current.type !== 'signup' && current.type !== 'welcome' && !finished && (
            <div className="bg-card border-b border-border px-3.5 py-1.5 flex items-center gap-2.5 shrink-0">
              <button onClick={goBack} className="text-lg text-muted-foreground bg-transparent border-none p-0.5 leading-none" style={{ opacity: step === 0 ? 0 : 1 }}>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex-1 h-[7px] bg-muted rounded overflow-hidden">
                <div className="h-full bg-primary rounded transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}

          {renderStep()}
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={handleClose}
        className="fixed top-4 right-4 z-[910] w-[30px] h-[30px] rounded-full bg-foreground/50 text-background border-none flex items-center justify-center hover:bg-foreground/80 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </>
  );
};

export default OnboardingModal;
