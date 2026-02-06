'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useGameState } from '@/hooks/useGameState';
import { chapters, getRandomQuestions } from '@/data/questions';

function BattleContent() {
  const searchParams = useSearchParams();
  const { progress, battleState, startBattle, answerQuestion, completeBattle, isLoaded } = useGameState();

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const chapterId = searchParams.get('chapter');
  const dungeonId = searchParams.get('dungeon');
  const isBoss = searchParams.get('boss') === 'true';

  const chapter = chapters.find((c) => c.id === chapterId);
  const dungeon = chapter?.dungeons.find((d) => d.id === dungeonId);

  useEffect(() => {
    if (isLoaded && chapter && !battleState) {
      const questions = getRandomQuestions(chapter.strand, isBoss ? 5 : 10);
      const id = isBoss ? `${chapter.id}-boss` : dungeonId || chapter.dungeons[0].id;
      startBattle(id, questions);
    }
  }, [isLoaded, chapter, dungeonId, isBoss, battleState, startBattle]);

  if (!isLoaded || !chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-particles">
        <div className="text-2xl text-amber-400 font-title glow-text">Loading...</div>
      </div>
    );
  }

  if (!battleState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-particles">
        <div className="text-2xl text-amber-400 font-title glow-text animate-pulse">Preparing Battle...</div>
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-particles relative">
        {battleState.isPassed && (
          <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 to-transparent pointer-events-none" />
        )}

        <div className="card-ornate p-8 max-w-md w-full text-center relative z-10">
          {/* Result Icon */}
          <div className={`text-8xl mb-6 ${battleState.isPassed ? 'animate-victory' : 'animate-shake'}`}>
            {battleState.isPassed ? '🏆' : '💀'}
          </div>

          <h1 className={`font-title text-4xl font-black mb-3 ${battleState.isPassed ? 'text-amber-300 glow-text' : 'text-red-400'}`}>
            {battleState.isPassed ? 'VICTORY!' : 'DEFEATED'}
          </h1>

          <p className="text-slate-400 mb-6">
            {battleState.isPassed
              ? 'You have conquered this challenge!'
              : 'The enemy was too powerful. Train harder!'}
          </p>

          {/* Stars */}
          {battleState.isPassed && (
            <div className="flex justify-center gap-3 mb-6">
              {[...Array(3)].map((_, i) => (
                <span
                  key={i}
                  className={`text-5xl transition-all duration-500 ${i < stars ? 'star-earned animate-float' : 'star-empty'}`}
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  ★
                </span>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="glow-border rounded-lg p-4">
              <div className="text-3xl text-emerald-400 font-bold">{battleState.correctAnswers}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">Correct</div>
            </div>
            <div className="glow-border rounded-lg p-4">
              <div className="text-3xl text-red-400 font-bold">{battleState.wrongAnswers}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">Wrong</div>
            </div>
          </div>

          {/* Rewards */}
          {battleState.isPassed && (
            <div className="flex justify-center gap-6 mb-8 py-4 border-y border-slate-700/50">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <span className="text-amber-400 font-bold text-lg">+{battleState.xpEarned} XP</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🪙</span>
                <span className="text-amber-300 font-bold text-lg">+{battleState.goldEarned}</span>
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
              className="btn-epic w-full"
            >
              {battleState.isPassed ? '⚔️ Play Again' : '🔄 Try Again'}
            </button>
            <Link
              href="/map"
              onClick={() => completeBattle()}
              className="btn-epic btn-success w-full block"
            >
              🗺️ Return to Map
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 bg-particles relative">
      {/* Boss atmosphere */}
      {isBoss && (
        <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <Link
          href="/map"
          onClick={() => completeBattle()}
          className="glow-border px-4 py-2 rounded-lg text-amber-200 hover:text-amber-100 transition font-semibold"
        >
          ← Retreat
        </Link>
        <div className="text-center">
          <div className={`text-xs uppercase tracking-widest mb-1 ${isBoss ? 'text-red-400' : 'text-slate-500'}`}>
            {isBoss ? '⚠️ BOSS BATTLE ⚠️' : dungeon?.name}
          </div>
          <div className="font-title font-bold text-lg" style={{ color: chapter.color }}>{chapter.name}</div>
        </div>
        <div className="glow-border px-4 py-2 rounded-lg flex items-center gap-2">
          <span className="text-xl">🪙</span>
          <span className="text-amber-300 font-bold">{progress.gold}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 relative z-10">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">
            Question <span className="text-amber-400 font-bold">{battleState.currentQuestionIndex + 1}</span>/{battleState.questions.length}
          </span>
          <span className="text-emerald-400">{battleState.correctAnswers} correct</span>
        </div>
        <div className="progress-fantasy">
          <div
            className="progress-fantasy-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Hearts */}
      <div className="flex justify-center gap-3 mb-6 relative z-10">
        {[...Array(battleState.maxHearts)].map((_, i) => (
          <span
            key={i}
            className={`text-4xl transition-all duration-300 ${
              i < battleState.hearts
                ? 'drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                : 'grayscale opacity-30'
            } ${i === battleState.hearts && showFeedback && !isCorrect ? 'animate-shake' : ''}`}
          >
            ❤️
          </span>
        ))}
      </div>

      {/* Question Card */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full relative z-10">
        <div className={`card-ornate p-6 md:p-8 w-full mb-6 transition-all duration-300 ${
          showFeedback ? (isCorrect ? 'border-emerald-500/50 shadow-emerald-500/20' : 'border-red-500/50 shadow-red-500/20') : ''
        }`}>
          {/* Monster/Topic */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className={`text-5xl ${isBoss ? 'animate-pulse' : ''}`}>
              {isBoss ? chapter.boss.icon : '👾'}
            </span>
            <div className="text-center">
              <div className="text-xs text-slate-500 uppercase tracking-widest">Topic</div>
              <div className="text-amber-300 font-semibold">{currentQuestion.topic}</div>
            </div>
          </div>

          {/* Question */}
          <h2 className="text-xl md:text-2xl text-center font-semibold mb-8 text-slate-100 leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentQuestion.options.map((option, i) => {
              let btnStyle = "glow-border";
              let extraStyle = "";

              if (showFeedback) {
                if (i === currentQuestion.correctAnswer) {
                  btnStyle = "bg-emerald-600 border-2 border-emerald-400";
                  extraStyle = "shadow-lg shadow-emerald-500/30";
                } else if (i === selectedAnswer && !isCorrect) {
                  btnStyle = "bg-red-600 border-2 border-red-400 animate-shake";
                  extraStyle = "shadow-lg shadow-red-500/30";
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={showFeedback}
                  className={`${btnStyle} ${extraStyle} px-5 py-4 rounded-lg text-left transition-all duration-200 hover:scale-[1.02] hover:border-amber-400/50 disabled:hover:scale-100`}
                >
                  <span className="inline-block w-8 h-8 rounded bg-slate-700/50 text-center leading-8 mr-3 text-amber-400 font-bold">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-slate-200">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className={`mt-6 p-4 rounded-lg border ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <div className={`font-title font-bold text-lg mb-2 ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                {isCorrect ? '✅ Correct!' : '❌ Wrong!'}
              </div>
              {currentQuestion.explanation && (
                <div className="text-sm text-slate-300 mb-2">{currentQuestion.explanation}</div>
              )}
              {isCorrect && (
                <div className="flex gap-4 text-sm pt-2 border-t border-slate-700/50">
                  <span className="text-amber-400">⚡ +{currentQuestion.xpReward} XP</span>
                  <span className="text-amber-300">🪙 +{currentQuestion.goldReward} Gold</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Difficulty Badge */}
        <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
          currentQuestion.difficulty === 'easy'
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            : currentQuestion.difficulty === 'medium'
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              : 'bg-red-500/20 text-red-400 border-red-500/30'
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
      <div className="min-h-screen flex items-center justify-center bg-particles">
        <div className="text-2xl text-amber-400 font-title glow-text">Loading...</div>
      </div>
    }>
      <BattleContent />
    </Suspense>
  );
}
