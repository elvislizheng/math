"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStrand } from "@/data/curriculum";
import Breadcrumb from "@/components/Breadcrumb";
import { useProgressContext } from "@/context/ProgressContext";
import ProgressBar from "@/components/ProgressBar";

export default function StrandPage({
  params,
}: {
  params: Promise<{ strandId: string }>;
}) {
  const { strandId } = use(params);
  const strand = getStrand(strandId);
  const { progress, loaded } = useProgressContext();

  if (!strand) return notFound();

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Elementary curriculum", href: "/" },
          { label: "Mathematics", href: "/" },
          { label: "Grade 7", href: "/" },
          { label: `Strand ${strand.id}: ${strand.name}` },
        ]}
      />

      <h1 className="text-2xl font-bold text-text-primary mb-2">
        {strand.id}. {strand.name}
      </h1>

      <hr className="border-teal border-t-2 mb-4" />

      <p className="text-text-secondary mb-6">{strand.description}</p>

      <div className="space-y-4">
        {strand.substrands.map((sub) => {
          const practiced = sub.expectations.filter(
            (e) => progress[e.code]?.attempted > 0
          ).length;

          return (
            <Link
              key={sub.id}
              href={`/strand/${strand.id}/${sub.id}`}
              className="block bg-bg-white border border-border-gray rounded-md p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-lg font-bold text-text-primary">
                  {sub.id}.
                </span>
                <span className="text-lg font-bold text-text-primary">
                  {sub.name}
                </span>
              </div>
              <p className="text-sm text-text-muted mb-3">
                {sub.expectations.length} specific expectation
                {sub.expectations.length > 1 ? "s" : ""}
              </p>
              {loaded && practiced > 0 && (
                <ProgressBar value={practiced} max={sub.expectations.length} />
              )}
            </Link>
          );
        })}
      </div>
    </>
  );
}
