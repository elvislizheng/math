"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { strands } from "@/data/curriculum";

export default function Sidebar() {
  const pathname = usePathname();
  const [expandedStrands, setExpandedStrands] = useState<string[]>(() => {
    // Auto-expand the strand that matches the current path
    for (const s of strands) {
      if (pathname.includes(`/strand/${s.id}`)) return [s.id];
    }
    return [];
  });

  function toggleStrand(id: string) {
    setExpandedStrands((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  return (
    <aside className="w-64 shrink-0 bg-bg-sidebar border-r border-border-gray overflow-y-auto hidden lg:block">
      <div className="py-4">
        <div className="px-4 pb-2 text-xs font-semibold text-text-muted uppercase tracking-wide">
          Grade 7
        </div>
        <div className="px-4 pb-1 text-sm font-bold text-text-primary">
          Mathematics
        </div>
        <div className="px-4 pb-3 text-xs text-link-blue">
          Mathematics (2020)
        </div>

        <div className="border-t border-border-gray" />

        <Link
          href="/"
          className={`block px-4 py-2 text-sm font-semibold transition-colors ${
            pathname === "/"
              ? "text-link-blue bg-white"
              : "text-text-primary hover:bg-white/60"
          }`}
        >
          Grade home
        </Link>

        <div className="border-t border-border-gray mt-1 pt-1">
          <div className="px-4 py-2 text-xs font-semibold text-text-secondary">
            Expectations by strand
          </div>
        </div>

        {strands.map((strand) => {
          const isExpanded = expandedStrands.includes(strand.id);
          const isActive = pathname.includes(`/strand/${strand.id}`);

          return (
            <div key={strand.id}>
              <button
                onClick={() => toggleStrand(strand.id)}
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${
                  isActive
                    ? "text-link-blue font-semibold"
                    : "text-text-primary hover:bg-white/60"
                }`}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  className={`shrink-0 transition-transform ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                >
                  <path
                    d="M4 2l4 4-4 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                {strand.id}. {strand.name}
              </button>

              {isExpanded && (
                <div className="pl-8">
                  {strand.substrands.map((sub) => {
                    const subPath = `/strand/${strand.id}/${sub.id}`;
                    const isSubActive = pathname === subPath;
                    return (
                      <Link
                        key={sub.id}
                        href={subPath}
                        className={`block px-4 py-1.5 text-sm transition-colors ${
                          isSubActive
                            ? "text-link-blue font-semibold"
                            : "text-link-blue hover:underline"
                        }`}
                      >
                        {sub.id}. {sub.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
