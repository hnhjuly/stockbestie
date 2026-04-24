export interface LessonConcept {
  icon: string;           // emoji
  title: string;          // e.g., "What a stock actually is"
  body: string;           // 1-3 paragraphs of plain prose
  bestieNote?: string;    // optional encouraging callout
}

export interface GlossaryTerm {
  term: string;
  definition: string;     // 1-2 sentences, beginner-friendly
}

export interface CommonMistake {
  mistake: string;        // short, punchy
  why: string;            // why it hurts, what to do instead
}

export interface LessonContent {
  id: number;                        // matches Lesson id in academyQuestions
  title: string;                     // matches Lesson title
  icon: string;                      // matches Lesson icon
  subtitle: string;                  // one-line hook for the reading page
  whatYoullLearn: string[];          // 3-5 bullet takeaways
  introduction: string;              // 2-3 short paragraphs, warm tone
  concepts: LessonConcept[];         // 3-5 concept sections
  glossary: GlossaryTerm[];          // 4-8 terms
  commonMistakes: CommonMistake[];   // 2-3 pitfalls to avoid
  readyToQuizMessage: string;        // friendly kicker before the Start Quiz button
}
