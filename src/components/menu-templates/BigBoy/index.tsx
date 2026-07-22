import { IMenu } from "@/types/menu.type";
import React from "react";

interface BigBoyProps {
  menu: IMenu;
}

export default function BigBoy(props: BigBoyProps) {
  const { menu } = props;
  return (
    <div>
      {/* <pre>{JSON.stringify(menu, null, 2)}</pre> */}

      {menu?.submenus?.map((submenu) => (
        <div key={submenu.id}>
          <h2>{submenu.title}</h2>
          <p>{submenu.description}</p>
        </div>
      ))}
    </div>
  );
}
