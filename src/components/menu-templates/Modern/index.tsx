import type { MenuTemplateProps } from "@/components/menu-templates/types";
import {
  EmptyMenu,
  getPriceText,
  getRestaurantDescription,
  getRestaurantName,
  getVisibleSections,
  isUnavailable,
  MenuTabs,
} from "@/components/menu-templates/shared";

export default function Modern({ menu }: MenuTemplateProps) {
  const sections = getVisibleSections(menu);
  const restaurantName = getRestaurantName(menu);
  const description = getRestaurantDescription(menu);

  if (!sections.length) return <EmptyMenu />;

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#202321]">
      <header className="mx-auto max-w-5xl px-5 pb-8 pt-12 sm:px-8 sm:pt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8b5e34]">
          {menu.name}
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
          {restaurantName}
        </h1>
        {description && <p className="mt-4 max-w-xl text-base leading-7 text-stone-600">{description}</p>}
        <div className="mt-8 flex items-center gap-3 text-xs text-stone-500">
          <span>{sections.reduce((count, section) => count + section.menu_items.length, 0)} dishes</span>
          {menu.qr?.code && <><span aria-hidden="true">/</span><span className="font-mono">{menu.qr.code}</span></>}
        </div>
      </header>
      <MenuTabs sections={sections} className="sticky top-0 z-10 border-y border-stone-200/80 bg-[#f7f5f0]/95 px-5 py-3 text-sm text-stone-500 backdrop-blur sm:px-8" />
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-16">
          {sections.map((section) => (
            <section key={section.anchor} id={section.anchor} className="scroll-mt-16">
              <div className="mb-5 flex items-end justify-between gap-4 border-b border-stone-300 pb-3">
                <div>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em]">{section.title}</h2>
                  {section.description && <p className="mt-1 text-sm text-stone-500">{section.description}</p>}
                </div>
                <span className="text-xs text-stone-400">{section.menu_items.length}</span>
              </div>
              <div className="space-y-5">
                {section.menu_items.map((item) => {
                  const unavailable = isUnavailable(item);
                  return (
                    <article key={item.id} className={unavailable ? "opacity-45" : ""}>
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-medium leading-6">{item.name}</h3>
                        <span className="shrink-0 font-mono text-sm font-semibold text-[#8b5e34]">{getPriceText(item) || "—"}</span>
                      </div>
                      {item.description && <p className="mt-1.5 max-w-prose text-sm leading-6 text-stone-500">{item.description}</p>}
                      {unavailable && <span className="mt-2 inline-block text-[10px] font-semibold uppercase tracking-wider text-stone-500">Unavailable</span>}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
