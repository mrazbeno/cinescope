"use client";

import * as React from "react";
import * as z from "zod";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Ellipsis, Info, CircleQuestionMark } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn, flattenObject } from "@/lib/utils";
import { sortByOptions } from "@/lib/tmdbTypes";
import { ComboboxField } from "../util/ComboBoxField";
import { Option } from "../util/ComboBoxField";
import GenreSelector from "./GenreSelector";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const sortByEnum = z.enum(
  sortByOptions.map((opt) => opt.value) as [string, ...string[]]
);

const DiscoverSchema = z.object({
  vote_average: z
    .object({
      gte: z
        .coerce.number()
        .min(0, "Minimum average of votes cannot be less than 0.")
        .max(10, "Maximum average of votes cannot be more than 10.")
        .optional(),
      lte: z
        .coerce.number()
        .min(0, "Maximum average of votes cannot be less than 0.")
        .max(10, "Maximum average of votes cannot be more than 10.")
        .optional(),
    })
    .optional()
    .refine(
      (data) =>
        !data ||
        data.gte === undefined ||
        data.lte === undefined ||
        data.gte <= data.lte,
      {
        message: "Minimum vote cannot be greater than maximum vote.",
        path: ["gte"],
      }
    ),

  vote_count: z
    .object({
      gte: z.coerce.number().min(0, "Minimum number of votes cannot be less than 0.").optional(),
      lte: z.coerce.number().min(0, "Maximum number of votes cannot be less than 0.").optional(),
    })
    .optional()
    .refine(
      (data) =>
        !data ||
        data.gte === undefined ||
        data.lte === undefined ||
        data.gte <= data.lte,
      {
        message: "Minimum vote count cannot be greater than maximum vote count.",
        path: ["gte"],
      }
    ),

  release_date: z
    .object({
      gte: z.coerce.date().optional(),
      lte: z.coerce.date().optional(),
    })
    .optional()
    .refine(
      (data) =>
        !data ||
        data.gte === undefined ||
        data.lte === undefined ||
        data.gte <= data.lte,
      {
        message: "Start release date cannot be after end release date.",
        path: ["gte"],
      }
    ),

  with_original_language: z.string().optional(),
  sort_by: sortByEnum.optional(),
});

type DiscoverValues = z.infer<typeof DiscoverSchema>;
type DiscoverQuery = DiscoverValues & {
  with_genres?: string;
};

export default function DiscoverForm() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<DiscoverValues>({
    resolver: zodResolver(DiscoverSchema),
    defaultValues: {
      vote_count: { gte: undefined, lte: undefined },
      vote_average: { gte: undefined, lte: undefined },
      release_date: { gte: undefined, lte: undefined },
      with_original_language: undefined,
      sort_by: undefined,
    },
  });

  const [genreOperator, setGenreOperator] = React.useState<"AND" | "OR">("AND");
  const [selectedGenres, setSelectedGenres] = React.useState<string[]>([]);
  const [availableGenres, setAvailableGenres] = React.useState(new Map<string, string>());
  const [availableLanguages, setAvailableLanguages] = React.useState(new Map<string, Option>());

  const onSubmit = (values: DiscoverValues) => {
    const query: DiscoverQuery = { ...values };

    const genres = Array.from(selectedGenres.values());
    if (genres.length) {
      query.with_genres = genres.join(genreOperator === "OR" ? "|" : ",");
    }

    const payload = flattenObject(query);
    const href = `/discover?${new URLSearchParams(payload)}`;

    startTransition(() => {
      router.push(href);
    });
  };

  async function fetchGenres() {
    const res = await fetch("/api/genres");
    const parsed = await res.json();

    const newGenres = new Map<string, string>();
    for (const genre of parsed.genres) {
      newGenres.set(genre.id, genre.name);
    }

    setAvailableGenres(newGenres);
  }

  async function fetchLanguages() {
    const res = await fetch("/api/languages");
    const parsed = await res.json();

    const newLangs = new Map<string, Option>();
    for (const lang of parsed) {
      newLangs.set(lang.iso_639_1, {
        value: lang.iso_639_1,
        label: lang.english_name + (lang.name ? ` (${lang.name})` : ""),
      });
    }

    setAvailableLanguages(newLangs);
  }

  React.useEffect(() => {
    fetchGenres();
    fetchLanguages();
  }, []);

  return (
    <div className="w-full max-w-xl p-4">
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="p-2 flex flex-col w-full grow gap-2"
        aria-busy={isPending}
      >
        <fieldset disabled={isPending} className="contents disabled:opacity-70">
          <div className="flex min-w-0 gap-2">
            <section className="flex gap-4 min-w-0 flex-col grow">
              <section className="flex gap-2 items-end md:flex-row flex-col">
                <div className="flex items-center grow w-full">
                  <FormField
                    control={form.control}
                    name="vote_average.gte"
                    render={({ field }) => (
                      <FormItem className="flex flex-col grow">
                        <FormLabel htmlFor="vote_avg_gte" className="font-normal">
                          Minimum rating
                        </FormLabel>
                        <FormControl>
                          <Input
                            min={0}
                            step={0.2}
                            max={10}
                            placeholder="Min..."
                            id="vote_avg_gte"
                            type="number"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="hidden md:flex items-center text-sm text-muted-foreground">to</div>

                <div className="flex items-center grow w-full">
                  <FormField
                    control={form.control}
                    name="vote_average.lte"
                    render={({ field }) => (
                      <FormItem className="flex flex-col grow">
                        <FormLabel htmlFor="vote_avg_lte" className="font-normal flex flex-row justify-between">
                          Maximum rating

                          <Tooltip>
                            <TooltipTrigger asChild className="cursor-help">
                              <CircleQuestionMark className="p-1 shrink-0" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Vote average range is 0-10.
                              </p>
                            </TooltipContent>
                          </Tooltip>

                        </FormLabel>
                        <FormControl>
                          <Input
                            min={0}
                            step={0.2}
                            max={10}
                            placeholder="Max..."
                            id="vote_avg_lte"
                            type="number"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <Separator className="grow" />

              <section className="flex gap-2 items-end md:flex-row flex-col">
                <div className="flex items-center grow w-full">
                  <FormField
                    control={form.control}
                    name="vote_count.gte"
                    render={({ field }) => (
                      <FormItem className="flex flex-col grow">
                        <FormLabel htmlFor="vote_cnt_gte" className="font-normal">
                          Minimum votes
                        </FormLabel>
                        <FormControl>
                          <Input
                            min={0}
                            step={100}
                            placeholder="Min..."
                            id="vote_cnt_gte"
                            type="number"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="hidden md:flex items-center text-sm text-muted-foreground">to</div>

                <div className="flex items-center grow w-full">
                  <FormField
                    control={form.control}
                    name="vote_count.lte"
                    render={({ field }) => (
                      <FormItem className="flex flex-col grow">
                        <FormLabel htmlFor="vote_cnt_lte" className="font-normal">
                          Maximum votes
                        </FormLabel>

                        <FormControl>
                          <Input
                            min={0}
                            step={100}
                            placeholder="Max..."
                            id="vote_cnt_lte"
                            type="number"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <Separator className="grow" />

              <section className="flex gap-2 grow items-end md:flex-row flex-col">
                <FormField
                  control={form.control}
                  name="release_date.gte"
                  render={({ field }) => (
                    <FormItem className="flex flex-col grow w-full">
                      <FormLabel>
                        <div>
                          Release date <i>from</i>
                        </div>
                      </FormLabel>

                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled={isPending}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="hidden md:flex items-center text-sm text-muted-foreground">to</div>

                <FormField
                  control={form.control}
                  name="release_date.lte"
                  render={({ field }) => (
                    <FormItem className="flex flex-col grow w-full">
                      <FormLabel>
                        <div>
                          Release date <i>to</i>
                        </div>
                      </FormLabel>

                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled={isPending}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              <Separator className="hidden md:flex grow" />

              {/* <section className="flex min-w-0 grow flex-col gap-2 md:flex-row items-end"> */}
              <section className="hidden md:flex min-w-0 grow  gap-2  flex-row items-end">
                <div className="w-full min-w-0 flex-1">
                  <ComboboxField
                    disabled={isPending}
                    name="with_original_language"
                    label="Original language"
                    options={Array.from(availableLanguages.values())}
                  />
                </div>

                <div className="w-full min-w-0 flex-1">
                  <ComboboxField
                    disabled={isPending}
                    name="sort_by"
                    label="Sort by"
                    options={sortByOptions}
                  />
                </div>
              </section>
            </section>

            <GenreSelector
              disabled={isPending}
              availableGenres={availableGenres}
              onChange={(selected, op) => {
                setSelectedGenres(selected);
                setGenreOperator(op);
              }}
            />
          </div>

          <Separator className="flex md:hidden grow" />

          <section className="flex min-w-0 grow flex-col gap-2 items-stretch md:hidden">
                <div className="w-full min-w-0 flex-1">
                  <ComboboxField
                    disabled={isPending}
                    name="with_original_language"
                    label="Original language"
                    options={Array.from(availableLanguages.values())}
                  />
                </div>

                <div className="w-full min-w-0 flex-1">
                  <ComboboxField
                    disabled={isPending}
                    name="sort_by"
                    label="Sort by"
                    options={sortByOptions}
                  />
                </div>
              </section>

          <div className="flex">
            <div className="flex grow justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>
        </fieldset>
      </form>
    </FormProvider>
    </div>
  );
}