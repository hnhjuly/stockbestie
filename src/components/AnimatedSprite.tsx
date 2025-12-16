import { useState, useEffect } from 'react';
import spriteSheet from '@/assets/mascot-spritesheet.png';

interface AnimatedSpriteProps {
  className?: string;
}

const AnimatedSprite = ({ className = '' }: AnimatedSpriteProps) => {
  const [frame, setFrame] = useState(0);
  
  // Sprite sheet is 6 columns x 7 rows = 42 frames total, each frame is ~170px
  const cols = 6;
  const rows = 7;
  const totalFrames = 36; // Based on filename
  const frameWidth = 170;
  const frameHeight = 170;
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % totalFrames);
    }, 80); // ~12fps animation
    
    return () => clearInterval(interval);
  }, []);
  
  const col = frame % cols;
  const row = Math.floor(frame / cols);
  
  return (
    <div 
      className={`overflow-hidden ${className}`}
      style={{
        width: frameWidth,
        height: frameHeight,
      }}
    >
      <div
        style={{
          width: frameWidth * cols,
          height: frameHeight * rows,
          backgroundImage: `url(${spriteSheet})`,
          backgroundSize: '100% 100%',
          transform: `translate(-${col * frameWidth}px, -${row * frameHeight}px)`,
        }}
      />
    </div>
  );
};

export default AnimatedSprite;
