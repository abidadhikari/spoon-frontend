import Classic from "@/components/menu-templates/Classic";
import Compact from "@/components/menu-templates/Compact";
import Cafe from "@/components/menu-templates/Cafe";
import Dark from "@/components/menu-templates/Dark";
import Modern from "@/components/menu-templates/Modern";
import StreetFood from "@/components/menu-templates/StreetFood";
import { DEFAULT_MENU_TEMPLATE_ID } from "@/constants/menu-template";
import type { MenuTemplateProps } from "@/components/menu-templates/types";
import type { ComponentType } from "react";

export const MENU_TEMPLATE_RENDERERS: Record<
  string,
  ComponentType<MenuTemplateProps>
> = {
  classic: Classic,
  modern: Modern,
  cafe: Cafe,
  "street-food": StreetFood,
  dark: Dark,
  compact: Compact,
};

export const getMenuTemplateRenderer = (templateId?: string) =>
  MENU_TEMPLATE_RENDERERS[templateId ?? DEFAULT_MENU_TEMPLATE_ID] ??
  MENU_TEMPLATE_RENDERERS[DEFAULT_MENU_TEMPLATE_ID];
