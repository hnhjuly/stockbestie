import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, TrendingUp, Bot, ChartLine } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

const ROBOT_MODEL_URL = 'https://wsfdnwxsdmizxuurorpe.supabase.co/storage/v1/object/public/assets/base_basic_shaded.glb';

function RobotModel() {
  const { scene } = useGLTF(ROBOT_MODEL_URL);
  return <primitive object={scene} scale={1.5} position={[0, -1, 0]} />;
}
const Landing = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('waitlist').insert({ email });

      if (error) {
        if (error.code === '23505') {
          toast.info("You're already on the list! We'll be in touch soon 💙");
        } else {
          throw error;
        }
      } else {
        setIsSubmitted(true);
        toast.success("You're on the list! 🎉");
      }
    } catch (error: any) {
      console.error('Waitlist error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Floating shapes background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative z-10">
        {/* 3D Robot Mascot */}
        <div className="mb-8 animate-fade-in w-48 h-48 md:w-64 md:h-64">
          <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Suspense fallback={null}>
              <RobotModel />
            </Suspense>
            <OrbitControls 
              enableZoom={false} 
              enablePan={false}
              autoRotate
              autoRotateSpeed={2}
            />
          </Canvas>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-4 animate-fade-in stagger-1">
          Stock <span className="text-primary">Bestie</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground text-center max-w-md mb-8 animate-fade-in stagger-2">
          Your friendly AI-powered stock market companion is almost here! 📈✨
        </p>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 max-w-md mb-10 animate-fade-in stagger-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span>Real-time tracking</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Bot className="h-4 w-4 text-primary" />
            <span>AI chatbot assistant</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ChartLine className="h-4 w-4 text-primary" />
            <span>Analyst predictions</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Budget planner</span>
          </div>
        </div>

        {/* Waitlist Form */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="w-full max-w-md animate-fade-in stagger-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 text-base bg-card/50 backdrop-blur-sm border-border/50"
                disabled={isSubmitting}
              />
              <Button 
                type="submit" 
                size="lg" 
                className="h-12 px-8 hover-glow"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span> Joining...
                  </span>
                ) : (
                  'Join Waitlist'
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Be the first to know when we launch. No spam, promise! 🤞
            </p>
          </form>
        ) : (
          <div className="text-center animate-fade-in bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-xl font-semibold mb-2">You're on the list!</h2>
            <p className="text-muted-foreground">
              We'll let you know as soon as Stock Bestie is ready for you.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center relative z-10">
        <p className="text-xs text-muted-foreground">
          © 2025 Stock Bestie by{' '}
          <a 
            href="https://www.hanahjuly.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Hanah July
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Landing;
