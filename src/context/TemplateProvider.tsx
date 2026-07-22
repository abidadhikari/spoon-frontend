"use client";

import {
  getDefaultTemplate,
  menuTemplates,
} from "@/components/menu-templates/registry";
import { createContext, useContext, ReactNode } from "react";

type TemplateContextType = {
  name: string;
  template: React.ComponentType<any>;
  thumbnail: string;
};

const TemplateContext = createContext<TemplateContextType | null>(null);

interface TemplateProviderProps {
  templateId: (typeof menuTemplates)[number]["id"];
  children: ReactNode;
}

export function TemplateProvider({
  templateId,
  children,
}: TemplateProviderProps) {
  let selectedTemplate = menuTemplates.find((t) => t.id === templateId);

  if (!selectedTemplate) {
    console.error(`Template with id "${templateId}" not found.`);
    console.log("Switching to default template.");
    selectedTemplate = getDefaultTemplate();
  }

  return (
    <TemplateContext.Provider value={selectedTemplate}>
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
