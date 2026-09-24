type BadgeTone = "blue" | "green" | "orange" | "red" | "zinc" | "brand";

const toneClass: Record<BadgeTone, string> = {
  blue: "border-[#93b7be]/40 bg-[#93b7be]/10 text-[#2d3047]", // Light Blue
  green: "border-accent/40 bg-accent/10 text-accent", // Dark Cyan for success/active
  orange: "border-brand/40 bg-brand/20 text-brand-foreground shadow-xs", // Golden Glow for warning/unverified
  red: "border-destructive/20 bg-destructive/10 text-destructive",
  zinc: "border-border bg-muted/50 text-muted-foreground",
  brand: "border-brand/40 bg-brand/20 text-brand-foreground shadow-xs",
};

export function Badge({
  children,
  tone = "zinc",
}: Readonly<{
  children: React.ReactNode;
  tone?: BadgeTone;
}>) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${toneClass[tone]}`}
    >
      {children}
    </span>
  );
}
