import Link from "next/link";

type Crumb = {
  label: string;
  href?: string;
};

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-text-muted py-3 flex-wrap">
      <Link href="/" className="text-link-blue hover:underline">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="inline-block"
        >
          <path d="M8 1.5l-6.5 5.5v7.5h4.5v-4h4v4h4.5v-7.5z" />
        </svg>
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <svg width="8" height="8" viewBox="0 0 8 8">
            <path
              d="M2 1l4 3-4 3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          {item.href ? (
            <Link href={item.href} className="text-link-blue hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="text-text-primary font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
