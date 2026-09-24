import { cn } from "@/lib/utils";

export function Metric({
  label,
  value,
  className,
}: Readonly<{
  label: string;
  value: string | number;
  className?: string;
}>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-card p-5 shadow-xs transition-colors hover:border-accent/30",
        className,
      )}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand" />
      <div className="flex flex-col gap-1.5">
        <div className="text-3xl font-semibold tracking-tight text-foreground">
          {value}
        </div>
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
      </div>
    </div>
  );
}
