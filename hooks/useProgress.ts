"use client";

import { useState, useEffect, useCallback } from "react";
import { ExpectationProgress } from "@/types";

const STORAGE_KEY = "math-progress";

function loadProgress(): Record<string, ExpectationProgress> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(data: Record<string, ExpectationProgress>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useProgress() {
  const [progress, setProgress] = useState<Record<string, ExpectationProgress>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setLoaded(true);
  }, []);

  const recordAnswer = useCallback(
    (code: string, isCorrect: boolean) => {
      setProgress((prev) => {
        const existing = prev[code] || {
          code,
          attempted: 0,
          correct: 0,
          lastAttempted: "",
        };
        const updated = {
          ...prev,
          [code]: {
            ...existing,
            attempted: existing.attempted + 1,
            correct: existing.correct + (isCorrect ? 1 : 0),
            lastAttempted: new Date().toISOString(),
          },
        };
        saveProgress(updated);
        return updated;
      });
    },
    []
  );

  const getExpectationProgress = useCallback(
    (code: string): ExpectationProgress | undefined => {
      return progress[code];
    },
    [progress]
  );

  const resetProgress = useCallback(() => {
    setProgress({});
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return { progress, loaded, recordAnswer, getExpectationProgress, resetProgress };
}
