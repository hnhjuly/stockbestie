import { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Loader2 } from 'lucide-react';
import * as THREE from 'three';
import ThoughtBubble from './ThoughtBubble';

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
    
    // More sensitive rotation - head/eyes looking toward cursor
    const targetRotationY = mousePosition.x * 0.4;
    const targetRotationX = mousePosition.y * 0.2;
    
    modelRef.current.rotation.y = THREE.MathUtils.lerp(
      modelRef.current.rotation.y,
      targetRotationY,
      0.06
    );
    modelRef.current.rotation.x = THREE.MathUtils.lerp(
      modelRef.current.rotation.x,
      targetRotationX,
      0.06
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

interface InteractiveRobotProps {
  isLookingAtForm?: boolean;
}

const InteractiveRobot = ({ isLookingAtForm = false }: InteractiveRobotProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // When looking at form, override mouse position to look left and down (toward form)
  useEffect(() => {
    if (isLookingAtForm) {
      setMousePosition({ x: -0.8, y: 0.3 });
    }
  }, [isLookingAtForm]);
  
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
      className="fixed right-[2%] md:right-[8%] top-1/3 -translate-y-1/2 w-36 h-44 md:w-48 md:h-56 z-20 logo-float"
    >
      {/* Thought Bubble */}
      <ThoughtBubble />
      
      {/* Subtle shadow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)',
          filter: 'blur(4px)',
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
          <RobotModel mousePosition={mousePosition} />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default InteractiveRobot;
