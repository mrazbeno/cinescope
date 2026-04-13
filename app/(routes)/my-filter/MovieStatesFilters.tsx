// MovieStatesFilters.tsx
"use client";

import * as React from "react";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { WatchStatusOptions } from "@/lib/movieStateTypes";
import { MovieStatesFilter, defaultMovieStatesFilter, SortingValueOptions } from "@/lib/movieStateFilters";

type Props = {
    value: MovieStatesFilter;
    onChange: (next: MovieStatesFilter) => void;
};

export function MovieStatesFilters({
    value,
    onChange,
}: Props) {
    return (
        <section className="flex flex-col gap-4 w-full">
            <header className="text-lg font-medium">Filter your catalog</header>

            <div className="flex flex-col gap-2">
                <Label>Included statuses for movies</Label>
                <ToggleGroup
                    variant="outline"
                    // orientation="vertical"
                    className="flex-col  w-full grow sm:w-auto xl:flex-row"
                    type="multiple"
                    spacing={1}
                    size={"sm"}
                    value={value.watch_statuses}
                    onValueChange={(statuses) =>
                        onChange({ ...value, watch_statuses: statuses as any })
                    }
                >
                    {WatchStatusOptions.map((opt) => (
                        <ToggleGroupItem
                            className="grow w-full xl:w-auto"
                            key={opt.value}
                            value={opt.value}
                            aria-label={`Toggle ${opt.label}`}
                        >
                            {opt.label}
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>
            </div>

            <div className="flex items-center gap-2 flex-col sm:flex-row">
                <div className="flex flex-col gap-2 w-full">
                    <Label className="whitespace-nowrap">Include favorites</Label>
                    <Toggle
                        pressed={value.is_favorite}
                        onPressedChange={(pressed) =>
                            onChange({ ...value, is_favorite: pressed })
                        }
                        className="group/toggle"
                        aria-label="Toggle favorites"
                        size={"sm"}
                        variant="outline"
                    >
                        <Heart className="group-data-[state=on]/toggle:fill-red-500" />
                    </Toggle>
                </div>

                <div className="flex flex-col gap-2 w-full">
                    <Label>Sort by</Label>
                    <Select defaultValue={defaultMovieStatesFilter.sort_by}>
                        <SelectTrigger size="sm" className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Watch statuses</SelectLabel>
                                {Array.from(SortingValueOptions.values()).map((e) => (
                                    <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </section>
    );
}
