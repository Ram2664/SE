import React, { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export type UserRole = "admin" | "teacher" | "student";
export type UserStatus = "pending" | "approved" | "rejected";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  profileImage: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  getPendingUsers: () => Promise<User[]>;
  approveUser: (userId: number) => Promise<User>;
  rejectUser: (userId: number) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  
  const {
    data: user,
    error,
    isLoading,
    refetch
  } = useQuery<User | null>({
    queryKey: ["/api/user"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/user");
        if (!res.ok) {
          if (res.status === 401) {
            return null;
          }
          throw new Error("Failed to fetch user");
        }
        return await res.json();
      } catch (error) {
        console.error("Error fetching user:", error);
        return null;
      }
    }
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      console.log("Attempting login with:", {...credentials, password: "***"});
      const res = await apiRequest("POST", "/api/login", credentials);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Login error response:", errorData);
        throw new Error(errorData.error || "Login failed");
      }
      return await res.json();
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Login successful",
        description: "You have been logged in",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const res = await apiRequest("POST", "/api/register", data);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Registration failed");
      }
      return await res.json();
    },
    onSuccess: (data) => {
      if (data.status === "pending") {
        toast({
          title: "Registration successful",
          description: "Your account is pending approval by an administrator",
        });
      } else {
        refetch();
        toast({
          title: "Registration successful",
          description: "You have been registered and logged in",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/logout");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Logout failed");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logout successful",
        description: "You have been logged out",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const login = async (credentials: LoginCredentials) => {
    await loginMutation.mutateAsync(credentials);
  };

  const register = async (data: RegisterData) => {
    await registerMutation.mutateAsync(data);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const getPendingUsers = async (): Promise<User[]> => {
    if (user?.role !== "admin") {
      throw new Error("Only administrators can view pending users");
    }
    
    const res = await apiRequest("GET", "/api/admin/pending-users");
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to fetch pending users");
    }
    
    return await res.json();
  };

  const approveUser = async (userId: number): Promise<User> => {
    if (user?.role !== "admin") {
      throw new Error("Only administrators can approve users");
    }
    
    const res = await apiRequest("POST", `/api/admin/approve-user/${userId}`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to approve user");
    }
    
    toast({
      title: "User approved",
      description: "The user has been approved successfully",
    });
    
    return await res.json();
  };

  const rejectUser = async (userId: number): Promise<User> => {
    if (user?.role !== "admin") {
      throw new Error("Only administrators can reject users");
    }
    
    const res = await apiRequest("POST", `/api/admin/reject-user/${userId}`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to reject user");
    }
    
    toast({
      title: "User rejected",
      description: "The user has been rejected",
    });
    
    return await res.json();
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        error,
        login,
        register,
        logout,
        getPendingUsers,
        approveUser,
        rejectUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};