"use client";

import { buildPriceTable, PriceTable } from "@/lib/build-price-table";
import { formatPrice } from "@/lib/format-price";
import { slugify } from "@/lib/slugify";
import { IMenu } from "@/types/menu.type";
import { Submenu } from "@/types/public-menu.type";
import { useMemo, useRef } from "react";

interface ClassicProps {
  menu: IMenu;
}

export default function Classic(props: ClassicProps) {
  const { menu } = props;
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const visibleSubmenus = useMemo(
    () =>
      menu.submenus.filter(
        (sm) =>
          sm.is_visible !== false &&
          sm.menu_items.some((i) => i.is_visible !== false),
      ),
    [menu.submenus],
  );

  const sections = useMemo(
    () =>
      visibleSubmenus.map((submenu, idx) => ({
        id: `${slugify(submenu.title)}-${idx}`,
        submenu,
        table: buildPriceTable(submenu),
      })),
    [visibleSubmenus],
  );

  const restaurantName =
    menu.restaurant?.name && menu.restaurant.name !== "string"
      ? menu.restaurant.name
      : "Menu";
  const restaurantDesc =
    menu.restaurant?.description && menu.restaurant.description !== "string"
      ? menu.restaurant.description
      : undefined;

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (sections.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center italic text-stone-500">
        No dishes on the menu yet — check back soon.
      </div>
    );
  }

  console.log({ visibleSubmenus, sections, menu });

  return (
    <div className="min-h-screen bg-[#F6EFE1] px-4 py-10">
      <div className="mx-auto max-w-[800px] border border-black/10 bg-[#F6EFE1] shadow-2xl shadow-black/20">
        {/* header */}
        <header className="relative overflow-hidden bg-gradient-to-b from-[#7A1F2B] to-[#55131C] px-10 py-11 text-center text-[#F6EFE1]">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D99A1E]">
            Digital Menu
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            {restaurantName}
          </h1>
          {restaurantDesc && (
            <p className="mt-2.5 text-sm italic opacity-85">{restaurantDesc}</p>
          )}
          {menu.qr?.code && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-1.5 font-mono text-xs">
              Table code&nbsp;
              <b className="font-semibold text-[#D99A1E]">{menu.qr.code}</b>
            </div>
          )}
        </header>

        {/* sticky category nav */}
        <nav className="sticky top-0 z-10 flex gap-1.5 overflow-x-auto border-b border-black/10 bg-[#F6EFE1]/95 px-6 py-4 backdrop-blur">
          {sections.map(({ id, submenu }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="flex-none whitespace-nowrap rounded-full border border-transparent px-3.5 py-1.5 font-mono text-xs text-stone-500 transition-colors hover:border-[#D99A1E] hover:text-[#7A1F2B]"
            >
              {submenu.title}
            </button>
          ))}
        </nav>

        <main>
          {sections.map(({ id, submenu, table }) => (
            <MenuSection
              key={id}
              id={id}
              submenu={submenu}
              table={table}
              sectionRef={(el) => (sectionRefs.current[id] = el)}
            />
          ))}
        </main>

        <div className="border-t border-black/10 px-6 py-7 text-center font-mono text-[11px] tracking-wide text-stone-500">
          {restaurantName.toUpperCase()} · SCAN · ORDER · ENJOY
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section — title + grouped price table                             */
/* ------------------------------------------------------------------ */

function MenuSection({
  id,
  submenu,
  table,
  sectionRef,
}: {
  id: string;
  submenu: Submenu;
  table: PriceTable;
  sectionRef: (el: HTMLElement | null) => void;
}) {
  const { columns, rows } = table;
  const gridTemplateColumns = `minmax(0,1fr) repeat(${Math.max(columns.length, 1)}, minmax(56px,auto))`;

  return (
    <section ref={sectionRef} id={id} className="scroll-mt-16 px-10 pt-9">
      <div className="mb-1 flex items-baseline justify-between gap-4">
        <h2 className="font-serif text-2xl font-semibold text-[#55131C]">
          {submenu.title}
        </h2>
        <span className="whitespace-nowrap font-mono text-[11px] text-[#B5790F]">
          {rows.length} item{rows.length === 1 ? "" : "s"}
        </span>
      </div>

      {submenu.description && (
        <p className="mb-5 text-sm italic text-stone-500">
          {submenu.description}
        </p>
      )}

      <div className="mb-6">
        {columns.length > 0 && (
          <div
            className="grid gap-x-4 border-b border-black/15 pb-2"
            style={{ gridTemplateColumns }}
          >
            <span className="invisible" />
            {columns.map((col) => (
              <span
                key={col}
                className="text-right font-mono text-[10.5px] uppercase tracking-wider text-[#B5790F]"
              >
                {col}
              </span>
            ))}
          </div>
        )}

        {rows.map((row, i) => (
          <div
            key={i}
            className="grid items-baseline gap-x-4 gap-y-0.5 border-b border-dashed border-black/10 py-2.5 last:border-none"
            style={{ gridTemplateColumns }}
          >
            <span className="flex min-w-0 items-baseline gap-2">
              <span className="text-[15px] font-medium">{row.name}</span>
              <span className="mb-1 h-0 flex-1 border-b border-dotted border-stone-400/60" />
            </span>

            {columns.length > 0 ? (
              row.cells.map((v, ci) => <PriceCell key={ci} value={v} />)
            ) : (
              <PriceCell value={row.singlePrice} />
            )}

            {row.description && (
              <span className="col-span-full text-xs text-stone-500">
                {row.description}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function PriceCell({ value }: { value: number | null }) {
  const formatted = formatPrice(value);
  if (!formatted) {
    return <span className="text-right text-[15px] text-stone-400/60">—</span>;
  }
  return (
    <span className="text-right font-mono text-[15px] font-semibold">
      <span className="mr-0.5 text-[11px] opacity-70">रू</span>
      {formatted}
    </span>
  );
}
