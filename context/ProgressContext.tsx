"use client";

import { createContext, useContext, ReactNode } from "react";
import { useProgress } from "@/hooks/useProgress";
import { ExpectationProgress } from "@/types";

type ProgressContextType = {
  progress: Record<string, ExpectationProgress>;
  loaded: boolean;
  recordAnswer: (code: string, isCorrect: boolean) => void;
  getExpectationProgress: (code: string) => ExpectationProgress | undefined;
  resetProgress: () => void;
};

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const value = useProgress();
  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgressContext() {
  const ctx = useContext(ProgressContext);
  if (!ctx)
    throw new Error("useProgressContext must be used within ProgressProvider");
  return ctx;
}
