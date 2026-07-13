export interface Price {
  label: string;
  price: number;
}

export interface MenuItem {
  id?: string;
  name: string;
  description?: string;
  pricing_type: "FIXED" | "VARIABLE";
  is_visible?: boolean;
  prices: Price[];
}

export interface Submenu {
  id?: string;
  title: string;
  description?: string;
  is_visible?: boolean;
  menu_items: MenuItem[];
}
