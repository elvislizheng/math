import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-navy text-white">
      <div className="px-6 py-3 flex items-center gap-3">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="shrink-0"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
        <Link href="/" className="text-lg font-bold hover:opacity-90">
          Ontario Grade 7 Mathematics
        </Link>
      </div>
    </header>
  );
}
