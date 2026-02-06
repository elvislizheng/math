"use client";

import Link from "next/link";
import { strands } from "@/data/curriculum";
import { useProgressContext } from "@/context/ProgressContext";
import ProgressBar from "@/components/ProgressBar";

const strandColors: Record<string, string> = {
  B: "border-l-teal",
  C: "border-l-link-blue",
  D: "border-l-[#8b5cf6]",
  E: "border-l-[#d97706]",
  F: "border-l-[#059669]",
};

export default function HomePage() {
  const { progress, loaded } = useProgressContext();

  function getStrandProgress(strandId: string) {
    const strand = strands.find((s) => s.id === strandId);
    if (!strand) return { correct: 0, attempted: 0, total: 0 };
    let correct = 0;
    let attempted = 0;
    let total = 0;
    for (const sub of strand.substrands) {
      for (const exp of sub.expectations) {
        total++;
        const p = progress[exp.code];
        if (p) {
          attempted++;
          if (p.correct > 0) correct++;
        }
      }
    }
    return { correct, attempted, total };
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-text-primary mb-1">
        Grade 7 Mathematics
      </h1>
      <p className="text-sm text-text-secondary mb-6">
        Ontario Curriculum (2020) — Select a strand to explore expectations and
        practice questions.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {strands.map((strand) => {
          const sp = getStrandProgress(strand.id);
          const expectationCount = strand.substrands.reduce(
            (acc, s) => acc + s.expectations.length,
            0
          );
          return (
            <Link
              key={strand.id}
              href={`/strand/${strand.id}`}
              className={`block bg-bg-white border border-border-gray border-l-4 ${
                strandColors[strand.id] || "border-l-teal"
              } rounded-md p-5 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-lg font-bold text-text-primary">
                  {strand.id}.
                </span>
                <span className="text-lg font-bold text-text-primary">
                  {strand.name}
                </span>
              </div>
              <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                {strand.description}
              </p>
              <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                <span>
                  {strand.substrands.length} substrand
                  {strand.substrands.length > 1 ? "s" : ""} &middot;{" "}
                  {expectationCount} expectations
                </span>
                {loaded && sp.attempted > 0 && (
                  <span>
                    {sp.attempted}/{sp.total} practiced
                  </span>
                )}
              </div>
              {loaded && sp.attempted > 0 && (
                <ProgressBar value={sp.attempted} max={sp.total} />
              )}
            </Link>
          );
        })}
      </div>
    </>
  );
}
