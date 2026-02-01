'use client';

import Link from 'next/link';
import { useGameState } from '@/hooks/useGameState';

const btnBase = "inline-block px-6 py-3 rounded-lg font-semibold uppercase tracking-wide text-white transition-all duration-200 hover:opacity-90 active:scale-95 text-center cursor-pointer";
const btnCyan = "border-2 border-cyan-400";
const btnRed = "border-2 border-red-400";
const cardStyle = " border-2 border-slate-700 rounded-xl";

export default function Home() {
  const { progress, isLoaded, resetGame } = useGameState();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-cyan-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* Title Section */}
      <div className="text-center mb-12">
        <div className="text-6xl mb-4 animate-bounce">⚔️</div>
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-amber-400 bg-clip-text text-transparent">
          Math Quest
        </h1>
        <h2 className="text-2xl text-gray-400 mb-2">The Number Realm</h2>
        <p className="text-gray-500">Ontario Grade 7 Math Adventure</p>
      </div>

      {/* Player Stats Card */}
      {progress.totalAnswered > 0 && (
        <div className={`${cardStyle} p-6 mb-8 w-full max-w-md`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-pink-500 flex items-center justify-center text-2xl">
                🦸
              </div>
              <div>
                <div className="text-lg font-semibold">Math Hero</div>
                <div className="text-sm text-gray-400">Level {progress.level}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-yellow-400 font-semibold flex items-center gap-1">
                🪙 {progress.gold}
              </div>
            </div>
          </div>

          {/* XP Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-cyan-400">XP</span>
              <span className="text-gray-400">{progress.xp} / {progress.xpToNextLevel}</span>
            </div>
            <div className="h-5 bg-slate-900 border-2 border-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${(progress.xp / progress.xpToNextLevel) * 100}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4 text-center text-sm">
            <div>
              <div className="text-green-400 font-semibold">{progress.totalCorrect}</div>
              <div className="text-gray-500">Correct</div>
            </div>
            <div>
              <div className="text-blue-400 font-semibold">{progress.totalAnswered}</div>
              <div className="text-gray-500">Answered</div>
            </div>
            <div>
              <div className="text-amber-400 font-semibold">{progress.bestStreak}</div>
              <div className="text-gray-500">Best Streak</div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 w-full max-w-md">
        <Link href="/map" className={`${btnBase} ${btnCyan} text-lg`}>
          {progress.totalAnswered > 0 ? 'Continue Quest' : 'Start Quest'}
        </Link>

        {progress.totalAnswered > 0 && (
          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset all progress?')) {
                resetGame();
              }
            }}
            className={`${btnBase} ${btnRed}`}
          >
            Reset Progress
          </button>
        )}
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-2xl">
        {[
          { icon: '🌲', label: '5 Chapters' },
          { icon: '🐉', label: 'Boss Battles' },
          { icon: '⭐', label: 'Star Ratings' },
          { icon: '🏆', label: 'Achievements' },
        ].map((feature, i) => (
          <div key={i} className={`${cardStyle} p-4 text-center hover:border-cyan-500 transition-colors`}>
            <div className="text-3xl mb-2">{feature.icon}</div>
            <div className="text-sm text-gray-400">{feature.label}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-gray-600 text-sm">
        <p>Based on Ontario Grade 7 Mathematics Curriculum</p>
      </div>
    </div>
  );
}
