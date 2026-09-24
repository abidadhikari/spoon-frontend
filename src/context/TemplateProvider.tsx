"use client";

import { getMenuTemplateRenderer } from "@/components/menu-templates/registry";
import { createContext, useContext, ReactNode, ComponentType } from "react";
import type { MenuTemplateProps } from "@/components/menu-templates/types";

type TemplateContextType = {
  template: ComponentType<MenuTemplateProps>;
};

const TemplateContext = createContext<TemplateContextType | null>(null);

interface TemplateProviderProps {
  templateId?: string;
  children: ReactNode;
}

export function TemplateProvider({
  templateId,
  children,
}: TemplateProviderProps) {
  const Template = getMenuTemplateRenderer(templateId);

  return (
    <TemplateContext.Provider
      value={{
        template: Template,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplate() {
  const context = useContext(TemplateContext);

  if (!context) {
    throw new Error("useTemplate must be used inside TemplateProvider");
  }

  return context;
}
