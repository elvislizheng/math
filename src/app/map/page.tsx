'use client';

import Link from 'next/link';
import { useGameState } from '@/hooks/useGameState';
import { chapters } from '@/data/questions';

export default function MapPage() {
  const { progress, isLoaded } = useGameState();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-particles">
        <div className="text-2xl text-amber-400 font-title glow-text">Loading...</div>
      </div>
    );
  }

  const totalStars = Object.values(progress.completedDungeons).reduce(
    (sum, d) => sum + d.stars,
    0
  );

  return (
    <div className="min-h-screen p-4 md:p-8 bg-particles relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-amber-900/20 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <Link href="/" className="glow-border px-4 py-2 rounded-lg text-amber-200 hover:text-amber-100 transition flex items-center gap-2 font-semibold">
          <span>←</span> <span className="hidden sm:inline">Return Home</span>
        </Link>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 glow-border px-3 py-2 rounded-lg">
            <span className="text-xl">⭐</span>
            <span className="text-amber-300 font-bold">{totalStars}</span>
          </div>
          <div className="flex items-center gap-2 glow-border px-3 py-2 rounded-lg">
            <span className="text-xl">🪙</span>
            <span className="text-amber-300 font-bold">{progress.gold}</span>
          </div>
          <div className="glow-border px-4 py-2 rounded-lg">
            <span className="font-title font-bold text-amber-400">Lv.{progress.level}</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-10 relative z-10">
        <h1 className="font-title text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-500 mb-3">
          World Map
        </h1>
        <p className="text-slate-400">Choose your realm to conquer</p>
      </div>

      {/* Chapters Grid */}
      <div className="grid gap-6 max-w-4xl mx-auto relative z-10">
        {chapters.map((chapter, index) => {
          const isUnlocked = progress.level >= chapter.requiredLevel;
          const chapterStars = chapter.dungeons.reduce((sum, d) => {
            const result = progress.completedDungeons[d.id];
            return sum + (result?.stars || 0);
          }, 0);
          const maxStars = chapter.dungeons.length * 3;

          return (
            <div
              key={chapter.id}
              className={`card-ornate p-6 transition-all duration-300 ${
                isUnlocked
                  ? 'hover:scale-[1.01] hover:border-amber-400/50'
                  : 'opacity-40 grayscale pointer-events-none'
              }`}
            >
              <div className="flex items-start gap-5">
                {/* Chapter Icon */}
                <div
                  className={`w-20 h-20 rounded-xl flex items-center justify-center text-4xl border-2 shadow-lg transition-transform ${
                    isUnlocked
                      ? `bg-gradient-to-br ${chapter.bgGradient} border-white/20 shadow-amber-500/20 hover:scale-105`
                      : 'bg-slate-800 border-slate-700'
                  }`}
                >
                  {isUnlocked ? chapter.icon : '🔒'}
                </div>

                {/* Chapter Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="font-title text-2xl font-bold text-amber-100">{chapter.name}</h2>
                    {!isUnlocked && (
                      <span className="text-xs bg-slate-800 border border-slate-700 px-2 py-1 rounded text-slate-400">
                        Unlocks at Lv.{chapter.requiredLevel}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm mb-3">{chapter.description}</p>

                  {/* Progress Stars */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(3)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xl ${i < Math.floor(chapterStars / chapter.dungeons.length) ? 'star-earned' : 'star-empty'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-slate-500">
                      {chapterStars}/{maxStars} stars collected
                    </span>
                  </div>

                  {/* Dungeons */}
                  {isUnlocked && (
                    <div className="flex flex-wrap gap-2">
                      {chapter.dungeons.map((dungeon) => {
                        const result = progress.completedDungeons[dungeon.id];
                        return (
                          <Link
                            key={dungeon.id}
                            href={`/battle?chapter=${chapter.id}&dungeon=${dungeon.id}`}
                            className={`glow-border px-4 py-2 rounded-lg text-sm transition-all hover:scale-105 hover:border-amber-400/50 ${
                              result?.completed ? 'border-emerald-500/50' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span>{dungeon.icon}</span>
                              <span className="text-slate-200">{dungeon.name}</span>
                              {result && (
                                <div className="flex ml-1">
                                  {[...Array(3)].map((_, i) => (
                                    <span
                                      key={i}
                                      className={`text-xs ${i < result.stars ? 'star-earned' : 'star-empty'}`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </Link>
                        );
                      })}

                      {/* Boss */}
                      <Link
                        href={`/battle?chapter=${chapter.id}&boss=true`}
                        className="glow-border px-4 py-2 rounded-lg text-sm border-red-500/40 hover:border-red-500 hover:scale-105 transition-all group"
                      >
                        <div className="flex items-center gap-2 text-red-400 group-hover:text-red-300">
                          <span className="group-hover:animate-pulse">{chapter.boss.icon}</span>
                          <span className="font-semibold">BOSS</span>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-10 text-center text-sm text-slate-500 relative z-10">
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-slate-700" />
          <p>Conquer dungeons to earn ⭐ stars and ⚡ experience</p>
          <span className="h-px w-12 bg-slate-700" />
        </div>
      </div>
    </div>
  );
}
