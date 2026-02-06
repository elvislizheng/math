"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { strands } from "@/data/curriculum";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const [expandedStrands, setExpandedStrands] = useState<string[]>([]);
  const pathname = usePathname();

  function toggleStrand(id: string) {
    setExpandedStrands((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-40 bg-teal text-white p-3 rounded-full shadow-lg"
        aria-label="Open navigation"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-bg-sidebar z-50 overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-border-gray">
              <span className="font-bold text-sm">Navigation</span>
              <button onClick={() => setOpen(false)} className="p-1">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 5l10 10M15 5l-10 10" />
                </svg>
              </button>
            </div>

            <Link
              href="/"
              onClick={() => setOpen(false)}
              className={`block px-4 py-2 text-sm font-semibold ${
                pathname === "/" ? "text-link-blue" : "text-text-primary"
              }`}
            >
              Grade home
            </Link>

            <div className="px-4 py-2 text-xs font-semibold text-text-secondary">
              Expectations by strand
            </div>

            {strands.map((strand) => {
              const isExpanded = expandedStrands.includes(strand.id);
              return (
                <div key={strand.id}>
                  <button
                    onClick={() => toggleStrand(strand.id)}
                    className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 text-text-primary"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      className={`shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                    >
                      <path d="M4 2l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    {strand.id}. {strand.name}
                  </button>
                  {isExpanded && (
                    <div className="pl-8">
                      {strand.substrands.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/strand/${strand.id}/${sub.id}`}
                          onClick={() => setOpen(false)}
                          className="block px-4 py-1.5 text-sm text-link-blue hover:underline"
                        >
                          {sub.id}. {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
