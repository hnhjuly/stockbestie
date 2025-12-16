import { useState, useEffect } from 'react';

const thoughts = [
  "Hmm, have you checked NVDA today?",
  "The market's looking interesting...",
  "ETFs are great for beginners!",
  "Diversification is key 💎",
  "Time in the market beats timing",
  "Warren Buffett would approve",
  "Bull or bear? I'm your bestie either way",
  "Let's analyze some charts!",
  "Your portfolio called... it misses you",
  "Compound interest is magic ✨",
  "Buy low, sell high... simple right?",
  "Wanna learn about ETFs?",
  "Dollar-cost averaging FTW",
  "The trend is your friend",
  "Risk management matters!",
  "P/E ratios tell stories",
  "Dividends are passive income 🎯",
  "Market cap isn't everything",
  "Research before you invest",
  "Patience is a virtue",
  "Green days feel amazing",
  "Red days build character",
  "You wanna be rich huh?",
  "Index funds are underrated",
  "Have you signed up already?",
  "Volume speaks volumes",
  "Support and resistance, baby",
  "Your future self will thank you",
  "Financial freedom awaits",
  "Let's make smart moves together!"
];

const ThoughtBubble = () => {
  const [currentThought, setCurrentThought] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showThought = () => {
      const randomThought = thoughts[Math.floor(Math.random() * thoughts.length)];
      setCurrentThought(randomThought);
      setIsVisible(true);

      // Hide after 4-6 seconds
      const hideDelay = 4000 + Math.random() * 2000;
      setTimeout(() => {
        setIsVisible(false);
      }, hideDelay);
    };

    // Show first thought after 2 seconds
    const initialTimeout = setTimeout(showThought, 2000);

    // Then show thoughts at random intervals (6-12 seconds)
    const interval = setInterval(() => {
      if (!isVisible) {
        showThought();
      }
    }, 6000 + Math.random() * 6000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className={`
        absolute -top-16 left-1/2 -translate-x-1/2 
        max-w-[180px] md:max-w-[220px]
        px-4 py-3
        rounded-2xl
        text-xs md:text-sm text-foreground/90
        text-center
        transition-all duration-500 ease-out
        ${isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-2 pointer-events-none'
        }
      `}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: `
          0 8px 32px rgba(0,0,0,0.1),
          inset 0 1px 0 rgba(255,255,255,0.2),
          inset 0 -1px 0 rgba(255,255,255,0.05)
        `,
      }}
    >
      {currentThought}
      
      {/* Bubble tail */}
      <div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderTop: 'none',
          borderLeft: 'none',
        }}
      />
    </div>
  );
};

export default ThoughtBubble;
