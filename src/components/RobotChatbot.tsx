import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import robotModel from '@/assets/bestibotcute.glb';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function RobotModel() {
  const { scene } = useGLTF(robotModel);
  const meshRef = useRef<any>();

  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
      // Gentle rotation
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });

  return (
    <primitive 
      ref={meshRef} 
      object={scene} 
      scale={3.5}
      position={[0, 0, 0]}
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
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]}>
      <circleGeometry args={[1.5, 32]} />
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Add empty assistant message for streaming
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-with-robot`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: [...messages, userMessage] }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error('Failed to start stream');
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
    <div className="fixed bottom-12 right-8 z-50">
      {/* 3D Robot */}
      <div
        className="relative w-48 h-48 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsChatOpen(true)}
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={2.5} />
          <directionalLight position={[5, 5, 5]} intensity={3.0} castShadow />
          <directionalLight position={[-5, 3, -5]} intensity={2.0} />
          <pointLight position={[0, 5, 0]} intensity={2.2} color="#ffffff" />
          <pointLight position={[3, 0, 3]} intensity={1.2} color="#a0c5ff" />
          <RobotModel />
          <GlowingShadow />
        </Canvas>

        {/* Hover prompt - Glass morphism */}
        {isHovered && !isChatOpen && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 animate-fade-in">
            <div className="backdrop-blur-xl bg-primary/10 border border-primary/30 rounded-2xl px-5 py-3 shadow-[0_8px_32px_0_rgba(59,130,246,0.37)]">
              <p className="text-sm font-medium whitespace-nowrap text-foreground">How can I help you?</p>
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                <div className="w-3 h-3 backdrop-blur-xl bg-primary/10 border-r border-b border-primary/30 rotate-45"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Window - Glass morphism */}
      {isChatOpen && (
        <div className="absolute bottom-full right-0 mb-4 w-80 backdrop-blur-xl bg-background/80 border border-primary/30 rounded-2xl shadow-[0_8px_32px_0_rgba(59,130,246,0.37)] animate-scale-in overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-primary/10 backdrop-blur-xl border-b border-primary/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse"></div>
              <h3 className="font-semibold text-foreground">Stock Bestie Assistant</h3>
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
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-background/50">
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
