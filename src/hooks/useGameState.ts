'use client';

import { useState, useEffect, useCallback } from 'react';
import { PlayerProgress, BattleState, Question, DungeonResult } from '@/types/game';

const STORAGE_KEY = 'math-quest-progress';

const initialProgress: PlayerProgress = {
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  gold: 0,
  totalCorrect: 0,
  totalAnswered: 0,
  completedDungeons: {},
  achievements: [],
  currentStreak: 0,
  bestStreak: 0,
};

export function useGameState() {
  const [progress, setProgress] = useState<PlayerProgress>(initialProgress);
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setProgress(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to load progress:', e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress, isLoaded]);

  // Calculate XP needed for next level
  const calculateXpForLevel = (level: number) => Math.floor(100 * Math.pow(1.5, level - 1));

  // Add XP and handle level up
  const addXp = useCallback((amount: number) => {
    setProgress((prev) => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let xpToNext = prev.xpToNextLevel;

      while (newXp >= xpToNext) {
        newXp -= xpToNext;
        newLevel++;
        xpToNext = calculateXpForLevel(newLevel);
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        xpToNextLevel: xpToNext,
      };
    });
  }, []);

  // Add gold
  const addGold = useCallback((amount: number) => {
    setProgress((prev) => ({
      ...prev,
      gold: prev.gold + amount,
    }));
  }, []);

  // Start a new battle
  const startBattle = useCallback((dungeonId: string, questions: Question[]) => {
    setBattleState({
      dungeonId,
      questions,
      currentQuestionIndex: 0,
      hearts: 3,
      maxHearts: 3,
      correctAnswers: 0,
      wrongAnswers: 0,
      xpEarned: 0,
      goldEarned: 0,
      startTime: Date.now(),
      answers: new Array(questions.length).fill(null),
      isComplete: false,
      isPassed: false,
    });
  }, []);

  // Answer a question
  const answerQuestion = useCallback((answerIndex: number) => {
    if (!battleState || battleState.isComplete) return;

    const currentQuestion = battleState.questions[battleState.currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;

    setBattleState((prev) => {
      if (!prev) return prev;

      const newAnswers = [...prev.answers];
      newAnswers[prev.currentQuestionIndex] = answerIndex;

      const newCorrect = prev.correctAnswers + (isCorrect ? 1 : 0);
      const newWrong = prev.wrongAnswers + (isCorrect ? 0 : 1);
      const newHearts = prev.hearts - (isCorrect ? 0 : 1);
      const newXp = prev.xpEarned + (isCorrect ? currentQuestion.xpReward : 0);
      const newGold = prev.goldEarned + (isCorrect ? currentQuestion.goldReward : 0);

      const isLastQuestion = prev.currentQuestionIndex >= prev.questions.length - 1;
      const isGameOver = newHearts <= 0;
      const isComplete = isLastQuestion || isGameOver;
      const isPassed = newCorrect >= Math.ceil(prev.questions.length * 0.8);

      return {
        ...prev,
        answers: newAnswers,
        correctAnswers: newCorrect,
        wrongAnswers: newWrong,
        hearts: newHearts,
        xpEarned: newXp,
        goldEarned: newGold,
        currentQuestionIndex: isComplete ? prev.currentQuestionIndex : prev.currentQuestionIndex + 1,
        isComplete,
        isPassed: isComplete ? isPassed : prev.isPassed,
      };
    });

    // Update streak
    setProgress((prev) => ({
      ...prev,
      currentStreak: isCorrect ? prev.currentStreak + 1 : 0,
      bestStreak: isCorrect ? Math.max(prev.bestStreak, prev.currentStreak + 1) : prev.bestStreak,
      totalCorrect: prev.totalCorrect + (isCorrect ? 1 : 0),
      totalAnswered: prev.totalAnswered + 1,
    }));
  }, [battleState]);

  // Complete battle and save results
  const completeBattle = useCallback(() => {
    if (!battleState) return;

    const stars = battleState.correctAnswers === battleState.questions.length
      ? 3
      : battleState.correctAnswers >= battleState.questions.length - 1
        ? 2
        : battleState.isPassed
          ? 1
          : 0;

    if (battleState.isPassed) {
      addXp(battleState.xpEarned);
      addGold(battleState.goldEarned);

      setProgress((prev) => {
        const existingResult = prev.completedDungeons[battleState.dungeonId];
        const newResult: DungeonResult = {
          dungeonId: battleState.dungeonId,
          stars: Math.max(stars, existingResult?.stars || 0),
          bestScore: Math.max(battleState.correctAnswers, existingResult?.bestScore || 0),
          attempts: (existingResult?.attempts || 0) + 1,
          completed: true,
          perfectRun: battleState.correctAnswers === battleState.questions.length || existingResult?.perfectRun || false,
        };

        return {
          ...prev,
          completedDungeons: {
            ...prev.completedDungeons,
            [battleState.dungeonId]: newResult,
          },
        };
      });
    }

    setBattleState(null);
  }, [battleState, addXp, addGold]);

  // Reset game
  const resetGame = useCallback(() => {
    setProgress(initialProgress);
    setBattleState(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    progress,
    battleState,
    isLoaded,
    startBattle,
    answerQuestion,
    completeBattle,
    addXp,
    addGold,
    resetGame,
  };
}
