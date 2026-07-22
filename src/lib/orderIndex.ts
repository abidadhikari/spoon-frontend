import type { MenuItem, Submenu } from "@/types/menu.type";

export function withSubmenuOrderIndexes(submenus: Submenu[]): Submenu[] {
  return submenus.map((submenu, orderIndex) => ({ ...submenu, orderIndex }));
}

export function withMenuItemOrderIndexes(items: MenuItem[]): MenuItem[] {
  return items.map((item, orderIndex) => ({ ...item, orderIndex }));
}
