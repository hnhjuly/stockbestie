import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ACADEMY_LESSONS } from '@/data/academyQuestions';
import { Lesson, LessonQuestion } from '@/types/academy';
import { BottomNav } from '@/components/BottomNav';
import stockBestieLogo from '@/assets/stock-bestie-logo.png';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '@iconify/react';

const Academy: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewState, setViewState] = useState<'map' | 'lesson' | 'pro' | 'selector' | 'courseMap'>('selector');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [sessionQuestions, setSessionQuestions] = useState<LessonQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isStudyMode, setIsStudyMode] = useState(true);
  const [lives, setLives] = useState(3);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [isPro, setIsPro] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('stockbestie-academy-progress');
    if (saved) {
      const { completed, isPro: savedPro } = JSON.parse(saved);
      setCompletedLessons(completed || []);
      setIsPro(savedPro ?? false);
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('stockbestie-academy-progress', JSON.stringify({
      completed: completedLessons,
      isPro
    }));
  }, [completedLessons, isPro]);

  // Handle ?startQuiz=:id from the reading page → jump straight into the quiz
  useEffect(() => {
    const startQuizId = searchParams.get('startQuiz');
    if (!startQuizId) return;
    const lesson = ACADEMY_LESSONS.find(l => l.id === Number(startQuizId));
    if (lesson) {
      startLesson(lesson);
    }
    // Clear the param so refresh doesn't retrigger
    searchParams.delete('startQuiz');
    setSearchParams(searchParams, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startLesson = (lesson: Lesson) => {
    if (!isPro && completedLessons.length >= 1) {
      setViewState('pro');
      return;
    }

    // Pick a balanced mix from tiers: 4 Basic, 4 Understanding, 2 Situation
    const questions = lesson.questions || [];
    const basic = questions.filter(q => q.tier === 'basic').sort(() => 0.5 - Math.random());
    const understanding = questions.filter(q => q.tier === 'understanding').sort(() => 0.5 - Math.random());
    const situation = questions.filter(q => q.tier === 'situation').sort(() => 0.5 - Math.random());

    const selected = [
      ...basic.slice(0, 4),
      ...understanding.slice(0, 4),
      ...situation.slice(0, 2)
    ].sort(() => 0.5 - Math.random()).map(q => ({
      ...q,
      options: [...q.options].sort(() => 0.5 - Math.random())
    }));

    setSessionQuestions(selected);
    setActiveLesson(lesson);
    setViewState('lesson');
    setCurrentQuestionIdx(0);
    setSelectedOptionId(null);
    setShowFeedback(false);
    setIsStudyMode(true);
    setLives(3);
  };

  const startCourse = (lesson: Lesson) => {
    if (!isPro && completedLessons.length >= 1) {
      setViewState('pro');
      return;
    }
    navigate(`/academy/lesson/${lesson.id}`);
  };

  const handleEvaluate = () => {
    const currentQ = sessionQuestions[currentQuestionIdx];
    const isCorrect = currentQ.options.find(o => o.id === selectedOptionId)?.isCorrect;
    if (!isCorrect) {
      setLives(prev => Math.max(0, prev - 1));
    }
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    if (lives <= 0) {
      setViewState('pro');
      return;
    }

    if (currentQuestionIdx < sessionQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOptionId(null);
      setShowFeedback(false);
      setIsStudyMode(true);
    } else {
      setCompletedLessons(prev => [...new Set([...prev, activeLesson?.id || 0])]);
      setViewState(isPro ? 'map' : 'pro');
    }
  };

  const currentQuestion = sessionQuestions[currentQuestionIdx];
  const isCorrect = currentQuestion?.options.find(o => o.id === selectedOptionId)?.isCorrect;

  return (
    <div className="min-h-screen bg-background pb-20">
      <AnimatePresence mode="wait">
        {viewState === 'selector' && (
          <motion.div
            key="selector-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
              <div className="container mx-auto px-4 py-3 md:py-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 md:gap-3 min-w-0">
                    <Link to="/app" className="p-1 md:p-2 flex-shrink-0">
                      <img src={stockBestieLogo} alt="Stock Bestie Logo" className="h-10 w-10 md:h-12 md:w-12 object-contain logo-float" />
                    </Link>
                    <div className="min-w-0">
                      <h1 className="text-lg md:text-2xl font-bold truncate">Bestie Academy</h1>
                      <p className="text-xs md:text-sm text-muted-foreground truncate flex items-center gap-1">
                        Learn stocks the fun way! <Icon icon="fxemoji:graduationcap" className="w-4 h-4 inline-block" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-8 md:mb-10"
              >
                <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black tracking-[0.3em] uppercase rounded-full mb-6 border border-primary/20">
                  Choose Your Mode
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-none mb-4">
                  How do you want to <span className="text-primary">learn?</span>
                </h2>
                <p className="text-muted-foreground font-medium text-base md:text-lg max-w-md mx-auto leading-relaxed">
                  Read the lesson first, or jump straight into the quiz. Either way, Bestie's got you.
                </p>
              </motion.div>

              <div className="flex flex-row gap-4 w-full max-w-xl">
                <motion.button
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setViewState('courseMap')}
                  className="relative flex-1 rounded-3xl border-2 border-primary/15 bg-card shadow-lg p-6 flex flex-col items-center gap-3 text-center overflow-hidden group"
                >
                  <span className="pointer-events-none absolute inset-0 z-0 translate-x-[-100%] animate-[shimmer_2.6s_ease-in-out_infinite] bg-[linear-gradient(105deg,transparent_40%,rgba(99,153,255,0.13)_50%,transparent_60%)] bg-[length:200%_100%]" />
                  <span className="pointer-events-none absolute inset-0 z-0 rounded-3xl opacity-0 ring-0 ring-primary/0 transition-all duration-300 group-hover:opacity-100 group-hover:ring-[3px] group-hover:ring-primary/40 group-hover:shadow-[0_0_18px_4px_rgba(99,153,255,0.18)] group-active:ring-[4px] group-active:ring-primary/60 group-active:shadow-[0_0_24px_6px_rgba(99,153,255,0.28)]" />
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl z-10 relative">
                    📖
                  </div>
                  <div className="z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-1">Read First</p>
                    <h3 className="text-lg font-black text-foreground tracking-tight mb-1">Course</h3>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                      Calm, beginner-friendly lessons before the quiz
                    </p>
                  </div>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setViewState('map')}
                  className="relative flex-1 rounded-3xl border-2 border-primary/15 bg-card shadow-lg p-6 flex flex-col items-center gap-3 text-center overflow-hidden group"
                >
                  <span className="pointer-events-none absolute inset-0 z-0 translate-x-[-100%] animate-[shimmer_2.6s_ease-in-out_infinite] bg-[linear-gradient(105deg,transparent_40%,rgba(99,153,255,0.13)_50%,transparent_60%)] bg-[length:200%_100%]" />
                  <span className="pointer-events-none absolute inset-0 z-0 rounded-3xl opacity-0 ring-0 ring-primary/0 transition-all duration-300 group-hover:opacity-100 group-hover:ring-[3px] group-hover:ring-primary/40 group-hover:shadow-[0_0_18px_4px_rgba(99,153,255,0.18)] group-active:ring-[4px] group-active:ring-primary/60 group-active:shadow-[0_0_24px_6px_rgba(99,153,255,0.28)]" />
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl z-10 relative">
                    ✏️
                  </div>
                  <div className="z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-1">Jump In</p>
                    <h3 className="text-lg font-black text-foreground tracking-tight mb-1">Quiz</h3>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                      Test what you know — situational, challenge-based
                    </p>
                  </div>
                </motion.button>
              </div>
              <style>{`
                @keyframes shimmer {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(100%); }
                }
              `}</style>
            </div>
          </motion.div>
        )}

        {viewState === 'map' && (
          <motion.div
            key="map-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            {/* Header */}
            <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
              <div className="container mx-auto px-4 py-3 md:py-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 md:gap-3 min-w-0">
                    <Link to="/app" className="p-1 md:p-2 flex-shrink-0">
                      <img src={stockBestieLogo} alt="Stock Bestie Logo" className="h-10 w-10 md:h-12 md:w-12 object-contain logo-float" />
                    </Link>
                    <button
                      onClick={() => setViewState('selector')}
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors flex-shrink-0"
                      aria-label="Back to mode selector"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <div className="min-w-0">
                      <h1 className="text-lg md:text-2xl font-bold truncate">Bestie Academy</h1>
                      <p className="text-xs md:text-sm text-muted-foreground truncate flex items-center gap-1">Learn stocks the fun way! <Icon icon="fxemoji:graduationcap" className="w-4 h-4 inline-block" /></p>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Lesson Map */}
            <div className="container mx-auto px-4 py-8 md:py-16">
              <div className="text-center mb-12 md:mb-20">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black tracking-[0.3em] uppercase rounded-full mb-6 border border-primary/20"
                >
                  Stock Academy Trial
                </motion.div>
                <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-none mb-4">
                  The Master <span className="text-primary">Curriculum.</span>
                </h2>
                <p className="text-muted-foreground font-medium text-base md:text-lg max-w-lg mx-auto leading-relaxed">
                  Situational-based learning. First we teach, then we test. 10 random modules per session.
                </p>
              </div>

              <div className="relative flex flex-col items-center gap-16 md:gap-32 w-full pb-20 md:pb-40 max-w-2xl mx-auto">
                {ACADEMY_LESSONS.map((lesson, idx) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  const isLocked = !isPro && idx > 0 && !completedLessons.includes(ACADEMY_LESSONS[idx - 1].id);
                  const level = idx + 1;

                  return (
                    <motion.div
                      key={lesson.id}
                      initial={{ x: idx % 2 === 0 ? -40 : 40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.08 }}
                      className={`relative flex items-center w-full px-4 md:px-12 ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                    >
                      <div className="relative flex-shrink-0">
                        <motion.button
                          whileHover={isLocked ? {} : { scale: 1.05, y: -10 }}
                          whileTap={isLocked ? {} : { scale: 0.96 }}
                          onClick={() => !isLocked && startLesson(lesson)}
                          className={`w-20 h-20 md:w-36 md:h-36 rounded-3xl md:rounded-[3rem] flex items-center justify-center text-2xl md:text-4xl font-black relative z-10 transition-all border-4 ${
                            isCompleted
                              ? 'bg-primary border-primary/80 text-primary-foreground shadow-2xl'
                              : isLocked
                                ? 'bg-muted border-muted-foreground/20 text-muted-foreground/40 cursor-not-allowed shadow-none'
                                : 'bg-card border-primary/20 text-foreground shadow-xl'
                          }`}
                        >
                          {isCompleted ? <Icon icon="fxemoji:glowingstar" className="w-8 h-8 md:w-12 md:h-12" /> : level}
                          {!isCompleted && !isLocked && (
                            <div className="absolute -inset-2 border-2 border-dashed border-primary/60 rounded-3xl md:rounded-[3.5rem] animate-[spin_10s_linear_infinite]" />
                          )}
                        </motion.button>
                      </div>

                      <div className={`flex-1 ${idx % 2 === 0 ? 'pl-6 md:pl-16 text-left' : 'pr-6 md:pr-16 text-right'}`}>
                        <p className={`text-[10px] font-black uppercase tracking-[0.4em] mb-1 ${isLocked ? 'text-muted-foreground/40' : 'text-primary'}`}>
                          Phase 0{level}
                        </p>
                        <h4 className={`text-base md:text-2xl font-black tracking-tight mb-1 md:mb-2 ${isLocked ? 'text-muted-foreground/40' : 'text-foreground'}`}>
                          {lesson.title}
                        </h4>
                        <p className={`text-xs md:text-sm font-medium leading-relaxed max-w-xs ${isLocked ? 'text-muted-foreground/30' : 'text-muted-foreground'} ${idx % 2 !== 0 ? 'ml-auto' : ''}`}>
                          {lesson.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {viewState === 'courseMap' && (
          <motion.div
            key="course-map-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
              <div className="container mx-auto px-4 py-3 md:py-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 md:gap-3 min-w-0">
                    <Link to="/app" className="p-1 md:p-2 flex-shrink-0">
                      <img src={stockBestieLogo} alt="Stock Bestie Logo" className="h-10 w-10 md:h-12 md:w-12 object-contain logo-float" />
                    </Link>
                    <button
                      onClick={() => setViewState('selector')}
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors flex-shrink-0"
                      aria-label="Back to mode selector"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <div className="min-w-0">
                      <h1 className="text-lg md:text-2xl font-bold truncate">Bestie Academy</h1>
                      <p className="text-xs md:text-sm text-muted-foreground truncate flex items-center gap-1">Read the lesson <Icon icon="fxemoji:books" className="w-4 h-4 inline-block" /></p>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <div className="container mx-auto px-4 py-8 md:py-16">
              <div className="text-center mb-12 md:mb-20">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black tracking-[0.3em] uppercase rounded-full mb-6 border border-primary/20"
                >
                  Course Mode
                </motion.div>
                <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-none mb-4">
                  Read the <span className="text-primary">Lessons.</span>
                </h2>
                <p className="text-muted-foreground font-medium text-base md:text-lg max-w-lg mx-auto leading-relaxed">
                  Tap a lesson to read it first. Then quiz yourself when you're ready.
                </p>
              </div>

              <div className="relative flex flex-col items-center gap-16 md:gap-32 w-full pb-20 md:pb-40 max-w-2xl mx-auto">
                {ACADEMY_LESSONS.map((lesson, idx) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  const isLocked = !isPro && idx > 0 && !completedLessons.includes(ACADEMY_LESSONS[idx - 1].id);
                  const level = idx + 1;

                  return (
                    <motion.div
                      key={lesson.id}
                      initial={{ x: idx % 2 === 0 ? -40 : 40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.08 }}
                      className={`relative flex items-center w-full px-4 md:px-12 ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                    >
                      <div className="relative flex-shrink-0">
                        <motion.button
                          whileHover={isLocked ? {} : { scale: 1.05, y: -10 }}
                          whileTap={isLocked ? {} : { scale: 0.96 }}
                          onClick={() => !isLocked && startCourse(lesson)}
                          className={`w-20 h-20 md:w-36 md:h-36 rounded-3xl md:rounded-[3rem] flex items-center justify-center text-2xl md:text-4xl font-black relative z-10 transition-all border-4 ${
                            isCompleted
                              ? 'bg-primary border-primary/80 text-primary-foreground shadow-2xl'
                              : isLocked
                                ? 'bg-muted border-muted-foreground/20 text-muted-foreground/40 cursor-not-allowed shadow-none'
                                : 'bg-card border-primary/20 text-foreground shadow-xl'
                          }`}
                        >
                          {isCompleted ? <Icon icon="fxemoji:glowingstar" className="w-8 h-8 md:w-12 md:h-12" /> : level}
                          {!isCompleted && !isLocked && (
                            <div className="absolute -inset-2 border-2 border-dashed border-primary/60 rounded-3xl md:rounded-[3.5rem] animate-[spin_10s_linear_infinite]" />
                          )}
                        </motion.button>
                      </div>

                      <div className={`flex-1 ${idx % 2 === 0 ? 'pl-6 md:pl-16 text-left' : 'pr-6 md:pr-16 text-right'}`}>
                        <p className={`text-[10px] font-black uppercase tracking-[0.4em] mb-1 ${isLocked ? 'text-muted-foreground/40' : 'text-primary'}`}>
                          Phase 0{level}
                        </p>
                        <h4 className={`text-base md:text-2xl font-black tracking-tight mb-1 md:mb-2 ${isLocked ? 'text-muted-foreground/40' : 'text-foreground'}`}>
                          {lesson.title}
                        </h4>
                        <p className={`text-xs md:text-sm font-medium leading-relaxed max-w-xs ${isLocked ? 'text-muted-foreground/30' : 'text-muted-foreground'} ${idx % 2 !== 0 ? 'ml-auto' : ''}`}>
                          {lesson.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {viewState === 'lesson' && activeLesson && (
          <motion.div
            key="lesson-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background flex flex-col"
          >
            {/* Lesson Header */}
            <header className="flex-shrink-0 max-w-6xl mx-auto w-full px-4 md:px-12 py-4 md:py-10 flex items-center gap-4 md:gap-16 border-b border-border bg-background">
              <button
                onClick={() => setViewState('map')}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors"
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
              </button>

              <div className="flex-1 space-y-2 md:space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                    Session Progress • {currentQuestionIdx + 1}/{sessionQuestions.length}
                  </span>
                  <div className="flex gap-1.5">
                    {[...Array(3)].map((_, i) => (
                      <motion.span
                        key={i}
                        animate={{ scale: i < lives ? 1 : 0.8, opacity: i < lives ? 1 : 0.2 }}
                        className={`w-2.5 h-2.5 rounded-full ${i < lives ? 'bg-destructive shadow-[0_0_8px_hsl(var(--destructive)/0.4)]' : 'bg-muted'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIdx + 1) / sessionQuestions.length) * 100}%` }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            </header>

            {/* Scrollable Center Content */}
            <main className="flex-1 overflow-y-auto w-full">
              <div className="min-h-full flex flex-col items-center justify-center p-4 md:p-12 max-w-4xl mx-auto w-full">
                <AnimatePresence mode="wait">
                  {isStudyMode ? (
                    <motion.div
                      key="study"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center space-y-8 md:space-y-12 py-6 md:py-10"
                    >
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-primary/10 text-primary rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center mx-auto shadow-sm">
                         <Icon icon="fxemoji:books" className="w-10 h-10 md:w-12 md:h-12" />
                      </div>
                      <div className="space-y-4 md:space-y-6">
                        <div className="flex flex-col items-center gap-2">
                          <h2 className="text-[11px] font-black text-primary uppercase tracking-[0.5em]">Lesson Concept</h2>
                          <span className="px-3 py-1 bg-primary/10 text-primary text-[9px] font-black uppercase rounded-full tracking-widest">
                            Tier: {currentQuestion?.tier}
                          </span>
                        </div>
                        <p className="text-xl md:text-3xl font-black text-foreground leading-snug max-w-2xl mx-auto tracking-tight">
                          {currentQuestion?.explanation}
                        </p>
                      </div>
                      <button
                        onClick={() => setIsStudyMode(false)}
                        className="px-10 md:px-14 py-4 md:py-6 bg-primary text-primary-foreground rounded-2xl font-black text-xs tracking-[0.4em] uppercase shadow-2xl hover:opacity-90 transition-opacity"
                      >
                        Start Challenge
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="quiz"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="w-full py-6 md:py-10"
                    >
                      <div className="flex items-center justify-between mb-4 md:mb-6">
                        <h2 className="text-[11px] font-black text-primary uppercase tracking-[0.5em]">
                          {currentQuestion?.tier === 'situation' ? 'Situational Quiz' : 'Concept Check'}
                        </h2>
                        <span className="px-3 py-1 bg-muted text-muted-foreground text-[9px] font-black uppercase rounded-full tracking-widest">
                          {currentQuestion?.tier}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-3xl font-black text-foreground mb-8 md:mb-14 leading-tight tracking-tight">
                        {currentQuestion?.question}
                      </h3>
                      <div className="space-y-3 md:space-y-5">
                        {currentQuestion?.options.map((opt, optIdx) => (
                          <motion.button
                            key={opt.id}
                            disabled={showFeedback}
                            whileHover={showFeedback ? {} : { scale: 1.02 }}
                            whileTap={showFeedback ? {} : { scale: 0.98 }}
                            onClick={() => setSelectedOptionId(opt.id)}
                            className={`w-full p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] text-left font-bold transition-all border-2 flex items-center gap-4 md:gap-7 ${
                              selectedOptionId === opt.id
                                ? 'border-primary bg-primary text-primary-foreground shadow-2xl'
                                : 'border-border bg-card text-muted-foreground hover:border-primary/30'
                            }`}
                          >
                            <div className={`w-8 h-8 md:w-11 md:h-11 rounded-full border-2 flex items-center justify-center text-xs md:text-sm font-black transition-colors flex-shrink-0 ${
                              selectedOptionId === opt.id ? 'border-primary-foreground/30 text-primary-foreground' : 'border-border text-muted-foreground/50'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </div>
                            <span className="text-sm md:text-xl tracking-tight">{opt.text}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </main>

            {/* Footer */}
            <footer className={`flex-shrink-0 py-4 md:py-12 px-4 md:px-12 transition-all duration-700 border-t border-border ${
              showFeedback
                ? (isCorrect ? 'bg-green-500/10' : 'bg-destructive/10')
                : 'bg-card'
            }`}>
              <div className="max-w-4xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4 md:gap-12">
                <div className="flex-1 w-full">
                  <AnimatePresence>
                    {showFeedback && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-4 md:gap-7 items-center"
                      >
                        <div className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center text-lg md:text-2xl shadow-xl ${
                          isCorrect ? 'bg-green-500 text-white' : 'bg-destructive text-destructive-foreground'
                        }`}>
                          {isCorrect ? '✓' : '✗'}
                        </div>
                        <div className="space-y-1 flex-1 min-w-0">
                          <h4 className={`text-base md:text-xl font-black ${isCorrect ? 'text-green-600' : 'text-destructive'}`}>
                            {isCorrect ? 'Excellent Logic' : 'Analysis Required'}
                          </h4>
                          <p className={`text-xs md:text-sm font-bold leading-relaxed ${isCorrect ? 'text-green-600/80' : 'text-destructive/80'}`}>
                            {currentQuestion?.explanationExtended || currentQuestion?.explanation}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {!isStudyMode && (
                  <button
                    disabled={!selectedOptionId && !showFeedback}
                    onClick={showFeedback ? nextQuestion : handleEvaluate}
                    className={`w-full md:w-auto px-8 md:px-16 py-4 md:py-6 rounded-2xl font-black text-[11px] md:text-[12px] tracking-[0.4em] uppercase transition-all shadow-2xl ${
                      showFeedback
                        ? (isCorrect ? 'bg-green-500 text-white' : 'bg-destructive text-destructive-foreground')
                        : selectedOptionId
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    {showFeedback
                      ? (currentQuestionIdx === sessionQuestions.length - 1 ? 'Finish Session' : 'Next Lesson')
                      : 'Submit Answer'
                    }
                  </button>
                )}
              </div>
            </footer>
          </motion.div>
        )}

        {viewState === 'pro' && (
          <motion.div
            key="pro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[200] bg-background/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <div className="bg-card rounded-3xl md:rounded-[3.5rem] max-w-xl w-full p-8 md:p-16 text-center space-y-6 md:space-y-8 shadow-2xl border border-border overflow-y-auto max-h-screen">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-primary/10 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center mx-auto mb-4">
                 <Icon icon="fxemoji:crystalball" className="w-12 h-12 md:w-14 md:h-14" />
               </div>
              <h2 className="text-2xl md:text-4xl font-black text-foreground tracking-tight">Access Restricted</h2>
              <p className="text-muted-foreground font-medium leading-relaxed">
                You've completed your trial session. To unlock all 90+ situational modules and track your portfolio mastery, upgrade to StockBestie Pro.
              </p>
              <button
                onClick={() => { setIsPro(true); setViewState('map'); }}
                className="w-full bg-primary text-primary-foreground py-4 md:py-6 rounded-2xl font-black text-xs tracking-[0.4em] uppercase shadow-2xl"
              >
                Upgrade to Pro
              </button>
              <button
                onClick={() => setViewState('map')}
                className="text-[11px] font-black text-muted-foreground uppercase tracking-widest block w-full hover:text-foreground transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      {(viewState === 'map' || viewState === 'selector' || viewState === 'courseMap') && <BottomNav />}
    </div>
  );
};

export default Academy;
