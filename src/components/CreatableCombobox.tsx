"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  options: string[];
  disabledOptions?: string[];
  placeholder?: string;
  onChange(value: string): void;
};

export function CreatableCombobox({
  value,
  options,
  disabledOptions = [],
  placeholder = "Select label",
  onChange,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const normalizedSearch = search.trim().toLowerCase();
  const disabledValues = React.useMemo(
    () => new Set(disabledOptions.map((option) => option.toLowerCase())),
    [disabledOptions],
  );

  const uniqueOptions = React.useMemo(
    () =>
      Array.from(
        new Map(options.map((option) => [option.toLowerCase(), option])).values(),
      ),
    [options],
  );

  const filteredOptions = uniqueOptions.filter((option) =>
    option.toLowerCase().includes(normalizedSearch),
  );

  const hasExactMatch = uniqueOptions.some(
    (option) => option.toLowerCase() === normalizedSearch,
  );
  const canCreate = search.trim().length > 0 && !hasExactMatch;

  const handleSelect = (nextValue: string) => {
    onChange(nextValue);
    setSearch("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={search}
            onValueChange={setSearch}
          />

          <CommandList>
            <CommandGroup>
              {filteredOptions.map((option) => {
                const isDisabled =
                  disabledValues.has(option.toLowerCase()) && option !== value;

                return (
                  <CommandItem
                    key={option}
                    value={option}
                    disabled={isDisabled}
                    onSelect={() => handleSelect(option)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span className="truncate">{option}</span>
                  </CommandItem>
                );
              })}

              {canCreate && (
                <CommandItem
                  value={search.trim()}
                  onSelect={() => handleSelect(search.trim())}
                >
                  Create &quot;{search.trim()}&quot;
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
