import type { MenuTemplateProps } from "@/components/menu-templates/types";
import { EmptyMenu, getPriceText, getRestaurantDescription, getRestaurantName, getVisibleSections, isUnavailable, MenuTabs } from "@/components/menu-templates/shared";

export default function StreetFood({ menu }: MenuTemplateProps) {
  const sections = getVisibleSections(menu);
  if (!sections.length) return <EmptyMenu />;
  const name = getRestaurantName(menu);

  return (
    <div className="min-h-screen bg-[#f1ede4] text-[#171717]">
      <header className="bg-[#e83f2f] px-5 py-9 text-[#fff8eb] sm:px-10 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-black uppercase tracking-[0.3em]">{menu.name}</p>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
            <h1 className="max-w-3xl text-5xl font-black uppercase leading-[0.88] tracking-[-0.07em] sm:text-7xl">{name}</h1>
            {menu.qr?.code && <span className="border-2 border-[#fff8eb] px-3 py-2 font-mono text-xs font-bold">#{menu.qr.code}</span>}
          </div>
          {getRestaurantDescription(menu) && <p className="mt-5 max-w-md text-sm font-medium">{getRestaurantDescription(menu)}</p>}
        </div>
      </header>
      <MenuTabs sections={sections} className="sticky top-0 z-10 border-b-4 border-[#171717] bg-[#f1ede4] px-5 py-3 text-xs font-black uppercase tracking-wider sm:px-10" />
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-10 sm:py-12">
        {sections.map((section) => (
          <section key={section.anchor} id={section.anchor} className="scroll-mt-16 mb-12">
            <div className="mb-5 flex items-center gap-4"><h2 className="bg-[#171717] px-3 py-2 text-2xl font-black uppercase text-[#f7d447]">{section.title}</h2><span className="h-1 flex-1 bg-[#171717]" /></div>
            {section.description && <p className="mb-5 max-w-xl text-sm font-medium text-stone-600">{section.description}</p>}
            <div className="grid gap-3 md:grid-cols-2">
              {section.menu_items.map((item) => {
                const unavailable = isUnavailable(item);
                return <article key={item.id} className={`border-2 border-[#171717] bg-[#fff8eb] p-4 ${unavailable ? "opacity-45" : ""}`}>
                  <div className="flex items-start justify-between gap-3"><h3 className="text-lg font-black uppercase leading-tight">{item.name}</h3><span className="shrink-0 bg-[#f7d447] px-2 py-1 font-mono text-sm font-black">{getPriceText(item) || "—"}</span></div>
                  {item.description && <p className="mt-2 text-sm leading-5 text-stone-600">{item.description}</p>}
                  {unavailable && <p className="mt-2 text-[10px] font-black uppercase">Unavailable</p>}
                </article>;
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
