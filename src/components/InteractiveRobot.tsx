import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Loader2 } from 'lucide-react';
import * as THREE from 'three';

const ROBOT_MODEL_URL = 'https://wsfdnwxsdmizxuurorpe.supabase.co/storage/v1/object/public/assets/base_basic_shaded.glb';

// Preload the model
useGLTF.preload(ROBOT_MODEL_URL);

interface RobotModelProps {
  mousePosition: { x: number; y: number };
  isHovered: boolean;
}

function RobotModel({ mousePosition, isHovered }: RobotModelProps) {
  const { scene } = useGLTF(ROBOT_MODEL_URL);
  const modelRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!modelRef.current) return;
    
    // Subtle rotation following mouse (limited range)
    const targetRotationY = mousePosition.x * 0.3;
    const targetRotationX = mousePosition.y * 0.15;
    
    modelRef.current.rotation.y = THREE.MathUtils.lerp(
      modelRef.current.rotation.y,
      targetRotationY,
      0.05
    );
    modelRef.current.rotation.x = THREE.MathUtils.lerp(
      modelRef.current.rotation.x,
      targetRotationX,
      0.05
    );
    
    // Hover effect - slight bounce/wave
    if (isHovered) {
      modelRef.current.position.y = -0.8 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
      modelRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    } else {
      modelRef.current.position.y = THREE.MathUtils.lerp(modelRef.current.position.y, -0.8, 0.1);
      modelRef.current.rotation.z = THREE.MathUtils.lerp(modelRef.current.rotation.z, 0, 0.1);
    }
  });
  
  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={1.4} 
      position={[0, -0.8, 0]} 
    />
  );
}

const InteractiveRobot = () => {
  const [position, setPosition] = useState({ x: 70, y: 70 }); // percentage
  const [velocity, setVelocity] = useState({ x: 0.02, y: 0.015 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMouseMove = useRef(Date.now());
  
  // Autonomous wandering movement
  useEffect(() => {
    const interval = setInterval(() => {
      // If mouse hasn't moved for 3 seconds, wander autonomously
      if (Date.now() - lastMouseMove.current > 3000 && !isFollowing) {
        setPosition(prev => {
          let newX = prev.x + velocity.x;
          let newY = prev.y + velocity.y;
          let newVelX = velocity.x;
          let newVelY = velocity.y;
          
          // Bounce off edges with some randomness
          if (newX <= 5 || newX >= 85) {
            newVelX = -velocity.x + (Math.random() - 0.5) * 0.01;
            newX = Math.max(5, Math.min(85, newX));
          }
          if (newY <= 10 || newY >= 80) {
            newVelY = -velocity.y + (Math.random() - 0.5) * 0.01;
            newY = Math.max(10, Math.min(80, newY));
          }
          
          setVelocity({ x: newVelX, y: newVelY });
          return { x: newX, y: newY };
        });
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [velocity, isFollowing]);
  
  // Mouse/touch following
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      lastMouseMove.current = Date.now();
      setIsFollowing(true);
      
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Calculate target position (percentage)
      const targetX = (e.clientX / windowWidth) * 100;
      const targetY = (e.clientY / windowHeight) * 100;
      
      // Clamp to safe area
      const clampedX = Math.max(5, Math.min(85, targetX));
      const clampedY = Math.max(10, Math.min(80, targetY));
      
      // Smooth follow with offset (robot stays nearby, not directly on cursor)
      setPosition(prev => ({
        x: prev.x + (clampedX - prev.x) * 0.03,
        y: prev.y + (clampedY - prev.y) * 0.03
      }));
      
      // Calculate mouse position relative to center for rotation
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
        
        const targetX = (touch.clientX / windowWidth) * 100;
        const targetY = (touch.clientY / windowHeight) * 100;
        
        const clampedX = Math.max(5, Math.min(85, targetX));
        const clampedY = Math.max(10, Math.min(80, targetY));
        
        setPosition(prev => ({
          x: prev.x + (clampedX - prev.x) * 0.05,
          y: prev.y + (clampedY - prev.y) * 0.05
        }));
        
        const relativeX = (touch.clientX / windowWidth - 0.5) * 2;
        const relativeY = (touch.clientY / windowHeight - 0.5) * 2;
        setMousePosition({ x: relativeX, y: relativeY });
      }
    };
    
    const handleMouseLeave = () => {
      setIsFollowing(false);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  return (
    <div
      ref={containerRef}
      className="fixed w-36 h-36 md:w-48 md:h-48 z-20 transition-all duration-100 ease-out cursor-pointer"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <Suspense 
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        }
      >
        <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <RobotModel mousePosition={mousePosition} isHovered={isHovered} />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            enableRotate={false}
          />
        </Canvas>
      </Suspense>
      
      {/* Subtle glow effect on hover */}
      <div 
        className={`absolute inset-0 rounded-full transition-opacity duration-300 pointer-events-none ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
    </div>
  );
};

export default InteractiveRobot;
