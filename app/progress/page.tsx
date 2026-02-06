"use client";

import { useState } from "react";
import { strands } from "@/data/curriculum";
import { useProgressContext } from "@/context/ProgressContext";
import Breadcrumb from "@/components/Breadcrumb";
import ProgressBar from "@/components/ProgressBar";

export default function ProgressPage() {
  const { progress, loaded, resetProgress } = useProgressContext();
  const [showReset, setShowReset] = useState(false);
  const [expandedStrand, setExpandedStrand] = useState<string | null>(null);

  const allEntries = Object.values(progress);
  const totalAttempted = allEntries.reduce((s, e) => s + e.attempted, 0);
  const totalCorrect = allEntries.reduce((s, e) => s + e.correct, 0);
  const accuracy =
    totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  const totalExpectations = strands.reduce(
    (acc, s) =>
      acc + s.substrands.reduce((a, sub) => a + sub.expectations.length, 0),
    0
  );
  const practiced = allEntries.filter((e) => e.attempted > 0).length;

  return (
    <>
      <Breadcrumb items={[{ label: "Progress" }]} />

      <h1 className="text-2xl font-bold text-text-primary mb-6">
        Progress Dashboard
      </h1>

      {!loaded ? (
        <p className="text-text-muted">Loading...</p>
      ) : totalAttempted === 0 ? (
        <div className="text-center py-12 text-text-muted">
          <p className="text-lg mb-2">No progress yet.</p>
          <p className="text-sm">
            Start practicing to see your results here.
          </p>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-bg-white border border-border-gray rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-teal">
                {totalAttempted}
              </div>
              <div className="text-xs text-text-muted">Questions Answered</div>
            </div>
            <div className="bg-bg-white border border-border-gray rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-success">
                {totalCorrect}
              </div>
              <div className="text-xs text-text-muted">Correct</div>
            </div>
            <div className="bg-bg-white border border-border-gray rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-text-primary">
                {accuracy}%
              </div>
              <div className="text-xs text-text-muted">Accuracy</div>
            </div>
            <div className="bg-bg-white border border-border-gray rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-link-blue">
                {practiced}/{totalExpectations}
              </div>
              <div className="text-xs text-text-muted">
                Expectations Practiced
              </div>
            </div>
          </div>

          {/* Strand breakdown */}
          <h2 className="text-lg font-bold text-text-primary mb-4">
            By Strand
          </h2>

          <div className="space-y-3 mb-8">
            {strands.map((strand) => {
              const exps = strand.substrands.flatMap((s) => s.expectations);
              const strandAttempted = exps.filter(
                (e) => progress[e.code]?.attempted > 0
              ).length;
              const strandCorrect = exps.reduce(
                (s, e) => s + (progress[e.code]?.correct || 0),
                0
              );
              const strandTotal = exps.reduce(
                (s, e) => s + (progress[e.code]?.attempted || 0),
                0
              );
              const strandAccuracy =
                strandTotal > 0
                  ? Math.round((strandCorrect / strandTotal) * 100)
                  : 0;
              const isExpanded = expandedStrand === strand.id;

              if (strandAttempted === 0) return null;

              return (
                <div
                  key={strand.id}
                  className="bg-bg-white border border-border-gray rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedStrand(isExpanded ? null : strand.id)
                    }
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-bg-gray/50 transition-colors"
                  >
                    <div>
                      <span className="font-bold text-text-primary">
                        {strand.id}. {strand.name}
                      </span>
                      <span className="text-sm text-text-muted ml-3">
                        {strandAttempted}/{exps.length} expectations &middot;{" "}
                        {strandAccuracy}% accuracy
                      </span>
                    </div>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      className={`shrink-0 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    >
                      <path
                        d="M3 5l3 3 3-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </button>

                  <ProgressBar
                    value={strandAttempted}
                    max={exps.length}
                    className="px-4 pb-3"
                  />

                  {isExpanded && (
                    <div className="border-t border-border-light px-4 py-3 space-y-2">
                      {exps.map((exp) => {
                        const p = progress[exp.code];
                        if (!p || p.attempted === 0) return null;
                        return (
                          <div
                            key={exp.code}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-text-primary">
                              <span className="font-semibold">{exp.code}</span>{" "}
                              {exp.title}
                            </span>
                            <span className="text-text-muted whitespace-nowrap">
                              {p.correct}/{p.attempted} correct
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Reset */}
          <div className="border-t border-border-gray pt-6">
            {!showReset ? (
              <button
                onClick={() => setShowReset(true)}
                className="text-sm text-error hover:underline"
              >
                Reset all progress
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-text-primary">
                  Are you sure? This cannot be undone.
                </span>
                <button
                  onClick={() => {
                    resetProgress();
                    setShowReset(false);
                  }}
                  className="text-sm bg-error text-white px-3 py-1 rounded hover:opacity-90"
                >
                  Yes, reset
                </button>
                <button
                  onClick={() => setShowReset(false)}
                  className="text-sm text-text-muted hover:underline"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
