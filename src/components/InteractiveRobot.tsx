import { useState, useEffect, Suspense, useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Loader2 } from 'lucide-react';
import * as THREE from 'three';
import ThoughtBubble from './ThoughtBubble';

const ROBOT_MODEL_URL = 'https://wsfdnwxsdmizxuurorpe.supabase.co/storage/v1/object/public/assets/base_basic_shaded.glb';

useGLTF.preload(ROBOT_MODEL_URL);

interface RobotModelProps {
  mousePosition: { x: number; y: number };
  isDragging: boolean;
  velocity: { x: number; y: number };
  onLoaded: () => void;
}

function RobotModel({ mousePosition, isDragging, velocity, onLoaded }: RobotModelProps) {
  const { scene } = useGLTF(ROBOT_MODEL_URL);
  const modelRef = useRef<THREE.Group>(null);
  const scaleRef = useRef(0);
  const scaleVelocityRef = useRef(0);
  const hasLoadedRef = useRef(false);
  
  // Rotation for dangling effect
  const rotationRef = useRef({ x: 0, y: 0, z: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: 0, z: 0 });
  
  const springStiffness = 180;
  const springDamping = 12;
  const rotationStiffness = 60;
  const rotationDamping = 6;
  
  useFrame((_, delta) => {
    if (!modelRef.current) return;
    
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      onLoaded();
    }
    
    const clampedDelta = Math.min(delta, 0.05);
    
    // Scale spring animation (bounce in)
    if (scaleRef.current < 0.999) {
      const displacement = 1 - scaleRef.current;
      const springForce = displacement * springStiffness;
      const dampingForce = scaleVelocityRef.current * springDamping;
      
      scaleVelocityRef.current += (springForce - dampingForce) * clampedDelta;
      scaleRef.current += scaleVelocityRef.current * clampedDelta;
      scaleRef.current = Math.min(scaleRef.current, 1.15);
      
      modelRef.current.scale.setScalar(Math.max(0, scaleRef.current));
    }
    
    // Dangling rotation based on velocity
    const velocityInfluence = isDragging ? 0.08 : 0.04;
    const targetRotX = isDragging 
      ? -velocity.y * velocityInfluence + 0.15  // Tilt back when lifted
      : mousePosition.y * 0.2;
    const targetRotY = isDragging 
      ? velocity.x * 0.05 
      : mousePosition.x * 0.4;
    const targetRotZ = -velocity.x * velocityInfluence; // Swing sideways
    
    // Spring physics for rotation
    const applySpring = (current: number, target: number, velocityVal: number) => {
      const displacement = target - current;
      const force = displacement * rotationStiffness - velocityVal * rotationDamping;
      return force * clampedDelta;
    };
    
    rotationVelocityRef.current.x += applySpring(rotationRef.current.x, targetRotX, rotationVelocityRef.current.x);
    rotationVelocityRef.current.y += applySpring(rotationRef.current.y, targetRotY, rotationVelocityRef.current.y);
    rotationVelocityRef.current.z += applySpring(rotationRef.current.z, targetRotZ, rotationVelocityRef.current.z);
    
    rotationRef.current.x += rotationVelocityRef.current.x * clampedDelta;
    rotationRef.current.y += rotationVelocityRef.current.y * clampedDelta;
    rotationRef.current.z += rotationVelocityRef.current.z * clampedDelta;
    
    modelRef.current.rotation.x = rotationRef.current.x;
    modelRef.current.rotation.y = rotationRef.current.y;
    modelRef.current.rotation.z = rotationRef.current.z;
    
    // Squash and stretch
    if (scaleRef.current >= 0.999) {
      const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
      const squashAmount = Math.min(speed * 0.0005, 0.08);
      modelRef.current.scale.set(1 - squashAmount * 0.3, 1 + squashAmount * 0.5, 1 - squashAmount * 0.3);
    }
  });
  
  return <primitive ref={modelRef} object={scene} scale={0} position={[0, -1.2, 0]} />;
}

interface InteractiveRobotProps {
  isLookingAtForm?: boolean;
}

const InteractiveRobot = ({ isLookingAtForm = false }: InteractiveRobotProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  
  // CSS-based position for smooth dragging
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [displayPosition, setDisplayPosition] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(Date.now());
  const animationRef = useRef<number>();
  
  // Spring animation for position
  const positionVelocityRef = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const animate = () => {
      const stiffness = isDragging ? 300 : 100;
      const damping = isDragging ? 30 : 12;
      
      const dx = position.x - displayPosition.x;
      const dy = position.y - displayPosition.y;
      
      const fx = dx * stiffness - positionVelocityRef.current.x * damping;
      const fy = dy * stiffness - positionVelocityRef.current.y * damping;
      
      positionVelocityRef.current.x += fx * 0.016;
      positionVelocityRef.current.y += fy * 0.016;
      
      const newX = displayPosition.x + positionVelocityRef.current.x * 0.016;
      const newY = displayPosition.y + positionVelocityRef.current.y * 0.016;
      
      setDisplayPosition({ x: newX, y: newY });
      setVelocity(positionVelocityRef.current);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [position, displayPosition, isDragging]);
  
  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    lastPosRef.current = { x: clientX, y: clientY };
    lastTimeRef.current = Date.now();
    setIsDragging(true);
    setIsInteracting(true);
  }, []);
  
  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return;
    
    const dx = clientX - lastPosRef.current.x;
    const dy = clientY - lastPosRef.current.y;
    
    setPosition(prev => ({
      x: Math.max(-150, Math.min(150, prev.x + dx)),
      y: Math.max(-100, Math.min(100, prev.y + dy)),
    }));
    
    lastPosRef.current = { x: clientX, y: clientY };
  }, [isDragging]);
  
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setPosition({ x: 0, y: 0 }); // Spring back
    setTimeout(() => setIsInteracting(false), 500);
  }, []);
  
  // Mouse events
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) {
        handleDragStart(e.clientX, e.clientY);
      }
    };
    
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleDragMove(e.clientX, e.clientY);
      } else if (!isLookingAtForm) {
        const rx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ry = (e.clientY / window.innerHeight - 0.5) * 2;
        setMousePosition({ x: rx, y: ry });
      }
    };
    
    const onMouseUp = () => isDragging && handleDragEnd();
    
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    
    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, isLookingAtForm, handleDragStart, handleDragMove, handleDragEnd]);
  
  // Touch events
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (containerRef.current?.contains(e.target as Node)) {
        const t = e.touches[0];
        handleDragStart(t.clientX, t.clientY);
      }
    };
    
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    
    const onTouchEnd = () => isDragging && handleDragEnd();
    
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, handleDragStart, handleDragMove, handleDragEnd]);
  
  useEffect(() => {
    if (isLookingAtForm && !isDragging) {
      setMousePosition({ x: -0.8, y: 0.3 });
    }
  }, [isLookingAtForm, isDragging]);
  
  return (
    <div
      ref={containerRef}
      className={`fixed right-[2%] md:right-[8%] top-1/3 -translate-y-1/2 w-36 h-44 md:w-48 md:h-56 z-20 ${!isDragging ? 'logo-float' : ''} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{ 
        touchAction: 'none',
        transform: `translate(${displayPosition.x}px, calc(-50% + ${displayPosition.y}px))`,
      }}
    >
      {isLoaded && <ThoughtBubble isVisible={isInteracting && !isDragging} />}
      
      <div 
        className="absolute bottom-0 left-1/2 w-20 h-4 rounded-full transition-opacity duration-200"
        style={{
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)',
          filter: 'blur(4px)',
          opacity: isLoaded ? (isDragging ? 0.1 : 0.2) : 0,
          transform: `translateX(-50%) scale(${isDragging ? 0.7 : 1})`,
        }}
      />
      
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>}>
        <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
          <ambientLight intensity={0.9} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <RobotModel 
            mousePosition={mousePosition}
            isDragging={isDragging}
            velocity={velocity}
            onLoaded={() => setIsLoaded(true)} 
          />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default InteractiveRobot;
