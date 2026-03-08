import { LayoutDashboard, Home, PiggyBank, GraduationCap, BookOpen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Home, label: 'Stocks', path: '/app' },
  { icon: GraduationCap, label: 'Academy', path: '/academy' },
  { icon: BookOpen, label: 'Glossary', path: '/glossary' },
  { icon: PiggyBank, label: 'Budget', path: '/budget' },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-2xl transition-all duration-300",
                isActive
                  ? "bg-primary text-primary-foreground scale-105 shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "animate-bounce-once")} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
