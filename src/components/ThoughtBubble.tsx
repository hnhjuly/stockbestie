import { useState, useEffect, useRef } from 'react';

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
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const showThought = () => {
      const randomThought = thoughts[Math.floor(Math.random() * thoughts.length)];
      setCurrentThought(randomThought);
      setIsVisible(true);
      isVisibleRef.current = true;

      // Hide after 4-6 seconds
      const hideDelay = 4000 + Math.random() * 2000;
      setTimeout(() => {
        setIsVisible(false);
        isVisibleRef.current = false;
      }, hideDelay);
    };

    // Show first thought after 2 seconds
    const initialTimeout = setTimeout(showThought, 2000);

    // Then show thoughts at random intervals (8-14 seconds)
    const interval = setInterval(() => {
      if (!isVisibleRef.current) {
        showThought();
      }
    }, 8000);

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
        {/* SVG Blob Shape with morphing animation */}
        <svg
          viewBox="0 0 200 100"
          className="w-[180px] md:w-[220px] h-auto"
          style={{
            filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))',
          }}
        >
          <defs>
            <linearGradient id="blobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(30,30,40,0.85)" />
              <stop offset="50%" stopColor="rgba(40,40,55,0.75)" />
              <stop offset="100%" stopColor="rgba(35,35,50,0.8)" />
            </linearGradient>
            <linearGradient id="blobStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
            </linearGradient>
          </defs>
          
          {/* Organic blob path with morph animation */}
          <path
            fill="url(#blobGradient)"
            stroke="url(#blobStroke)"
            strokeWidth="1"
          >
            <animate
              attributeName="d"
              dur="4s"
              repeatCount="indefinite"
              values="
                M20,50 Q10,25 40,15 Q70,5 100,10 Q140,5 165,20 Q190,35 185,55 Q190,75 160,85 Q130,95 100,90 Q60,95 35,85 Q10,75 20,50 Z;
                M18,52 Q8,28 42,12 Q72,3 98,12 Q138,3 168,22 Q192,38 183,58 Q188,78 158,87 Q128,97 98,92 Q58,97 33,87 Q8,78 18,52 Z;
                M22,48 Q12,22 38,18 Q68,8 102,8 Q142,8 162,18 Q188,32 187,52 Q192,72 162,83 Q132,93 102,88 Q62,93 37,83 Q12,72 22,48 Z;
                M20,50 Q10,25 40,15 Q70,5 100,10 Q140,5 165,20 Q190,35 185,55 Q190,75 160,85 Q130,95 100,90 Q60,95 35,85 Q10,75 20,50 Z
              "
              calcMode="spline"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
            />
          </path>
          
          {/* Inner highlight with morph */}
          <path
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <animate
              attributeName="d"
              dur="4s"
              repeatCount="indefinite"
              values="
                M30,45 Q25,30 50,22 Q75,15 95,18;
                M28,47 Q23,32 52,20 Q77,13 93,20;
                M32,43 Q27,28 48,24 Q73,17 97,16;
                M30,45 Q25,30 50,22 Q75,15 95,18
              "
              calcMode="spline"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
            />
          </path>
        </svg>

        {/* Text overlay */}
        <div 
          className="absolute inset-0 flex items-center justify-center px-8 md:px-10"
        >
          <span className="text-[10px] md:text-xs text-white/95 text-center leading-relaxed font-light">
            {currentThought}
          </span>
        </div>

        {/* Floating connector dots with pulse */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <div 
            className="w-3 h-3 rounded-full animate-pulse"
            style={{
              background: 'linear-gradient(135deg, rgba(30,30,40,0.85) 0%, rgba(40,40,55,0.75) 100%)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              animationDuration: '2s',
            }}
          />
          <div 
            className="w-2 h-2 rounded-full animate-pulse"
            style={{
              background: 'linear-gradient(135deg, rgba(35,35,50,0.85) 0%, rgba(45,45,60,0.75) 100%)',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              animationDuration: '2s',
              animationDelay: '0.3s',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ThoughtBubble;
