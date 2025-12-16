import { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Loader2 } from 'lucide-react';
import * as THREE from 'three';
import ThoughtBubble from './ThoughtBubble';
import { useIsMobile } from '@/hooks/use-mobile';

const ROBOT_MODEL_URL = 'https://wsfdnwxsdmizxuurorpe.supabase.co/storage/v1/object/public/assets/base_basic_shaded.glb';

// Preload the model immediately
useGLTF.preload(ROBOT_MODEL_URL);

interface RobotModelProps {
  mousePosition: { x: number; y: number };
  onLoaded: () => void;
  isMobile: boolean;
  isBlinking: boolean;
  isWinking: boolean;
}

function RobotModel({ mousePosition, onLoaded, isMobile, isBlinking, isWinking }: RobotModelProps) {
  const { scene } = useGLTF(ROBOT_MODEL_URL);
  const modelRef = useRef<THREE.Group>(null);
  const scaleRef = useRef(0);
  const velocityRef = useRef(0);
  const hasLoadedRef = useRef(false);
  const floatTimeRef = useRef(0);
  const eyeMeshesRef = useRef<THREE.Mesh[]>([]);
  
  // Find eye meshes on load
  useEffect(() => {
    const eyes: THREE.Mesh[] = [];
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const name = child.name.toLowerCase();
        if (name.includes('eye') || name.includes('screen') || name.includes('display')) {
          eyes.push(child);
        }
      }
    });
    eyeMeshesRef.current = eyes;
  }, [scene]);
  
  // Spring physics for bounce effect
  const springStiffness = 180;
  const springDamping = 12;
  const targetScale = 1;
  
  useFrame((_, delta) => {
    if (!modelRef.current) return;
    
    // Notify parent that model is loaded (once)
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      onLoaded();
    }
    
    // Spring animation for scale (bounce in)
    if (scaleRef.current < 0.999) {
      const displacement = targetScale - scaleRef.current;
      const springForce = displacement * springStiffness;
      const dampingForce = velocityRef.current * springDamping;
      const acceleration = springForce - dampingForce;
      
      velocityRef.current += acceleration * delta;
      scaleRef.current += velocityRef.current * delta;
      
      // Clamp to prevent overshoot issues
      scaleRef.current = Math.min(scaleRef.current, 1.15);
      
      modelRef.current.scale.setScalar(Math.max(0, scaleRef.current));
    }
    
    // Mobile-only floating animation
    if (isMobile && scaleRef.current >= 0.999) {
      floatTimeRef.current += delta;
      const floatY = Math.sin(floatTimeRef.current * 1.5) * 0.08;
      modelRef.current.position.y = -1.2 + floatY;
    }
    
    // Eye blinking/winking effect - scale eyes
    eyeMeshesRef.current.forEach((eye, index) => {
      if (isBlinking) {
        eye.scale.y = THREE.MathUtils.lerp(eye.scale.y, 0.1, 0.3);
      } else if (isWinking && index === 0) {
        eye.scale.y = THREE.MathUtils.lerp(eye.scale.y, 0.1, 0.3);
      } else {
        eye.scale.y = THREE.MathUtils.lerp(eye.scale.y, 1, 0.2);
      }
    });
    
    // More sensitive rotation - head/eyes looking toward cursor (higher sensitivity on mobile)
    const sensitivity = isMobile ? 0.6 : 0.4;
    const targetRotationY = mousePosition.x * sensitivity;
    const targetRotationX = mousePosition.y * (sensitivity * 0.5);
    
    modelRef.current.rotation.y = THREE.MathUtils.lerp(
      modelRef.current.rotation.y,
      targetRotationY,
      isMobile ? 0.1 : 0.06
    );
    modelRef.current.rotation.x = THREE.MathUtils.lerp(
      modelRef.current.rotation.x,
      targetRotationX,
      isMobile ? 0.1 : 0.06
    );
  });
  
  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={0} 
      position={[0, -1.2, 0]} 
    />
  );
}

interface InteractiveRobotProps {
  isLookingAtForm?: boolean;
}

const InteractiveRobot = ({ isLookingAtForm = false }: InteractiveRobotProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [driftOffset, setDriftOffset] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isWinking, setIsWinking] = useState(false);
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Dismiss thought bubble when clicking outside the mascot
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsInteracting(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);
  
  // When looking at form, override mouse position to look left and down (toward form)
  useEffect(() => {
    if (isLookingAtForm) {
      setMousePosition({ x: -0.8, y: 0.3 });
    }
  }, [isLookingAtForm]);
  
  // Mobile-only: Auto-blinking every 3-4 seconds
  useEffect(() => {
    if (!isMobile) return;
    
    const blink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    };
    
    const interval = setInterval(() => {
      blink();
    }, 3000 + Math.random() * 1000);
    
    return () => clearInterval(interval);
  }, [isMobile]);
  
  // Mobile-only: Random sideways drift every 5-8 seconds
  useEffect(() => {
    if (!isMobile) return;
    
    const drift = () => {
      const newOffset = (Math.random() - 0.5) * 30; // -15 to 15 pixels
      setDriftOffset(newOffset);
    };
    
    const interval = setInterval(() => {
      drift();
    }, 5000 + Math.random() * 3000);
    
    return () => clearInterval(interval);
  }, [isMobile]);
  
  // Handle winking on interaction (mobile only)
  const handleInteraction = () => {
    if (isMobile) {
      setIsWinking(true);
      setTimeout(() => setIsWinking(false), 200);
    }
    setIsInteracting(prev => !prev);
  };
  
  // Mouse/touch tracking for look direction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isLookingAtForm) return; // Don't track mouse when looking at form
      
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      const relativeX = (e.clientX / windowWidth - 0.5) * 2;
      const relativeY = (e.clientY / windowHeight - 0.5) * 2;
      setMousePosition({ x: relativeX, y: relativeY });
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (isLookingAtForm) return;
      
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        const relativeX = (touch.clientX / windowWidth - 0.5) * 2;
        const relativeY = (touch.clientY / windowHeight - 0.5) * 2;
        setMousePosition({ x: relativeX, y: relativeY });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isLookingAtForm]);
  
  return (
    <div
      ref={containerRef}
      className="fixed right-[2%] md:right-[5%] lg:right-[22%] top-[58%] md:top-[52%] lg:top-1/3 -translate-y-1/2 w-36 h-44 md:w-48 md:h-56 z-20 lg:logo-float cursor-pointer transition-transform duration-1000 ease-in-out"
      style={{
        transform: isMobile ? `translateY(-50%) translateX(${driftOffset}px)` : undefined,
      }}
      onMouseEnter={() => !isMobile && setIsInteracting(true)}
      onMouseLeave={() => !isMobile && setIsInteracting(false)}
      onClick={handleInteraction}
    >
      {/* Thought Bubble - only show on interaction */}
      {isLoaded && <ThoughtBubble isVisible={isInteracting} />}
      
      {/* Subtle shadow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full opacity-20 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)',
          filter: 'blur(4px)',
          opacity: isLoaded ? 0.2 : 0,
        }}
      />
      
      <Suspense 
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        }
      >
        <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
          <ambientLight intensity={0.9} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <RobotModel 
            mousePosition={mousePosition} 
            onLoaded={() => setIsLoaded(true)} 
            isMobile={isMobile}
            isBlinking={isBlinking}
            isWinking={isWinking}
          />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default InteractiveRobot;
