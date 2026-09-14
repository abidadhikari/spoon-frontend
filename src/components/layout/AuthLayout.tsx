import React from "react";
import Link from "next/link";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex">
      {/* Brand panel — visible on md+ */}
      <div className="hidden md:flex md:w-[420px] lg:w-[480px] shrink-0 flex-col justify-between p-10 bg-[oklch(0.98_0.01_85)] border-r border-border">
        <div className="flex flex-col gap-2">
          {/* Logo mark */}
          <Link href="/" aria-label="Spoon home">
            <div className="flex items-center gap-2.5">
              <div
                className="flex size-8 items-center justify-center rounded-lg text-[var(--brand-foreground)] font-bold text-sm"
                style={{ background: "var(--brand)" }}
                aria-hidden="true"
              >
                S
              </div>
              <span className="text-base font-semibold tracking-tight text-foreground">
                Spoon
              </span>
            </div>
          </Link>
        </div>

        {/* Tagline block */}
        <div className="flex flex-col gap-3">
          <p className="text-[2rem] font-semibold leading-snug tracking-tight text-foreground">
            Your restaurant,
            <br />
            beautifully managed.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-[300px]">
            Build menus, manage your team, and share your brand — all from one
            simple dashboard.
          </p>
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Spoon. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-8 bg-background">
        {/* Mobile logo */}
        <div className="flex md:hidden mb-8 self-start">
          <Link href="/" aria-label="Spoon home">
            <div className="flex items-center gap-2">
              <div
                className="flex size-7 items-center justify-center rounded-md font-bold text-xs"
                style={{
                  background: "var(--brand)",
                  color: "var(--brand-foreground)",
                }}
                aria-hidden="true"
              >
                S
              </div>
              <span className="text-sm font-semibold text-foreground">
                Spoon
              </span>
            </div>
          </Link>
        </div>

        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
