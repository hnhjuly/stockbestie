import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

export const PWAInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        toast.success('App installed successfully!');
      }
      
      setDeferredPrompt(null);
    } else {
      // Show manual installation instructions
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      
      if (isIOS) {
        toast.info('Tap the Share button, then "Add to Home Screen"');
      } else if (isAndroid) {
        toast.info('Tap the menu (⋮), then "Add to Home Screen" or "Install app"');
      } else {
        toast.info('Look for the install icon in your browser\'s address bar');
      }
    }
  };

  return (
    <Button
      onClick={handleInstall}
      size="sm"
      variant="secondary"
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      Download now
    </Button>
  );
};
