export function Metric({
  label,
  value,
}: Readonly<{
  label: string;
  value: string | number;
}>) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-4">
      <div className="text-2xl font-semibold text-zinc-950">{value}</div>
      <div className="mt-1 text-xs font-medium uppercase tracking-normal text-zinc-500">
        {label}
      </div>
    </div>
  );
}
