"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { flattenObject } from "@/lib/utils";

const SearchSchema = z.object({
  query: z.string().min(1, "Required").max(512, "Too long"),
});

type SearchValues = z.infer<typeof SearchSchema>;

export default function SearchForm() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<SearchValues>({
    resolver: zodResolver(SearchSchema),
    defaultValues: {
      query: "",
    },
  });

  const onSubmit = (values: SearchValues) => {
    const payload = flattenObject(values);
    const href = `/search?${new URLSearchParams(payload)}`;

    startTransition(() => {
      router.push(href);
    });
  };

  const goToFeatured = (href: string) => {
    if (isPending) return;

    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <div className="flex flex-col justify-center w-full max-w-md gap-6 p-4">
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full grow gap-2 "
          aria-busy={isPending}
        >
          <fieldset
            disabled={isPending}
            className="contents disabled:opacity-70"
          >
            <div className="flex items-center grow">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem className="flex flex-col grow">
                    <FormLabel htmlFor="query" className="font-normal">
                      Title
                    </FormLabel>

                    <FormControl>
                      <Input
                        id="query"
                        placeholder="Query in movie titles..."
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        autoComplete="off"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex grow justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Searching..." : "Search"}
              </Button>
            </div>
          </fieldset>
        </form>
      </FormProvider>

      {/* <article className="flex flex-col justify-center gap-2 lg:hidden " aria-busy={isPending}>
        <div className="flex gap-2 w-">
          <Button
            type="button"
            onClick={() => goToFeatured("/featured/popular")}
            variant="outline"
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Most popular"}
          </Button>
          <Button
            type="button"
            onClick={() => goToFeatured("/featured/top-rated")}
            variant="outline"
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Top rated"}
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => goToFeatured("/featured/upcoming")}
            variant="outline"
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Upcoming"}
          </Button>
          <Button
            type="button"
            onClick={() => goToFeatured("/featured/now-playing")}
            variant="outline"
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Now playing"}
          </Button>
        </div>
      </article> */}


      <article className="flex flex-row justify-center gap-2 lg:hidden flex-wrap" aria-busy={isPending}>
        
          <Button
            type="button"
            onClick={() => goToFeatured("/featured/popular")}
            variant="outline"
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Most popular"}
          </Button>
          <Button
            type="button"
            onClick={() => goToFeatured("/featured/top-rated")}
            variant="outline"
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Top rated"}
          </Button>
        

       
          <Button
            type="button"
            onClick={() => goToFeatured("/featured/upcoming")}
            variant="outline"
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Upcoming"}
          </Button>
          <Button
            type="button"
            onClick={() => goToFeatured("/featured/now-playing")}
            variant="outline"
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Now playing"}
          </Button>
        
      </article>
    </div>
  );
}