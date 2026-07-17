export const dragTypes = {
  submenu: "submenu",
  menuItem: "menu-item",
} as const;

export type SubmenuDragData = {
  type: typeof dragTypes.submenu;
  submenuId: string;
};

export type MenuItemDragData = {
  type: typeof dragTypes.menuItem;
  itemId: string;
  submenuId: string;
};

export type DragData = SubmenuDragData | MenuItemDragData;

export function isSubmenuDragData(data: Record<string, unknown>): data is SubmenuDragData {
  return data.type === dragTypes.submenu && typeof data.submenuId === "string";
}

export function isMenuItemDragData(data: Record<string, unknown>): data is MenuItemDragData {
  return (
    data.type === dragTypes.menuItem &&
    typeof data.itemId === "string" &&
    typeof data.submenuId === "string"
  );
}
