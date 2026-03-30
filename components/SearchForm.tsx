"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import * as z from "zod"
import * as React from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation"
import { flattenObject } from "@/lib/utils"

const SearchSchema = z.object({
    query: z.string().min(1, "Required").max(512, "Too long"),
})

export default function SearchForm() {

    const router = useRouter();

    const form = useForm<z.infer<typeof SearchSchema>>({
        resolver: zodResolver(SearchSchema),
        defaultValues: {},
    })

    const onSubmit = (values: z.infer<typeof SearchSchema>) => {
        const payload = flattenObject(values)
        router.push(`/search?${new URLSearchParams(payload)}`)
    }

    return <>
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full grow gap-2">
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
                                    <Input placeholder="Query in movie titles..." id="query" onChange={(val) => field.onChange(val)}></Input>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex grow justify-end">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Searching..." : "Search"}
                    </Button>
                </div>
            </form>
        </FormProvider>
        <article className="flex flex-col gap-2 mt-4 lg:hidden">
            <div className="flex gap-2">
                <Button onClick={_ => { router.push("/featured/popular") }} variant={"outline"}>Most popular</Button>
                <Button onClick={_ => { router.push("/featured/top-rated") }} variant={"outline"}>Top rated</Button>
            </div>
            <div className="flex gap-2">
                <Button onClick={_ => { router.push("/featured/upcoming") }} variant={"outline"}>Upcoming</Button>
                <Button onClick={_ => { router.push("/featured/now-playing") }} variant={"outline"}>Now playing</Button>
            </div>
        </article>
    </>
}