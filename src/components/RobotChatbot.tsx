import { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, PerspectiveCamera } from '@react-three/drei';
import { Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import robotModel from '@/assets/bestibotcute.glb';

function RobotModel() {
  const { scene } = useGLTF(robotModel);
  const meshRef = useRef<any>();

  // Floating animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <primitive 
      ref={meshRef} 
      object={scene} 
      scale={2.5} 
      position={[0, 0, 0]}
    />
  );
}

function GlowingShadow() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}>
      <circleGeometry args={[0.8, 32]} />
      <meshBasicMaterial 
        color="#60a5fa" 
        transparent 
        opacity={0.3}
        blending={2}
      />
    </mesh>
  );
}

export const RobotChatbot = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-robot', {
        body: { message: userMessage, conversationHistory: messages }
      });

      if (error) throw error;

      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error: any) {
      console.error('Chat error:', error);
      toast.error('Failed to send message. Please try again.');
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat Bubble */}
      {(isHovered || isChatOpen) && (
        <div className="bg-card border border-border rounded-2xl shadow-2xl animate-scale-in w-80 max-h-96 flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-sm">Stock Bestie Assistant</h3>
            {isChatOpen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsChatOpen(false);
                  setMessages([]);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {!isChatOpen ? (
            <div className="p-4">
              <p className="text-sm text-muted-foreground">How can I help you?</p>
              <Button
                onClick={() => setIsChatOpen(true)}
                className="w-full mt-3"
                size="sm"
              >
                Start Chat
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-64">
                {messages.length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    Ask me anything about stocks!
                  </div>
                )}
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`text-sm p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-8'
                        : 'bg-muted mr-8'
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
                {isLoading && (
                  <div className="text-sm p-3 rounded-lg bg-muted mr-8">
                    <div className="flex gap-1">
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce delay-100">.</span>
                      <span className="animate-bounce delay-200">.</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-border flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* 3D Robot */}
      <div
        className="w-32 h-32 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => !isChatOpen && setIsHovered(false)}
      >
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, 5, -5]} intensity={0.5} color="#60a5fa" />
          <Suspense fallback={null}>
            <RobotModel />
            <GlowingShadow />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};
