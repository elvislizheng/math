'use client';

import Link from 'next/link';
import { useGameState } from '@/hooks/useGameState';

export default function Home() {
  const { progress, isLoaded, resetGame } = useGameState();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-particles">
        <div className="text-2xl text-amber-400 font-title glow-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-particles relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      {/* Title Section */}
      <div className="text-center mb-12 relative z-10">
        <div className="text-7xl mb-6 animate-float filter drop-shadow-lg">⚔️</div>
        <h1 className="font-title text-6xl md:text-7xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 glow-text tracking-wider">
          MATH QUEST
        </h1>
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="h-px w-16 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
          <h2 className="font-title text-xl text-amber-200/80 tracking-[0.3em] uppercase">The Number Realm</h2>
          <span className="h-px w-16 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
        </div>
        <p className="text-slate-400 text-sm tracking-wide">Ontario Grade 7 Mathematics Adventure</p>
      </div>

      {/* Player Stats Card */}
      {progress.totalAnswered > 0 && (
        <div className="card-ornate p-6 mb-8 w-full max-w-md relative z-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-2xl border-2 border-amber-300 shadow-lg shadow-amber-500/30">
                🦸
              </div>
              <div>
                <div className="font-title text-xl font-bold text-amber-100">Math Hero</div>
                <div className="text-amber-400/80 font-semibold">Level {progress.level}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-lg">
                <span className="text-2xl">🪙</span>
                <span>{progress.gold}</span>
              </div>
            </div>
          </div>

          {/* XP Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-amber-400 font-semibold tracking-wide">EXPERIENCE</span>
              <span className="text-slate-400">{progress.xp} / {progress.xpToNextLevel}</span>
            </div>
            <div className="progress-fantasy">
              <div
                className="progress-fantasy-fill"
                style={{ width: `${(progress.xp / progress.xpToNextLevel) * 100}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700/50">
            <div className="text-center">
              <div className="text-emerald-400 font-bold text-xl">{progress.totalCorrect}</div>
              <div className="text-slate-500 text-xs uppercase tracking-wider">Victories</div>
            </div>
            <div className="text-center">
              <div className="text-sky-400 font-bold text-xl">{progress.totalAnswered}</div>
              <div className="text-slate-500 text-xs uppercase tracking-wider">Battles</div>
            </div>
            <div className="text-center">
              <div className="text-amber-400 font-bold text-xl">{progress.bestStreak}</div>
              <div className="text-slate-500 text-xs uppercase tracking-wider">Best Streak</div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 w-full max-w-md relative z-10">
        <Link href="/map" className="btn-epic text-center text-lg block">
          {progress.totalAnswered > 0 ? '⚔️ Continue Quest' : '⚔️ Begin Quest'}
        </Link>

        {progress.totalAnswered > 0 && (
          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset all progress?')) {
                resetGame();
              }
            }}
            className="btn-epic btn-danger text-center text-sm"
          >
            Reset Progress
          </button>
        )}
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 max-w-2xl relative z-10">
        {[
          { icon: '🌲', label: '5 Realms', desc: 'Explore' },
          { icon: '🐉', label: 'Boss Fights', desc: 'Conquer' },
          { icon: '⭐', label: 'Star Ratings', desc: 'Master' },
          { icon: '🏆', label: 'Achievements', desc: 'Collect' },
        ].map((feature, i) => (
          <div
            key={i}
            className="glow-border rounded-lg p-5 text-center transition-all duration-300 hover:scale-105 hover:border-amber-400/50 group"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{feature.icon}</div>
            <div className="font-title font-bold text-amber-200 mb-1">{feature.label}</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest">{feature.desc}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-14 text-center relative z-10">
        <div className="flex items-center justify-center gap-3 text-slate-600 text-sm">
          <span className="h-px w-8 bg-slate-700" />
          <span>Based on Ontario Grade 7 Mathematics Curriculum</span>
          <span className="h-px w-8 bg-slate-700" />
        </div>
      </div>
    </div>
  );
}
