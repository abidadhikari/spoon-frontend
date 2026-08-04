import {
  MenuItemResponse,
  MenuResponsePublic,
  SubMenuResponse,
} from "@/client-services/types.gen";

export type MenuItem = {
  id: string;
  name: string;
  orderIndex: number;
};

export type Submenu = {
  id: string;
  name: string;
  orderIndex: number;
  items: MenuItem[];
};

export type Menu = {
  id: string;
  name: string;
  submenus: Submenu[];
};

export type IMenu = MenuResponsePublic;
export type ISubmenu = SubMenuResponse;
export type IMenuItem = MenuItemResponse;
