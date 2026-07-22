import type { Menu } from "@/types/menu.type";

export const sampleMenu: Menu = {
  id: "menu-brunch",
  name: "Weekend Brunch",
  submenus: [
    {
      id: "submenu-favourites",
      name: "House Favourites",
      orderIndex: 0,
      items: [
        { id: "item-avocado-toast", name: "Smashed Avocado Toast", orderIndex: 0 },
        { id: "item-french-toast", name: "Brioche French Toast", orderIndex: 1 },
        { id: "item-eggs-benedict", name: "Eggs Benedict", orderIndex: 2 },
      ],
    },
    {
      id: "submenu-sides",
      name: "Sides & Extras",
      orderIndex: 1,
      items: [
        { id: "item-hash-browns", name: "Crispy Hash Browns", orderIndex: 0 },
        { id: "item-bacon", name: "Maple-glazed Bacon", orderIndex: 1 },
        { id: "item-fruit", name: "Seasonal Fruit Bowl", orderIndex: 2 },
      ],
    },
    {
      id: "submenu-drinks",
      name: "Coffee & Drinks",
      orderIndex: 2,
      items: [
        { id: "item-latte", name: "Oat Milk Latte", orderIndex: 0 },
        { id: "item-mimosa", name: "Fresh Orange Mimosa", orderIndex: 1 },
      ],
    },
  ],
};
