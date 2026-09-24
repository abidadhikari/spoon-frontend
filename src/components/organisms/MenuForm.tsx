"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import FormInputItem from "@/components/molecules/FormInputItem";
import FormCheckboxItem from "@/components/molecules/FormCheckboxItem";
import FormTextareaItem from "@/components/molecules/FormTextareaItem";
import { Label } from "@/components/ui/label";
import { DEFAULT_MENU_TEMPLATE_ID } from "@/constants/menu-template";
import { useGetAllMenuTemplates } from "@/hooks/services/menu-templates/useGetAllMenuTemplates";
import { Check, ImageOff } from "lucide-react";

const menuSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().optional(),
  is_visible: z.boolean(),
  template_id: z.string().min(1, "Template is required"),
});

export type MenuFormValues = z.infer<typeof menuSchema>;

type Props = {
  defaultValues?: Partial<MenuFormValues>;
  loading?: boolean;
  submitLabel?: string;
  onSubmit: (values: MenuFormValues) => void | Promise<void>;
};

export function MenuForm({
  defaultValues,
  loading,
  submitLabel = "Save",
  onSubmit,
}: Props) {
  const { data: templates = [], isLoading: isTemplatesLoading } =
    useGetAllMenuTemplates();
  const { control, register, handleSubmit, setValue } = useForm<MenuFormValues>(
    {
      resolver: zodResolver(menuSchema),
      defaultValues: {
        name: "",
        description: "",
        is_visible: true,
        template_id: DEFAULT_MENU_TEMPLATE_ID,
        ...defaultValues,
      },
    },
  );
  const selectedTemplateId = useWatch({ control, name: "template_id" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup>
        <FormInputItem
          control={control}
          name="name"
          label="Name"
          placeholder="e.g. Main Menu"
        />

        <FormTextareaItem
          control={control}
          name="description"
          label="Description"
          rows={3}
        />

        <div className="space-y-2">
          <Label htmlFor="menu-template">Menu template</Label>
          <input type="hidden" {...register("template_id")} />
          <div
            id="menu-template"
            className="no-scrollbar flex snap-x gap-3 overflow-x-auto pb-2"
            aria-label="Choose a menu template"
          >
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                selected={selectedTemplateId === template.id}
                disabled={loading || isTemplatesLoading}
                onSelect={() =>
                  setValue("template_id", template.id, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
            ))}
          </div>
          {!isTemplatesLoading && templates.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No menu templates are available.
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Choose how customers see this menu.
          </p>
        </div>

        <FormCheckboxItem control={control} name="is_visible" label="Visible" />

        <Field>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : submitLabel}
          </Button>
          <FieldDescription>
            Visible menus are published for customers to scan.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}

function TemplateCard({
  template,
  selected,
  disabled,
  onSelect,
}: {
  template: {
    id: string;
    display_name: string;
    description: string;
    preview_image?: string | null;
  };
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  const [hasPreviewError, setHasPreviewError] = useState(false);
  const hasPreview = Boolean(template.preview_image) && !hasPreviewError;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      aria-pressed={selected}
      className={`relative flex w-48 shrink-0 snap-start flex-col overflow-hidden rounded-lg border text-left transition-colors ${
        selected
          ? "border-primary ring-2 ring-primary/20"
          : "border-border hover:border-primary/50"
      } disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {selected && (
        <span className="absolute left-2 top-2 z-10 flex size-5 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm ring-2 ring-white">
          <Check className="size-3.5" strokeWidth={3} />
        </span>
      )}
      <div className="flex h-24 items-center justify-center bg-muted text-xs text-muted-foreground">
        {hasPreview ? (
          // API preview URLs may be hosted outside the Next.js image loader.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={template.preview_image ?? undefined}
            alt={`${template.display_name} preview`}
            className="size-full object-cover"
            onError={() => setHasPreviewError(true)}
          />
        ) : (
          <span className="flex items-center gap-1.5">
            <ImageOff className="size-4" />
            No preview available
          </span>
        )}
      </div>
      <div className="min-h-20 space-y-1 p-3">
        <div>
          <span className="text-sm font-semibold">{template.display_name}</span>
        </div>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {template.description}
        </p>
      </div>
    </button>
  );
}
