import type { MenuTemplateProps } from "@/components/menu-templates/types";
import { EmptyMenu, getPriceText, getRestaurantDescription, getRestaurantName, getVisibleSections, isUnavailable, MenuTabs } from "@/components/menu-templates/shared";

export default function Compact({ menu }: MenuTemplateProps) {
  const sections = getVisibleSections(menu);
  if (!sections.length) return <EmptyMenu />;
  const name = getRestaurantName(menu);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="mx-auto max-w-6xl px-4 pb-6 pt-8 sm:px-8 sm:pt-10">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-slate-900 pb-4"><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{name}</h1><span className="text-xs font-medium uppercase tracking-wider text-slate-500">{menu.name}</span></div>
        {getRestaurantDescription(menu) && <p className="mt-3 max-w-2xl text-sm text-slate-500">{getRestaurantDescription(menu)}</p>}
      </header>
      <MenuTabs sections={sections} className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500 sm:px-8" />
      <main className="mx-auto max-w-6xl px-4 py-7 sm:px-8 sm:py-10">
        <div className="grid gap-10 md:grid-cols-2 md:gap-x-12 md:gap-y-12">
          {sections.map((section) => (
            <section key={section.anchor} id={section.anchor} className="scroll-mt-14">
              <div className="mb-3 flex items-center justify-between border-b border-slate-900 pb-2"><h2 className="text-lg font-bold">{section.title}</h2><span className="text-xs text-slate-400">{section.menu_items.length}</span></div>
              <div className="divide-y divide-slate-100">
                {section.menu_items.map((item) => {
                  const unavailable = isUnavailable(item);
                  return <article key={item.id} className={`grid grid-cols-[1fr_auto] gap-x-4 py-3 ${unavailable ? "opacity-40" : ""}`}><div><h3 className="text-sm font-semibold">{item.name}</h3>{item.description && <p className="mt-0.5 text-xs leading-5 text-slate-500">{item.description}</p>}</div><span className="text-right font-mono text-xs font-semibold text-slate-700">{getPriceText(item) || "—"}</span></article>;
                })}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
