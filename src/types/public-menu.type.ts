export interface Price {
  label: string;
  price: number;
}

export interface MenuItem {
  id?: string;
  name: string;
  description?: string | null;
  pricing_type?: "FIXED" | "VARIABLE" | string | null;
  is_visible?: boolean;
  prices?: Price[];
}

export interface Submenu {
  id?: string;
  title: string;
  description?: string | null;
  is_visible?: boolean | null;
  menu_items: MenuItem[];
}
