import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { RefreshCw } from 'lucide-react';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // TODO: Re-enable auth check when ready
  // const { user, isLoading } = useAuth();

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <RefreshCw className="h-8 w-8 animate-spin text-primary" />
  //     </div>
  //   );
  // }

  // if (!user) {
  //   return <Navigate to="/auth" replace />;
  // }

  return <>{children}</>;
};
