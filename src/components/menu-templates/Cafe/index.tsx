import type { MenuTemplateProps } from "@/components/menu-templates/types";
import { EmptyMenu, getPriceText, getRestaurantDescription, getRestaurantName, getVisibleSections, isUnavailable, MenuTabs } from "@/components/menu-templates/shared";

export default function Cafe({ menu }: MenuTemplateProps) {
  const sections = getVisibleSections(menu);
  if (!sections.length) return <EmptyMenu />;
  const name = getRestaurantName(menu);
  const description = getRestaurantDescription(menu);

  return (
    <div className="min-h-screen bg-[#fff9f0] text-[#49372c]">
      <header className="mx-auto max-w-3xl px-5 pb-7 pt-10 text-center sm:pt-14">
        <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full border border-[#d9a56c] text-xl" aria-hidden="true">✦</div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b56d3b]">{menu.name}</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">{name}</h1>
        {description && <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#806858]">{description}</p>}
      </header>
      <MenuTabs sections={sections} className="sticky top-0 z-10 border-y border-[#ead7bd] bg-[#fff9f0]/95 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#a56b43] backdrop-blur" />
      <main className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
        {sections.map((section) => (
          <section key={section.anchor} id={section.anchor} className="scroll-mt-16 border-b border-[#ead7bd] py-8 first:pt-0 last:border-0">
            <h2 className="font-serif text-3xl font-semibold text-[#70462f]">{section.title}</h2>
            {section.description && <p className="mt-2 text-sm italic text-[#967965]">{section.description}</p>}
            <div className="mt-6 space-y-5">
              {section.menu_items.map((item) => {
                const unavailable = isUnavailable(item);
                return <article key={item.id} className={`rounded-2xl bg-white/70 p-4 ring-1 ring-[#ead7bd]/70 ${unavailable ? "opacity-45" : ""}`}>
                  <div className="flex items-start justify-between gap-4"><h3 className="font-semibold">{item.name}</h3><span className="shrink-0 rounded-full bg-[#f4e4cd] px-2.5 py-1 font-mono text-xs font-semibold text-[#9b5f38]">{getPriceText(item) || "—"}</span></div>
                  {item.description && <p className="mt-2 text-sm leading-6 text-[#806858]">{item.description}</p>}
                  {unavailable && <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-[#a56b43]">Unavailable</p>}
                </article>;
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
