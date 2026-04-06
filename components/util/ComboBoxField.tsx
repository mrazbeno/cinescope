"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type Option = {
  label: string;
  value: string;
};

type ComboboxFieldProps = {
  name: string;
  label: string;
  options: Option[];
  description?: string;
  placeholder?: string;
  disabled?: boolean;
};

export function ComboboxField({
  name,
  label,
  options,
  description,
  placeholder = "Select...",
  disabled = false,
}: ComboboxFieldProps) {
  const { control, setValue } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedLabel = field.value
          ? options.find((opt) => opt.value === field.value)?.label
          : null;

        return (
          <FormItem className="flex w-full min-w-0 flex-col">
            <FormLabel>{label}</FormLabel>

            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    disabled={disabled}
                    className={cn(
                      "flex w-full min-w-0 items-center justify-between overflow-hidden",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <span
                      className="block min-w-0 flex-1 truncate text-left"
                      title={selectedLabel ?? placeholder}
                    >
                      {selectedLabel ?? placeholder}
                    </span>

                    <ChevronsUpDown className="ml-2 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>

              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search..."
                    className="h-9"
                    disabled={disabled}
                  />

                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      {options.map((opt) => (
                        <CommandItem
                          key={opt.value}
                          value={opt.label}
                          disabled={disabled}
                          onSelect={() => {
                            if (disabled) return;
                            setValue(name, opt.value, {
                              shouldDirty: true,
                              shouldTouch: true,
                              shouldValidate: true,
                            });
                          }}
                        >
                          <span className="min-w-0 truncate">{opt.label}</span>
                          <Check
                            className={cn(
                              "ml-auto shrink-0",
                              opt.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}