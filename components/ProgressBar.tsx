export default function ProgressBar({
  value,
  max,
  className = "",
}: {
  value: number;
  max: number;
  className?: string;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-2 bg-border-gray rounded-full overflow-hidden">
        <div
          className="h-full bg-teal rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-text-muted whitespace-nowrap">
        {pct}%
      </span>
    </div>
  );
}
