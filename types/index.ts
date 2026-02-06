export type Expectation = {
  code: string;
  title: string;
  description: string;
};

export type Substrand = {
  id: string;
  name: string;
  expectations: Expectation[];
};

export type Strand = {
  id: string;
  name: string;
  description: string;
  substrands: Substrand[];
};

export type QuestionType = "multiple-choice" | "numeric-input" | "true-false";

export type Question = {
  id: string;
  expectation: string;
  type: QuestionType;
  question: string;
  choices?: string[];
  correctAnswer: string;
  hint?: string;
  explanation: string;
};

export type ExpectationProgress = {
  code: string;
  attempted: number;
  correct: number;
  lastAttempted: string;
};
