"use client"

import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

interface LoadingContextType {
  isLoading: boolean;
  progress: number;
  setLoading: (loading: boolean, message?: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const setLoading = (loading: boolean, message?: string) => {
    setIsLoading(loading);

    if (loading) {
      toast.loading(message || "Loading...");

      // Simulate progress update
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 20;
        setProgress(currentProgress);
        if (currentProgress >= 100) {
          
          clearInterval(interval);
        }
      }, 500);
    } else {
      setProgress(100);
      setTimeout(() => setProgress(0), 500); // Reset progress after a delay
      toast.dismiss(); // Remove loading toast
    }
  };

  return (
    <LoadingContext.Provider value={{ isLoading, progress, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
