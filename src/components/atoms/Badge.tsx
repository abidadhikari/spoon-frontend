type BadgeTone = "blue" | "green" | "orange" | "red" | "zinc";

const toneClass: Record<BadgeTone, string> = {
  blue: "border-sky-200 bg-sky-50 text-sky-700",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  orange: "border-amber-200 bg-amber-50 text-amber-700",
  red: "border-rose-200 bg-rose-50 text-rose-700",
  zinc: "border-zinc-200 bg-zinc-50 text-zinc-700",
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
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClass[tone]}`}
    >
      {children}
    </span>
  );
}
