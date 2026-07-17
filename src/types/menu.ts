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
