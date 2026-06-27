type ButtonVariant = "primary" | "secondary";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-zinc-950 text-white shadow-sm shadow-zinc-950/10 hover:bg-zinc-800",
  secondary:
    "border border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: Readonly<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
  }
>) {
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center rounded-md px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variantClass[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
