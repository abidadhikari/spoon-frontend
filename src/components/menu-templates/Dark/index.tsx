import type { MenuTemplateProps } from "@/components/menu-templates/types";
import { EmptyMenu, getPriceText, getRestaurantDescription, getRestaurantName, getVisibleSections, isUnavailable, MenuTabs } from "@/components/menu-templates/shared";

export default function Dark({ menu }: MenuTemplateProps) {
  const sections = getVisibleSections(menu);
  if (!sections.length) return <EmptyMenu dark />;
  const name = getRestaurantName(menu);

  return (
    <div className="min-h-screen bg-[#171513] text-[#f4eee5]">
      <header className="mx-auto max-w-4xl px-5 pb-10 pt-12 sm:px-10 sm:pt-16">
        <p className="text-xs uppercase tracking-[0.32em] text-[#d4a76a]">{menu.name}</p>
        <h1 className="mt-4 font-serif text-5xl leading-none sm:text-7xl">{name}</h1>
        {getRestaurantDescription(menu) && <p className="mt-5 max-w-lg text-sm leading-7 text-stone-400">{getRestaurantDescription(menu)}</p>}
      </header>
      <MenuTabs sections={sections} className="sticky top-0 z-10 border-y border-white/10 bg-[#171513]/95 px-5 py-4 text-sm text-stone-400 backdrop-blur sm:px-10" />
      <main className="mx-auto max-w-4xl px-5 py-10 sm:px-10 sm:py-14">
        {sections.map((section) => (
          <section key={section.anchor} id={section.anchor} className="scroll-mt-16 mb-16">
            <div className="mb-7 flex items-center gap-4"><span className="h-px w-8 bg-[#d4a76a]" /><h2 className="font-serif text-3xl text-[#d4a76a]">{section.title}</h2></div>
            {section.description && <p className="mb-6 text-sm text-stone-500">{section.description}</p>}
            <div className="divide-y divide-white/10">
              {section.menu_items.map((item) => {
                const unavailable = isUnavailable(item);
                return <article key={item.id} className={`flex items-start justify-between gap-6 py-5 first:pt-0 ${unavailable ? "opacity-40" : ""}`}>
                  <div><h3 className="font-medium">{item.name}</h3>{item.description && <p className="mt-1.5 max-w-xl text-sm leading-6 text-stone-500">{item.description}</p>}{unavailable && <p className="mt-2 text-[10px] uppercase tracking-wider text-stone-500">Unavailable</p>}</div>
                  <span className="shrink-0 font-mono text-sm text-[#d4a76a]">{getPriceText(item) || "—"}</span>
                </article>;
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
