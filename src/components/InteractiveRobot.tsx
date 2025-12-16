import { useState, useEffect, Suspense, useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Loader2 } from 'lucide-react';
import * as THREE from 'three';
import ThoughtBubble from './ThoughtBubble';

const ROBOT_MODEL_URL = 'https://wsfdnwxsdmizxuurorpe.supabase.co/storage/v1/object/public/assets/base_basic_shaded.glb';

// Preload the model immediately
useGLTF.preload(ROBOT_MODEL_URL);

interface RobotModelProps {
  mousePosition: { x: number; y: number };
  dragOffset: { x: number; y: number };
  isDragging: boolean;
  velocity: { x: number; y: number };
  onLoaded: () => void;
}

function RobotModel({ mousePosition, dragOffset, isDragging, velocity, onLoaded }: RobotModelProps) {
  const { scene } = useGLTF(ROBOT_MODEL_URL);
  const modelRef = useRef<THREE.Group>(null);
  const scaleRef = useRef(0);
  const scaleVelocityRef = useRef(0);
  const hasLoadedRef = useRef(false);
  
  // Position with spring physics
  const positionRef = useRef({ x: 0, y: -1.2 });
  const positionVelocityRef = useRef({ x: 0, y: 0 });
  
  // Rotation for dangling effect
  const rotationRef = useRef({ x: 0, y: 0, z: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: 0, z: 0 });
  
  // Spring physics constants
  const springStiffness = 180;
  const springDamping = 12;
  const targetScale = 1;
  
  // Position spring constants (softer for more fluid movement)
  const positionStiffness = isDragging ? 400 : 120;
  const positionDamping = isDragging ? 25 : 14;
  
  // Rotation spring constants for dangle effect
  const rotationStiffness = 80;
  const rotationDamping = 8;
  
  useFrame((_, delta) => {
    if (!modelRef.current) return;
    
    // Notify parent that model is loaded (once)
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      onLoaded();
    }
    
    // Clamp delta to prevent physics explosions
    const clampedDelta = Math.min(delta, 0.05);
    
    // Spring animation for scale (bounce in)
    if (scaleRef.current < 0.999) {
      const displacement = targetScale - scaleRef.current;
      const springForce = displacement * springStiffness;
      const dampingForce = scaleVelocityRef.current * springDamping;
      const acceleration = springForce - dampingForce;
      
      scaleVelocityRef.current += acceleration * clampedDelta;
      scaleRef.current += scaleVelocityRef.current * clampedDelta;
      scaleRef.current = Math.min(scaleRef.current, 1.15);
      
      modelRef.current.scale.setScalar(Math.max(0, scaleRef.current));
    }
    
    // Target position based on drag
    const targetX = dragOffset.x * 3; // Scale to 3D space
    const targetY = -1.2 + dragOffset.y * -2; // Invert Y and add base offset
    
    // Spring physics for position
    const posDisplacementX = targetX - positionRef.current.x;
    const posDisplacementY = targetY - positionRef.current.y;
    
    const posSpringForceX = posDisplacementX * positionStiffness;
    const posSpringForceY = posDisplacementY * positionStiffness;
    
    const posDampingForceX = positionVelocityRef.current.x * positionDamping;
    const posDampingForceY = positionVelocityRef.current.y * positionDamping;
    
    positionVelocityRef.current.x += (posSpringForceX - posDampingForceX) * clampedDelta;
    positionVelocityRef.current.y += (posSpringForceY - posDampingForceY) * clampedDelta;
    
    positionRef.current.x += positionVelocityRef.current.x * clampedDelta;
    positionRef.current.y += positionVelocityRef.current.y * clampedDelta;
    
    modelRef.current.position.x = positionRef.current.x;
    modelRef.current.position.y = positionRef.current.y;
    
    // Dangling rotation based on velocity and drag
    // Tilt in the direction of movement (like being pulled)
    const velocityInfluence = isDragging ? 0.15 : 0.08;
    const targetRotX = -velocity.y * velocityInfluence + (isDragging ? 0.1 : 0); // Tilt back when lifted
    const targetRotZ = -velocity.x * velocityInfluence; // Tilt sideways based on horizontal movement
    
    // Also look toward mouse when not dragging
    const lookTargetY = isDragging ? velocity.x * 0.1 : mousePosition.x * 0.4;
    const lookTargetX = isDragging ? targetRotX : mousePosition.y * 0.2;
    
    // Spring physics for rotation
    const rotDisplacementX = lookTargetX - rotationRef.current.x;
    const rotDisplacementY = lookTargetY - rotationRef.current.y;
    const rotDisplacementZ = targetRotZ - rotationRef.current.z;
    
    rotationVelocityRef.current.x += (rotDisplacementX * rotationStiffness - rotationVelocityRef.current.x * rotationDamping) * clampedDelta;
    rotationVelocityRef.current.y += (rotDisplacementY * rotationStiffness - rotationVelocityRef.current.y * rotationDamping) * clampedDelta;
    rotationVelocityRef.current.z += (rotDisplacementZ * rotationStiffness - rotationVelocityRef.current.z * rotationDamping) * clampedDelta;
    
    rotationRef.current.x += rotationVelocityRef.current.x * clampedDelta;
    rotationRef.current.y += rotationVelocityRef.current.y * clampedDelta;
    rotationRef.current.z += rotationVelocityRef.current.z * clampedDelta;
    
    modelRef.current.rotation.x = rotationRef.current.x;
    modelRef.current.rotation.y = rotationRef.current.y;
    modelRef.current.rotation.z = rotationRef.current.z;
    
    // Squash and stretch based on velocity (subtle)
    if (scaleRef.current >= 0.999) {
      const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
      const squashAmount = Math.min(speed * 0.001, 0.1);
      const stretchY = 1 + squashAmount * 0.5;
      const squashXZ = 1 - squashAmount * 0.25;
      
      modelRef.current.scale.set(squashXZ, stretchY, squashXZ);
    }
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
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const lastPosRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(Date.now());
  const velocityHistoryRef = useRef<{ x: number; y: number }[]>([]);
  
  // Get normalized position relative to container center
  const getNormalizedPosition = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Normalize to -1 to 1 range, scaled by container size
    const normalizedX = (clientX - centerX) / (rect.width / 2);
    const normalizedY = (clientY - centerY) / (rect.height / 2);
    
    return { x: normalizedX, y: normalizedY };
  }, []);
  
  // Calculate velocity from position history
  const calculateVelocity = useCallback((currentPos: { x: number; y: number }) => {
    const now = Date.now();
    const dt = (now - lastTimeRef.current) / 1000;
    
    if (dt > 0) {
      const vx = (currentPos.x - lastPosRef.current.x) / dt;
      const vy = (currentPos.y - lastPosRef.current.y) / dt;
      
      // Smooth velocity with history
      velocityHistoryRef.current.push({ x: vx, y: vy });
      if (velocityHistoryRef.current.length > 5) {
        velocityHistoryRef.current.shift();
      }
      
      // Average velocity
      const avgVelocity = velocityHistoryRef.current.reduce(
        (acc, v) => ({ x: acc.x + v.x, y: acc.y + v.y }),
        { x: 0, y: 0 }
      );
      avgVelocity.x /= velocityHistoryRef.current.length;
      avgVelocity.y /= velocityHistoryRef.current.length;
      
      setVelocity(avgVelocity);
    }
    
    lastPosRef.current = currentPos;
    lastTimeRef.current = now;
  }, []);
  
  // Drag handlers
  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    const pos = getNormalizedPosition(clientX, clientY);
    dragStartRef.current = pos;
    lastPosRef.current = pos;
    lastTimeRef.current = Date.now();
    velocityHistoryRef.current = [];
    setIsDragging(true);
    setIsInteracting(true);
  }, [getNormalizedPosition]);
  
  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return;
    
    const pos = getNormalizedPosition(clientX, clientY);
    const offset = {
      x: pos.x - dragStartRef.current.x + dragOffset.x,
      y: pos.y - dragStartRef.current.y + dragOffset.y,
    };
    
    // Clamp to reasonable bounds
    offset.x = Math.max(-2, Math.min(2, offset.x));
    offset.y = Math.max(-1, Math.min(1.5, offset.y));
    
    setDragOffset(offset);
    calculateVelocity(pos);
    dragStartRef.current = pos;
  }, [isDragging, dragOffset, getNormalizedPosition, calculateVelocity]);
  
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    // Spring back to center with momentum
    setDragOffset({ x: 0, y: 0 });
    // Keep velocity for momentum effect, it will decay via spring physics
    setTimeout(() => setIsInteracting(false), 300);
  }, []);
  
  // Mouse events
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) return;
      handleDragStart(e.clientX, e.clientY);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleDragMove(e.clientX, e.clientY);
      } else if (!isLookingAtForm) {
        // Regular look-at behavior
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const relativeX = (e.clientX / windowWidth - 0.5) * 2;
        const relativeY = (e.clientY / windowHeight - 0.5) * 2;
        setMousePosition({ x: relativeX, y: relativeY });
      }
    };
    
    const handleMouseUp = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };
    
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isLookingAtForm, handleDragStart, handleDragMove, handleDragEnd]);
  
  // Touch events
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) return;
      const touch = e.touches[0];
      handleDragStart(touch.clientX, touch.clientY);
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      handleDragMove(touch.clientX, touch.clientY);
    };
    
    const handleTouchEnd = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };
    
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleDragStart, handleDragMove, handleDragEnd]);
  
  // Decay velocity when not dragging
  useEffect(() => {
    if (!isDragging && (velocity.x !== 0 || velocity.y !== 0)) {
      const decay = setInterval(() => {
        setVelocity(v => {
          const newVx = v.x * 0.9;
          const newVy = v.y * 0.9;
          if (Math.abs(newVx) < 0.01 && Math.abs(newVy) < 0.01) {
            return { x: 0, y: 0 };
          }
          return { x: newVx, y: newVy };
        });
      }, 16);
      return () => clearInterval(decay);
    }
  }, [isDragging, velocity]);
  
  // When looking at form, override mouse position
  useEffect(() => {
    if (isLookingAtForm && !isDragging) {
      setMousePosition({ x: -0.8, y: 0.3 });
    }
  }, [isLookingAtForm, isDragging]);
  
  return (
    <div
      ref={containerRef}
      className={`fixed right-[2%] md:right-[8%] top-1/3 -translate-y-1/2 w-36 h-44 md:w-48 md:h-56 z-20 ${!isDragging ? 'logo-float' : ''} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{ touchAction: 'none' }}
    >
      {/* Thought Bubble - only show on interaction */}
      {isLoaded && <ThoughtBubble isVisible={isInteracting && !isDragging} />}
      
      {/* Subtle shadow - moves with drag */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full transition-all duration-200"
        style={{
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)',
          filter: 'blur(4px)',
          opacity: isLoaded ? (isDragging ? 0.1 : 0.2) : 0,
          transform: `translateX(calc(-50% + ${dragOffset.x * 20}px)) scale(${isDragging ? 0.8 : 1})`,
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
            dragOffset={dragOffset}
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
