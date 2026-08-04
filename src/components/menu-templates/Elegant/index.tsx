import MenuItemCard from "@/components/menu-templates/Elegant/MenuItemCard";
import { IMenu, IMenuItem } from "@/types/menu.type";
import React from "react";

interface ElegantProps {
  menu: IMenu;
}

export default function Elegant(props: ElegantProps) {
  const { menu } = props;
  return (
    <div>
      {/* <pre>{JSON.stringify(menu, null, 2)}</pre> */}
      <h1>ELEGANT </h1>
      {menu?.submenus?.map((submenu) => (
        <div key={submenu.id} className="border border-gray-300 p-4 my-4">
          <h2>{submenu.title}</h2>
          <p>{submenu.description}</p>
          <div>
            {submenu.menu_items?.map((item: IMenuItem) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
