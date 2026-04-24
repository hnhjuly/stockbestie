import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { ACADEMY_CONTENT } from '@/data/academyContent';
import { BottomNav } from '@/components/BottomNav';

// Render body text: split on \n\n -> paragraphs; **bold** -> <strong>; lines starting with "• " become bullets.
const renderBody = (body: string) => {
  const blocks = body.split(/\n\n+/);
  return blocks.map((block, bi) => {
    const lines = block.split('\n');
    const isBulletBlock = lines.every(l => l.trim().startsWith('• '));
    if (isBulletBlock) {
      return (
        <ul key={bi} className="list-disc pl-5 space-y-2 my-3">
          {lines.map((l, i) => (
            <li key={i} className="text-base text-foreground/80 leading-relaxed">
              {renderInline(l.trim().replace(/^•\s*/, ''))}
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p key={bi} className="text-base md:text-lg text-foreground/80 leading-relaxed mb-4">
        {renderInline(block)}
      </p>
    );
  });
};

const renderInline = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return <strong key={i} className="font-bold text-foreground">{p.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
};

const AcademyLesson: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lessonId = Number(id);
  const lesson = ACADEMY_CONTENT.find(l => l.id === lessonId);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <p className="text-2xl font-black text-foreground mb-2">Lesson not found</p>
        <p className="text-muted-foreground mb-6">We couldn't find that lesson.</p>
        <Link to="/academy" className="px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-black text-xs tracking-[0.3em] uppercase">
          Back to Academy
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-3 md:py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/academy')}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors"
            aria-label="Back to Academy"
          >
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
            Lesson {lesson.id} • Reading
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8 md:space-y-10">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="text-6xl md:text-7xl">{lesson.icon}</div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
            {lesson.title}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {lesson.subtitle}
          </p>
        </motion.section>

        {/* What you'll learn */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary/5 border border-primary/20 rounded-3xl p-6 md:p-8"
        >
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">
            What you'll learn
          </h2>
          <ul className="space-y-3">
            {lesson.whatYoullLearn.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3" />
                </span>
                <span className="text-base text-foreground/90 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Introduction */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-2"
        >
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-3">
            Introduction
          </h2>
          {lesson.introduction.split(/\n\n+/).map((p, i) => (
            <p key={i} className="text-base md:text-lg text-foreground/80 leading-relaxed mb-4">
              {renderInline(p)}
            </p>
          ))}
        </motion.section>

        {/* Concepts */}
        <div className="space-y-6">
          {lesson.concepts.map((concept, idx) => (
            <motion.section
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl md:text-5xl flex-shrink-0">{concept.icon}</div>
                <h3 className="text-xl md:text-2xl font-black text-foreground tracking-tight leading-tight pt-1">
                  {concept.title}
                </h3>
              </div>
              <div>{renderBody(concept.body)}</div>
              {concept.bestieNote && (
                <div className="mt-5 bg-primary/10 border border-primary/20 rounded-2xl p-4 md:p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">
                    💙 Bestie says
                  </p>
                  <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
                    {concept.bestieNote}
                  </p>
                </div>
              )}
            </motion.section>
          ))}
        </div>

        {/* Glossary */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm"
        >
          <h2 className="text-lg md:text-xl font-black text-foreground mb-5 flex items-center gap-2">
            📚 Key Terms
          </h2>
          <div className="divide-y divide-border">
            {lesson.glossary.map((g, i) => (
              <div key={i} className="py-4 first:pt-0 last:pb-0">
                <p className="font-black text-foreground mb-1">{g.term}</p>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {g.definition}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Common Mistakes */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm"
        >
          <h2 className="text-lg md:text-xl font-black text-foreground mb-5 flex items-center gap-2">
            ⚠️ Common Mistakes
          </h2>
          <div className="space-y-5">
            {lesson.commonMistakes.map((m, i) => (
              <div key={i}>
                <p className="font-black text-foreground mb-1">{m.mistake}</p>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {m.why}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Ready to quiz CTA */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-5 pt-4"
        >
          <p className="text-base md:text-lg text-foreground/80 max-w-xl mx-auto leading-relaxed">
            {lesson.readyToQuizMessage}
          </p>
          <button
            onClick={() => navigate(`/academy?startQuiz=${lesson.id}`)}
            className="w-full md:w-auto md:px-14 px-8 py-5 md:py-6 bg-primary text-primary-foreground rounded-2xl font-black text-xs tracking-[0.4em] uppercase shadow-2xl hover:opacity-90 transition-opacity"
          >
            Start Quiz
          </button>
        </motion.section>
      </main>

      <BottomNav />
    </div>
  );
};

export default AcademyLesson;
