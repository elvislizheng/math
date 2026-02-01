'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGameState } from '@/hooks/useGameState';
import { chapters, getRandomQuestions } from '@/data/questions';

const btnBase = "inline-block px-6 py-3 rounded-lg font-semibold uppercase tracking-wide text-white transition-all duration-200 hover:opacity-90 active:scale-95 text-center cursor-pointer";
const btnCyan = "border-2 border-cyan-400";
const btnGreen = "border-2 border-green-400";
const btnRed = "border-2 border-red-400";
const cardStyle = "bborder-2 border-slate-700 rounded-xl";

function BattleContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { progress, battleState, startBattle, answerQuestion, completeBattle, isLoaded } = useGameState();

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const chapterId = searchParams.get('chapter');
  const dungeonId = searchParams.get('dungeon');
  const isBoss = searchParams.get('boss') === 'true';

  const chapter = chapters.find((c) => c.id === chapterId);
  const dungeon = chapter?.dungeons.find((d) => d.id === dungeonId);

  // Start battle on mount
  useEffect(() => {
    if (isLoaded && chapter && !battleState) {
      const questions = getRandomQuestions(chapter.strand, isBoss ? 5 : 10);
      const id = isBoss ? `${chapter.id}-boss` : dungeonId || chapter.dungeons[0].id;
      startBattle(id, questions);
    }
  }, [isLoaded, chapter, dungeonId, isBoss, battleState, startBattle]);

  if (!isLoaded || !chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-cyan-400">Loading...</div>
      </div>
    );
  }

  if (!battleState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-cyan-400">Preparing battle...</div>
      </div>
    );
  }

  const currentQuestion = battleState.questions[battleState.currentQuestionIndex];
  const progressPercent = ((battleState.currentQuestionIndex) / battleState.questions.length) * 100;

  const handleAnswer = (answerIndex: number) => {
    if (showFeedback) return;

    setSelectedAnswer(answerIndex);
    const correct = answerIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    setTimeout(() => {
      answerQuestion(answerIndex);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }, 1500);
  };

  // Battle complete screen
  if (battleState.isComplete) {
    const stars = battleState.correctAnswers === battleState.questions.length
      ? 3
      : battleState.correctAnswers >= battleState.questions.length - 1
        ? 2
        : battleState.isPassed
          ? 1
          : 0;

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className={`${cardStyle} p-8 max-w-md w-full text-center`}>
          {/* Result Icon */}
          <div className={`text-8xl mb-4 ${battleState.isPassed ? 'animate-bounce' : 'animate-pulse'}`}>
            {battleState.isPassed ? '🏆' : '💀'}
          </div>

          <h1 className={`text-3xl font-bold mb-2 ${battleState.isPassed ? 'text-green-400' : 'text-red-400'}`}>
            {battleState.isPassed ? 'Victory!' : 'Defeated!'}
          </h1>

          <p className="text-gray-400 mb-6">
            {battleState.isPassed
              ? 'You have conquered this challenge!'
              : 'The monsters were too strong. Try again!'}
          </p>

          {/* Stars */}
          {battleState.isPassed && (
            <div className="flex justify-center gap-2 mb-6">
              {[...Array(3)].map((_, i) => (
                <span key={i} className={`text-4xl ${i < stars ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'text-gray-600'}`}>
                  ★
                </span>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`${cardStyle} p-4`}>
              <div className="text-2xl text-green-400 font-bold">{battleState.correctAnswers}</div>
              <div className="text-sm text-gray-500">Correct</div>
            </div>
            <div className={`${cardStyle} p-4`}>
              <div className="text-2xl text-red-400 font-bold">{battleState.wrongAnswers}</div>
              <div className="text-sm text-gray-500">Wrong</div>
            </div>
          </div>

          {/* Rewards */}
          {battleState.isPassed && (
            <div className="flex justify-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <span className="text-cyan-400 font-semibold">+{battleState.xpEarned} XP</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🪙</span>
                <span className="text-yellow-400 font-semibold">+{battleState.goldEarned}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                completeBattle();
                const questions = getRandomQuestions(chapter.strand, isBoss ? 5 : 10);
                startBattle(battleState.dungeonId, questions);
              }}
              className={`${btnBase} ${btnCyan} w-full`}
            >
              {battleState.isPassed ? 'Play Again' : 'Try Again'}
            </button>
            <Link
              href="/map"
              onClick={() => completeBattle()}
              className={`${btnBase} ${btnGreen} w-full`}
            >
              Return to Map
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/map"
          className="text-gray-400 hover:text-white transition"
          onClick={() => completeBattle()}
        >
          ← Retreat
        </Link>
        <div className="text-center">
          <div className="text-sm text-gray-500">{isBoss ? 'BOSS BATTLE' : dungeon?.name}</div>
          <div className="font-semibold" style={{ color: chapter.color }}>{chapter.name}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🪙</span>
          <span className="text-yellow-400">{progress.gold}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Question {battleState.currentQuestionIndex + 1}/{battleState.questions.length}</span>
          <span className="text-gray-400">{battleState.correctAnswers} correct</span>
        </div>
        <div className="h-5 bg-slate-900 border-2 border-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Hearts */}
      <div className="flex justify-center gap-2 mb-6">
        {[...Array(battleState.maxHearts)].map((_, i) => (
          <span
            key={i}
            className={`text-3xl transition-all ${
              i < battleState.hearts ? 'text-red-500' : 'text-gray-600'
            } ${i === battleState.hearts && showFeedback && !isCorrect ? 'animate-pulse' : ''}`}
          >
            ❤️
          </span>
        ))}
      </div>

      {/* Question Card */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        <div className={`${cardStyle} p-6 md:p-8 w-full mb-6 ${showFeedback ? (isCorrect ? 'border-green-500' : 'border-red-500') : ''}`}>
          {/* Monster/Topic */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl">{isBoss ? chapter.boss.icon : '👾'}</span>
            <span className="text-sm text-gray-400 uppercase tracking-wider">{currentQuestion.topic}</span>
          </div>

          {/* Question */}
          <h2 className="text-xl md:text-2xl text-center font-semibold mb-6">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentQuestion.options.map((option, i) => {
              let btnClass = `${btnBase} ${btnCyan} w-full text-left`;
              if (showFeedback) {
                if (i === currentQuestion.correctAnswer) {
                  btnClass = `${btnBase} bg-green-500 border-2 border-green-400 w-full text-left`;
                } else if (i === selectedAnswer && !isCorrect) {
                  btnClass = `${btnBase} bg-red-500 border-2 border-red-400 w-full text-left animate-pulse`;
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={showFeedback}
                  className={btnClass}
                >
                  <span className="mr-3 opacity-60">{String.fromCharCode(65 + i)}.</span>
                  {option}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className={`mt-6 p-4 rounded-lg ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              <div className={`font-semibold mb-1 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? '✅ Correct!' : '❌ Wrong!'}
              </div>
              {currentQuestion.explanation && (
                <div className="text-sm text-gray-300">{currentQuestion.explanation}</div>
              )}
              {isCorrect && (
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="text-cyan-400">+{currentQuestion.xpReward} XP</span>
                  <span className="text-yellow-400">+{currentQuestion.goldReward} Gold</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Difficulty Badge */}
        <div className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider ${
          currentQuestion.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
          currentQuestion.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          {currentQuestion.difficulty}
        </div>
      </div>
    </div>
  );
}

export default function BattlePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-cyan-400">Loading...</div>
      </div>
    }>
      <BattleContent />
    </Suspense>
  );
}
