"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Curriculum" },
  { href: "/progress", label: "Progress" },
];

export default function SecondaryNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-dark-blue text-white px-6 py-2 flex gap-6 text-sm">
      {links.map((link) => {
        const isActive =
          link.href === "/"
            ? pathname === "/" || pathname.startsWith("/strand")
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`py-1 border-b-2 transition-colors ${
              isActive
                ? "border-white font-semibold"
                : "border-transparent hover:border-white/50"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
