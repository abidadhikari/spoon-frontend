import type { MenuItemResponse, SubMenuResponse } from "@/client-services";
import { formatPrice } from "@/lib/format-price";
import { slugify } from "@/lib/slugify";

export type MenuSection = SubMenuResponse & {
  menu_items: MenuItemResponse[];
  anchor: string;
};

export function getVisibleSections(menu: {
  submenus?: SubMenuResponse[] | null;
}): MenuSection[] {
  return (menu.submenus ?? [])
    .filter(
      (section) =>
        section.is_visible !== false &&
        (section.menu_items ?? []).some((item) => item.is_visible !== false),
    )
    .map((section, index) => ({
      ...section,
      menu_items: (section.menu_items ?? []).filter(
        (item) => item.is_visible !== false,
      ),
      anchor: `${slugify(section.title)}-${index}`,
    }));
}

export function getRestaurantName(menu: {
  restaurant?: { name?: string | null } | null;
}) {
  const name = menu.restaurant?.name;
  return name && name !== "string" ? name : "Menu";
}

export function getRestaurantDescription(menu: {
  restaurant?: { description?: string | null } | null;
}) {
  const description = menu.restaurant?.description;
  return description && description !== "string" ? description : null;
}

export function getPriceText(item: MenuItemResponse) {
  return (item.prices ?? [])
    .map((price) => {
      const value = formatPrice(price.price);
      return value ? `${price.label ? `${price.label} ` : ""}${value}` : null;
    })
    .filter(Boolean)
    .join("  ·  ");
}

export function isUnavailable(item: MenuItemResponse) {
  return item.status === "UNAVAILABLE";
}

export function MenuTabs({
  sections,
  className = "",
}: {
  sections: MenuSection[];
  className?: string;
}) {
  return (
    <nav
      className={`flex gap-2 overflow-x-auto ${className}`}
      aria-label="Menu categories"
    >
      {sections.map((section) => (
        <a
          key={section.anchor}
          href={`#${section.anchor}`}
          className="shrink-0 whitespace-nowrap"
        >
          {section.title}
        </a>
      ))}
    </nav>
  );
}

export function EmptyMenu({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={`min-h-screen px-6 py-24 text-center ${dark ? "bg-[#171513] text-stone-300" : "bg-[#f7f5f0] text-stone-500"}`}
    >
      <p className="text-sm">No dishes on the menu yet.</p>
      <p className="mt-2 text-xs opacity-70">Please check back soon.</p>
    </div>
  );
}
