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
        absolute -top-20 left-1/2 -translate-x-1/2 
        transition-all duration-700 ease-out
        ${isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
        }
      `}
    >
      {/* Main blob container */}
      <div className="relative">
        {/* SVG Blob Shape */}
        <svg
          viewBox="0 0 200 100"
          className="w-[180px] md:w-[220px] h-auto"
          style={{
            filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))',
          }}
        >
          <defs>
            <linearGradient id="blobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.12)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
            </linearGradient>
            <linearGradient id="blobStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
            </linearGradient>
            <filter id="blur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
            </filter>
          </defs>
          
          {/* Organic blob path */}
          <path
            d="M20,50 
               Q10,25 40,15 
               Q70,5 100,10 
               Q140,5 165,20 
               Q190,35 185,55 
               Q190,75 160,85 
               Q130,95 100,90 
               Q60,95 35,85 
               Q10,75 20,50 Z"
            fill="url(#blobGradient)"
            stroke="url(#blobStroke)"
            strokeWidth="1"
            style={{
              backdropFilter: 'blur(12px)',
            }}
          />
          
          {/* Inner highlight */}
          <path
            d="M30,45 
               Q25,30 50,22 
               Q75,15 95,18"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* Text overlay */}
        <div 
          className="absolute inset-0 flex items-center justify-center px-6 py-4"
          style={{ paddingBottom: '12px' }}
        >
          <span className="text-xs md:text-sm text-foreground/90 text-center leading-snug font-medium">
            {currentThought}
          </span>
        </div>

        {/* Floating connector dots */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <div 
            className="w-3 h-3 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />
          <div 
            className="w-2 h-2 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.08) 100%)',
              border: '1px solid rgba(255,255,255,0.25)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ThoughtBubble;
