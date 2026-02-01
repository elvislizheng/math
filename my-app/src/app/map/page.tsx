'use client';

import Link from 'next/link';
import { useGameState } from '@/hooks/useGameState';
import { chapters } from '@/data/questions';

export default function MapPage() {
  const { progress, isLoaded } = useGameState();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-cyan-400">Loading...</div>
      </div>
    );
  }

  const totalStars = Object.values(progress.completedDungeons).reduce(
    (sum, d) => sum + d.stars,
    0
  );

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="text-gray-400 hover:text-white transition flex items-center gap-2">
          ← Home
        </Link>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span className="text-yellow-400 font-semibold">{totalStars}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🪙</span>
            <span className="text-yellow-400 font-semibold">{progress.gold}</span>
          </div>
          <div className="rpg-card px-4 py-2">
            <span className="text-cyan-400">Lv.{progress.level}</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">World Map</h1>
        <p className="text-gray-400">Choose your adventure</p>
      </div>

      {/* Chapters Grid */}
      <div className="grid gap-6 max-w-4xl mx-auto">
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
              className={`rpg-card p-6 transition-all ${
                isUnlocked ? 'hover:scale-[1.02]' : 'opacity-50 grayscale'
              }`}
            >
              <div className="flex items-start gap-6">
                {/* Chapter Icon */}
                <div
                  className={`w-20 h-20 rounded-xl flex items-center justify-center text-4xl ${
                    isUnlocked ? `bg-gradient-to-br ${chapter.bgGradient}` : 'bg-gray-700'
                  }`}
                >
                  {isUnlocked ? chapter.icon : '🔒'}
                </div>

                {/* Chapter Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold">{chapter.name}</h2>
                    {!isUnlocked && (
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                        Unlocks at Lv.{chapter.requiredLevel}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{chapter.description}</p>

                  {/* Progress */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {[...Array(3)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${i < Math.floor(chapterStars / chapter.dungeons.length) ? 'star' : 'star-empty'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {chapterStars}/{maxStars} stars
                    </span>
                  </div>

                  {/* Dungeons */}
                  {isUnlocked && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {chapter.dungeons.map((dungeon) => {
                        const result = progress.completedDungeons[dungeon.id];
                        return (
                          <Link
                            key={dungeon.id}
                            href={`/battle?chapter=${chapter.id}&dungeon=${dungeon.id}`}
                            className={`rpg-card px-4 py-2 text-sm hover:border-cyan-500 transition ${
                              result?.completed ? 'border-green-500/50' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span>{dungeon.icon}</span>
                              <span>{dungeon.name}</span>
                              {result && (
                                <div className="flex">
                                  {[...Array(3)].map((_, i) => (
                                    <span
                                      key={i}
                                      className={`text-xs ${i < result.stars ? 'star' : 'star-empty'}`}
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
                        className="rpg-card px-4 py-2 text-sm border-red-500/30 hover:border-red-500 transition"
                      >
                        <div className="flex items-center gap-2 text-red-400">
                          <span>{chapter.boss.icon}</span>
                          <span>BOSS: {chapter.boss.name}</span>
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
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Complete dungeons to earn stars and XP. Defeat bosses to master each chapter!</p>
      </div>
    </div>
  );
}
