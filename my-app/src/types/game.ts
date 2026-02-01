export type Difficulty = 'easy' | 'medium' | 'hard';

export type Strand =
  | 'number'
  | 'algebra'
  | 'data'
  | 'spatial'
  | 'financial';

export interface Question {
  id: string;
  strand: Strand;
  topic: string;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  xpReward: number;
  goldReward: number;
}

export interface Chapter {
  id: string;
  name: string;
  strand: Strand;
  description: string;
  icon: string;
  color: string;
  bgGradient: string;
  dungeons: Dungeon[];
  boss: Boss;
  requiredLevel: number;
}

export interface Dungeon {
  id: string;
  chapterId: string;
  name: string;
  description: string;
  icon: string;
  questionCount: number;
  requiredStars: number;
  topics: string[];
  difficulty: Difficulty;
}

export interface Boss {
  id: string;
  name: string;
  icon: string;
  description: string;
  questionCount: number;
  difficulty: 'hard';
}

export interface PlayerProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  gold: number;
  totalCorrect: number;
  totalAnswered: number;
  completedDungeons: Record<string, DungeonResult>;
  achievements: string[];
  currentStreak: number;
  bestStreak: number;
}

export interface DungeonResult {
  dungeonId: string;
  stars: number;
  bestScore: number;
  attempts: number;
  completed: boolean;
  perfectRun: boolean;
}

export interface BattleState {
  dungeonId: string;
  questions: Question[];
  currentQuestionIndex: number;
  hearts: number;
  maxHearts: number;
  correctAnswers: number;
  wrongAnswers: number;
  xpEarned: number;
  goldEarned: number;
  startTime: number;
  answers: (number | null)[];
  isComplete: boolean;
  isPassed: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (progress: PlayerProgress) => boolean;
  reward: {
    xp?: number;
    gold?: number;
  };
}

export type GameScreen = 'home' | 'map' | 'battle' | 'results' | 'achievements';
