import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ACADEMY_LESSONS, Lesson } from '@/types/academy';
import { BottomNav } from '@/components/BottomNav';
import stockBestieLogo from '@/assets/stock-bestie-logo.png';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Academy: React.FC = () => {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [hearts, setHearts] = useState(3);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('stockbestie-academy-progress');
    if (saved) {
      const { completed, hearts: savedHearts } = JSON.parse(saved);
      setCompletedLessons(completed || []);
      setHearts(savedHearts ?? 3);
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('stockbestie-academy-progress', JSON.stringify({
      completed: completedLessons,
      hearts
    }));
  }, [completedLessons, hearts]);

  const startLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setCurrentQuestionIdx(0);
    setSelectedOptionId(null);
    setShowFeedback(false);
  };

  const handleOptionSelect = (id: string) => {
    if (showFeedback) return;
    setSelectedOptionId(id);
  };

  const checkAnswer = () => {
    setShowFeedback(true);
    const question = activeLesson?.questions[currentQuestionIdx];
    const isCorrect = question?.options.find(o => o.id === selectedOptionId)?.isCorrect;
    if (!isCorrect && hearts > 0) {
      setHearts(prev => prev - 1);
    }
  };

  const nextQuestion = () => {
    if (!activeLesson) return;
    if (currentQuestionIdx < activeLesson.questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOptionId(null);
      setShowFeedback(false);
    } else {
      // Finished lesson
      setCompletedLessons(prev => [...new Set([...prev, activeLesson.id])]);
      setActiveLesson(null);
    }
  };

  const currentQuestion = activeLesson?.questions[currentQuestionIdx];
  const isCorrect = currentQuestion?.options.find(o => o.id === selectedOptionId)?.isCorrect;

  return (
    <div className="min-h-screen bg-background pb-20">
      <AnimatePresence mode="wait">
        {!activeLesson ? (
          <motion.div 
            key="map"
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
                    <div className="min-w-0">
                      <h1 className="text-lg md:text-2xl font-bold truncate">Bestie Academy</h1>
                      <p className="text-xs md:text-sm text-muted-foreground truncate">Learn stocks the fun way! 🎓</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
                    <span className="text-lg">❤️</span>
                    <span className="font-bold text-primary">{hearts}</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Lesson Map */}
            <div className="container mx-auto px-4 py-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Skill Path</h2>
                <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Master the markets</p>
              </div>

              <div className="relative flex flex-col items-center gap-12 md:gap-16 w-full pb-20 max-w-2xl mx-auto">
                {/* Winding Path Line (SVG) */}
                <svg className="absolute top-10 w-24 h-full pointer-events-none opacity-10" viewBox="0 0 100 800">
                  <path d="M50 0 C 100 150, 0 300, 50 450 C 100 600, 0 750, 50 900" stroke="hsl(var(--primary))" strokeWidth="8" fill="none" strokeDasharray="20 20" />
                </svg>

                {ACADEMY_LESSONS.map((lesson, idx) => {
                  const isLocked = idx > 0 && !completedLessons.includes(ACADEMY_LESSONS[idx - 1].id);
                  const isCompleted = completedLessons.includes(lesson.id);

                  return (
                    <motion.div
                      key={lesson.id}
                      initial={{ x: idx % 2 === 0 ? -40 : 40, opacity: 0 }}
                      animate={{ x: idx % 2 === 0 ? -20 : 20, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative"
                    >
                      <motion.button
                        whileHover={isLocked ? {} : { scale: 1.1, y: -5 }}
                        whileTap={isLocked ? {} : { scale: 0.95 }}
                        onClick={() => !isLocked && startLesson(lesson)}
                        className={`w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center text-3xl md:text-4xl shadow-2xl relative z-10 transition-all border-4 ${
                          isCompleted 
                            ? 'bg-primary border-primary/80 text-primary-foreground shadow-primary/40' 
                            : isLocked 
                              ? 'bg-muted border-muted-foreground/20 text-muted-foreground/40 grayscale cursor-not-allowed' 
                              : 'bg-card border-primary/20 text-primary hover:border-primary/50'
                        }`}
                      >
                        {isCompleted ? '⭐' : lesson.icon}
                        
                        {/* Floating Progress ring for current level */}
                        {!isCompleted && !isLocked && (
                          <div className="absolute -inset-2 border-2 border-dashed border-primary/60 rounded-full animate-[spin_10s_linear_infinite]" />
                        )}
                      </motion.button>
                      
                      <div className={`absolute top-1/2 ${idx % 2 === 0 ? 'left-28 md:left-32' : 'right-28 md:right-32'} -translate-y-1/2 w-40 md:w-48 ${idx % 2 === 0 ? 'text-left' : 'text-right'}`}>
                        <h3 className={`font-black text-xs md:text-sm uppercase tracking-wider ${isLocked ? 'text-muted-foreground/40' : 'text-foreground'}`}>{lesson.title}</h3>
                        <p className="text-[10px] font-bold text-muted-foreground line-clamp-2">{lesson.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="lesson"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-[60] bg-background flex flex-col"
          >
            {/* Lesson Header */}
            <div className="px-4 md:px-6 py-6 md:py-8 flex items-center gap-4 md:gap-6 border-b border-border">
              <button 
                onClick={() => setActiveLesson(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" />
              </button>
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIdx + 1) / activeLesson.questions.length) * 100}%` }}
                  className="h-full bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.5)]"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">❤️</span>
                <span className="font-black text-foreground">{hearts}</span>
              </div>
            </div>

            {/* Question Body */}
            <div className="flex-1 flex flex-col p-6 md:p-8 max-w-xl mx-auto w-full overflow-y-auto">
              <h2 className="text-xl md:text-3xl font-black text-foreground mb-8 md:mb-12 leading-tight">
                {currentQuestion?.question}
              </h2>

              <div className="space-y-3 md:space-y-4">
                {currentQuestion?.options.map((opt) => (
                  <motion.button
                    key={opt.id}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOptionSelect(opt.id)}
                    className={`w-full p-4 md:p-6 rounded-2xl md:rounded-[2rem] text-left font-bold transition-all border-b-4 ${
                      selectedOptionId === opt.id 
                        ? 'bg-primary/10 border-primary text-primary' 
                        : 'bg-card border-border text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    <span className="mr-3 md:mr-4 text-muted-foreground/40">●</span>
                    {opt.text}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Actions & Feedback */}
            <div className={`p-6 md:p-8 border-t-2 transition-all duration-500 ${
              showFeedback 
                ? (isCorrect ? 'bg-green-500/10 border-green-500/20' : 'bg-destructive/10 border-destructive/20') 
                : 'bg-card border-border'
            }`}>
              <div className="max-w-xl mx-auto w-full">
                <AnimatePresence mode="wait">
                  {showFeedback ? (
                    <motion.div 
                      key="feedback"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="flex flex-col gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xl md:text-2xl ${
                          isCorrect ? 'bg-green-500 text-white' : 'bg-destructive text-destructive-foreground'
                        }`}>
                          {isCorrect ? '✓' : '✗'}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-black text-lg md:text-xl ${isCorrect ? 'text-green-600' : 'text-destructive'}`}>
                            {isCorrect ? 'Excellent Work!' : 'Not Quite Right'}
                          </h4>
                          <p className={`text-xs md:text-sm font-medium ${isCorrect ? 'text-green-600/80' : 'text-destructive/80'}`}>
                            {currentQuestion?.explanation}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={nextQuestion}
                        className={`w-full py-4 md:py-5 rounded-2xl font-black text-white shadow-lg ${
                          isCorrect ? 'bg-green-500 shadow-green-500/20' : 'bg-destructive shadow-destructive/20'
                        }`}
                      >
                        CONTINUE
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="check"
                      disabled={!selectedOptionId}
                      whileHover={selectedOptionId ? { scale: 1.02 } : {}}
                      whileTap={selectedOptionId ? { scale: 0.98 } : {}}
                      onClick={checkAnswer}
                      className={`w-full py-4 md:py-5 rounded-2xl font-black text-white transition-all ${
                        selectedOptionId 
                          ? 'bg-primary shadow-xl shadow-primary/20' 
                          : 'bg-muted text-muted-foreground cursor-not-allowed'
                      }`}
                    >
                      CHECK ANSWER
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation - only show when not in lesson */}
      {!activeLesson && <BottomNav />}
    </div>
  );
};

export default Academy;
