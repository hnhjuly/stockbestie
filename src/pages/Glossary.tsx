import { useState } from 'react';
import { glossaryTerms } from '@/data/glossaryTerms';
import { BottomNav } from '@/components/BottomNav';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Icon } from '@iconify/react';
import stockBestieLogo from '@/assets/stock-bestie-logo.png';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const Glossary = () => {
  const [search, setSearch] = useState('');

  const filtered = glossaryTerms.filter(
    (t) =>
      t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.definition.toLowerCase().includes(search.toLowerCase())
  );

  // Group by first letter
  const grouped = filtered.reduce<Record<string, typeof glossaryTerms>>((acc, term) => {
    const letter = term.term[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(term);
    return acc;
  }, {});

  const sortedLetters = Object.keys(grouped).sort();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-1 md:p-2 flex-shrink-0">
              <img src={stockBestieLogo} alt="Stock Bestie Logo" className="h-10 w-10 md:h-12 md:w-12 object-contain" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold">Glossary</h1>
              <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-1">
                Stock market terms made simple <Icon icon="fxemoji:chartupwardstrend" className="inline-block w-4 h-4" />
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-8 max-w-2xl">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search terms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {sortedLetters.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No terms found.</p>
        ) : (
          <div className="space-y-6">
            {sortedLetters.map((letter) => (
              <div key={letter}>
                <h2 className="text-xl font-bold text-primary mb-2">{letter}</h2>
                <Accordion type="multiple" className="space-y-1">
                  {grouped[letter].map((term) => (
                    <AccordionItem key={term.term} value={term.term} className="border rounded-lg px-1 bg-card">
                      <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                        <span className="flex items-center gap-2">
                          {term.fxIcon && <Icon icon={term.fxIcon} className="w-5 h-5 flex-shrink-0" />}
                          {term.term}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        {term.definition}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground mt-10 flex items-center justify-center gap-1">
          <Icon icon="fxemoji:electriclightbulb" className="w-4 h-4" />
          The best investors keep learning every day. Keep it up — your future self will thank you!
          <Icon icon="fxemoji:rocket" className="w-4 h-4" />
        </p>
      </main>

      <BottomNav />
    </div>
  );
};

export default Glossary;
