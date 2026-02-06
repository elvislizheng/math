"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSubstrand } from "@/data/curriculum";
import { getQuestions } from "@/data/questions";
import Breadcrumb from "@/components/Breadcrumb";
import { useProgressContext } from "@/context/ProgressContext";

export default function SubstrandPage({
  params,
}: {
  params: Promise<{ strandId: string; sub: string }>;
}) {
  const { strandId, sub } = use(params);
  const result = getSubstrand(strandId, sub);
  const { getExpectationProgress, loaded } = useProgressContext();
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!result) return notFound();
  const { strand, substrand } = result;

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Elementary curriculum", href: "/" },
          { label: "Mathematics", href: "/" },
          { label: "Grade 7", href: "/" },
          { label: "Expectations by strand", href: `/strand/${strand.id}` },
          { label: `${substrand.id}. ${substrand.name}` },
        ]}
      />

      <h1 className="text-2xl font-bold text-text-primary mb-2">
        {substrand.id}. {substrand.name}
      </h1>

      <hr className="border-teal border-t-2 mb-6" />

      <h2 className="text-xl font-bold text-text-primary mb-2">
        Specific Expectations
      </h2>
      <p className="text-sm text-text-secondary mb-6">
        By the end of Grade 7, students will:
      </p>

      <div className="space-y-6">
        {substrand.expectations.map((exp) => {
          const qCount = getQuestions(exp.code).length;
          const prog = loaded ? getExpectationProgress(exp.code) : undefined;
          const isExpanded = expanded === exp.code;

          return (
            <div
              key={exp.code}
              className="border-b border-border-light pb-6 last:border-b-0"
            >
              <h3 className="text-base font-bold text-text-primary mb-2">
                {exp.title}
              </h3>
              <p className="text-sm text-text-primary leading-relaxed mb-3">
                <span className="font-bold">{exp.code}</span>{" "}
                {exp.description}
              </p>

              {prog && prog.attempted > 0 && (
                <div className="text-xs text-text-muted mb-2">
                  Score: {prog.correct}/{prog.attempted} correct
                </div>
              )}

              <button
                onClick={() => setExpanded(isExpanded ? null : exp.code)}
                className="text-sm text-link-blue hover:underline flex items-center gap-1"
              >
                Practice
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  className={`transition-transform ${
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

              {isExpanded && (
                <div className="mt-3 pl-4 border-l-2 border-border-gray">
                  {qCount > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm text-text-secondary">
                        {qCount} practice question{qCount > 1 ? "s" : ""}{" "}
                        available.
                      </p>
                      <Link
                        href={`/practice/${exp.code}`}
                        className="inline-block bg-teal text-white text-sm font-medium px-4 py-2 rounded hover:bg-teal-hover transition-colors"
                      >
                        Start Practice
                      </Link>
                    </div>
                  ) : (
                    <p className="text-sm text-text-muted italic">
                      Questions coming soon.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
