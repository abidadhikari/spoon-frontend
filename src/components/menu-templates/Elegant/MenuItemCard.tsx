import { IMenuItem } from "@/types/menu.type";
import React from "react";

type MenuItemCardProps = {
  item: IMenuItem;
};

export default function MenuItemCard({ item }: MenuItemCardProps) {
  return <div className="bg-red-400 my-2">{item.name}</div>;
}
