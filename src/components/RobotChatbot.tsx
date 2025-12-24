import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import robotModel from '@/assets/Mascot_FINAL.glb';
import { getDeviceId } from '@/lib/deviceId';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function RobotModel() {
  const { scene } = useGLTF(robotModel);
  const meshRef = useRef<any>();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Convert mouse position to normalized coordinates (-1 to 1)
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        // Convert touch position to normalized coordinates (-1 to 1)
        const x = (touch.clientX / window.innerWidth) * 2 - 1;
        const y = -(touch.clientY / window.innerHeight) * 2 + 1;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
      
      // Eye tracking - rotate head to follow cursor
      const targetRotationY = mousePosition.x * 0.3;
      const targetRotationX = mousePosition.y * 0.2;
      
      meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.1;
      meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.1;
    }
  });

  return (
    <primitive 
      ref={meshRef} 
      object={scene} 
      scale={2.2}
      position={[0, -1.2, 0]}
    />
  );
}

function GlowingShadow() {
  const meshRef = useRef<any>();

  useFrame((state) => {
    if (meshRef.current) {
      // Pulsing glow effect
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.35;
      meshRef.current.material.opacity = pulse;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} scale={[1.0, 0.6, 1]}>
      <circleGeometry args={[1.0, 32]} />
      <meshBasicMaterial 
        color="#3b82f6" 
        transparent 
        opacity={0.35}
        depthWrite={false}
      />
    </mesh>
  );
}

export const RobotChatbot = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.log('WebGL context lost, attempting to restore...');
      // Force remount the Canvas by changing the key
      setTimeout(() => setCanvasKey(prev => prev + 1), 100);
    };

    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLost);
      return () => canvas.removeEventListener('webglcontextlost', handleContextLost);
    }
  }, [canvasKey]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Add empty assistant message for streaming
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const deviceId = getDeviceId();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-with-robot`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ 
            messages: [...messages, userMessage],
            deviceId 
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          // Check if it's the daily limit
          const errorData = await response.json();
          if (errorData.limitReached) {
            // Add the limit message as an assistant message
            setMessages(prev => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              if (lastMessage.role === 'assistant') {
                lastMessage.content = errorData.message;
              }
              return newMessages;
            });
            toast.error('Daily chat limit reached (5/day)');
          } else {
            toast.error('Too many requests. Please wait a moment and try again.');
            setMessages(prev => prev.filter(m => m.content !== ''));
          }
          setIsLoading(false);
          return;
        }
        throw new Error('Failed to start stream');
      }
      
      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              // Handle OpenAI's response format
              const content = parsed.choices?.[0]?.delta?.content;
              
              if (content) {
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage.role === 'assistant') {
                    lastMessage.content += content;
                  }
                  return newMessages;
                });
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      toast.error('Failed to get response. Please try again.');
      // Remove empty assistant message on error
      setMessages(prev => prev.filter(m => m.content !== ''));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-12 md:right-8 z-50">
      {/* 3D Robot */}
      <div
        className="relative w-40 h-40 md:w-48 md:h-48 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsChatOpen(true)}
      >
        <Canvas 
          key={canvasKey}
          camera={{ position: [0, 0.5, 6], fov: 50 }}
          gl={{ preserveDrawingBuffer: true }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextrestored', () => {
              console.log('WebGL context restored');
            });
          }}
        >
          <ambientLight intensity={3.5} />
          <directionalLight position={[5, 5, 5]} intensity={4.0} castShadow />
          <directionalLight position={[-5, 3, -5]} intensity={3.0} />
          <directionalLight position={[0, 5, 5]} intensity={3.0} />
          <pointLight position={[0, 5, 0]} intensity={3.0} color="#ffffff" />
          <pointLight position={[3, 0, 3]} intensity={2.0} color="#e0f0ff" />
          <pointLight position={[-3, 0, -3]} intensity={2.0} color="#ffffff" />
          <group scale={window.innerWidth < 768 ? 0.85 : 1}>
            <RobotModel />
            <GlowingShadow />
          </group>
        </Canvas>

        {/* Hover prompt - Glass morphism */}
        {isHovered && !isChatOpen && (
          <div className="absolute -top-16 right-2 animate-fade-in pointer-events-none">
            <div className="backdrop-blur-xl bg-primary/10 border border-primary/30 rounded-2xl px-5 py-3 shadow-[0_8px_32px_0_rgba(59,130,246,0.37)] w-max max-w-[calc(100vw-2rem)]">
              <p className="text-sm font-medium text-foreground whitespace-normal">How can I help you?</p>
              <div className="absolute top-full right-12 -mt-1">
                <div className="w-3 h-3 backdrop-blur-xl bg-primary/10 border-r border-b border-primary/30 rotate-45"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Window - Glass morphism */}
      {isChatOpen && (
        <div className="absolute bottom-full right-0 mb-4 w-[85vw] max-w-[320px] md:w-80 backdrop-blur-xl bg-background/80 border border-primary/30 rounded-2xl shadow-[0_8px_32px_0_rgba(59,130,246,0.37)] animate-scale-in overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-primary/10 backdrop-blur-xl border-b border-primary/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse"></div>
              <h3 className="font-semibold text-foreground">Stock Bestie</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsChatOpen(false)}
              className="h-8 w-8 p-0 hover:bg-primary/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="h-64 md:h-80 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-background/50">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-6">
                <p className="text-sm">Hi! I'm Stock Bestie.</p>
                <p className="text-sm">Do you have questions about the stock market?</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                      : 'backdrop-blur-sm bg-muted/80 border border-primary/10'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content || '...'}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="backdrop-blur-sm bg-muted/80 border border-primary/10 rounded-2xl px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce shadow-[0_0_8px_rgba(59,130,246,0.8)]" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce shadow-[0_0_8px_rgba(59,130,246,0.8)]" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce shadow-[0_0_8px_rgba(59,130,246,0.8)]" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-primary/20 p-4 bg-primary/5 backdrop-blur-xl">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 backdrop-blur-sm bg-background/50 border-primary/30 focus:border-primary focus:ring-primary/20"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                size="sm"
                className="gap-2 shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_20px_rgba(59,130,246,0.7)]"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
