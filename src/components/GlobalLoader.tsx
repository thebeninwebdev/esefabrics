"use client";

import { useLoading } from "@/context/LoadingContext";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

export default function GlobalLoader() {
  const { isLoading, progress } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 overscroll-contain">
      <div className="text-center">
        <Loader2 className="animate-spin text-primary w-12 h-12 mx-auto mb-4" />
        <p className="text-white text-lg mb-2">Loading, please wait...</p>
        <Progress value={progress} className="w-64 h-2 bg-secondary" />
      </div>
    </div>
  );
}
