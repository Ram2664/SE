import { ReactNode } from "react";
import { Route, Redirect } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  path: string;
  component: () => JSX.Element | null;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ 
  path, 
  component: Component, 
  allowedRoles 
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  return (
    <Route path={path}>
      {() => {
        if (isLoading) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          );
        }

        if (!user) {
          return <Redirect to="/login" />;
        }

        if (allowedRoles && !allowedRoles.includes(user.role)) {
          return <Redirect to="/" />;
        }

        return <Component />;
      }}
    </Route>
  );
};

interface RoleBasedRouteProps {
  path: string;
  roles: string[];
  children: ReactNode;
}

export const RoleBasedRoute = ({ path, roles, children }: RoleBasedRouteProps) => {
  const { user } = useAuth();
  
  return (
    <Route path={path}>
      {() => {
        if (!user || !roles.includes(user.role)) {
          return <Redirect to="/" />;
        }
        
        return <>{children}</>;
      }}
    </Route>
  );
};