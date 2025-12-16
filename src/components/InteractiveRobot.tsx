import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Loader2 } from 'lucide-react';
import * as THREE from 'three';

const ROBOT_MODEL_URL = 'https://wsfdnwxsdmizxuurorpe.supabase.co/storage/v1/object/public/assets/base_basic_shaded.glb';

// Preload the model
useGLTF.preload(ROBOT_MODEL_URL);

interface RobotModelProps {
  mousePosition: { x: number; y: number };
}

function RobotModel({ mousePosition }: RobotModelProps) {
  const { scene } = useGLTF(ROBOT_MODEL_URL);
  const modelRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (!modelRef.current) return;
    
    // Subtle rotation following mouse (limited range)
    const targetRotationY = mousePosition.x * 0.2;
    const targetRotationX = mousePosition.y * 0.1;
    
    modelRef.current.rotation.y = THREE.MathUtils.lerp(
      modelRef.current.rotation.y,
      targetRotationY,
      0.03
    );
    modelRef.current.rotation.x = THREE.MathUtils.lerp(
      modelRef.current.rotation.x,
      targetRotationX,
      0.03
    );
  });
  
  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={1} 
      position={[0, -1.2, 0]} 
    />
  );
}

const InteractiveRobot = () => {
  const [position, setPosition] = useState({ x: 75, y: 65 });
  const [targetPosition, setTargetPosition] = useState({ x: 75, y: 65 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const lastMouseMove = useRef(Date.now());
  const wanderTarget = useRef({ x: 75, y: 65 });
  
  // Smooth position interpolation
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(prev => ({
        x: prev.x + (targetPosition.x - prev.x) * 0.02,
        y: prev.y + (targetPosition.y - prev.y) * 0.02
      }));
    }, 16);
    return () => clearInterval(interval);
  }, [targetPosition]);
  
  // Autonomous slow wandering
  useEffect(() => {
    const wanderInterval = setInterval(() => {
      if (Date.now() - lastMouseMove.current > 2000 && !isFollowing) {
        // Pick new random target occasionally
        if (Math.random() < 0.02) {
          wanderTarget.current = {
            x: 20 + Math.random() * 60,
            y: 20 + Math.random() * 50
          };
        }
        setTargetPosition(wanderTarget.current);
      }
    }, 100);
    
    return () => clearInterval(wanderInterval);
  }, [isFollowing]);
  
  // Mouse/touch following
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      lastMouseMove.current = Date.now();
      setIsFollowing(true);
      
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Calculate target position
      const targetX = Math.max(10, Math.min(85, (e.clientX / windowWidth) * 100));
      const targetY = Math.max(15, Math.min(75, (e.clientY / windowHeight) * 100));
      
      setTargetPosition({ x: targetX, y: targetY });
      
      // Mouse position for rotation
      const relativeX = (e.clientX / windowWidth - 0.5) * 2;
      const relativeY = (e.clientY / windowHeight - 0.5) * 2;
      setMousePosition({ x: relativeX, y: relativeY });
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        lastMouseMove.current = Date.now();
        setIsFollowing(true);
        
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        const targetX = Math.max(10, Math.min(85, (touch.clientX / windowWidth) * 100));
        const targetY = Math.max(15, Math.min(75, (touch.clientY / windowHeight) * 100));
        
        setTargetPosition({ x: targetX, y: targetY });
        
        const relativeX = (touch.clientX / windowWidth - 0.5) * 2;
        const relativeY = (touch.clientY / windowHeight - 0.5) * 2;
        setMousePosition({ x: relativeX, y: relativeY });
      }
    };
    
    const handleMouseLeave = () => {
      setIsFollowing(false);
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  return (
    <div
      className="fixed w-40 h-48 md:w-52 md:h-60 z-20"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
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
          <RobotModel mousePosition={mousePosition} />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default InteractiveRobot;
