"use client"

import SearchForm from "@/components/SearchForm"
import * as React from "react"
import { Switch} from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import DiscoverForm from "./DiscoverForm"

export default function ToggleInterface() {

    const [isDiscovering, setIsDiscovering] = React.useState<boolean>(false)

    return <div className="w-[90%] max-w-3xl flex justify-center items-center flex-col gap-6">
        <div className="flex grow gap-2 ">
          <Label htmlFor="search_active">Search</Label>
          <Switch onCheckedChange={setIsDiscovering} checked={isDiscovering} id="search_active"></Switch>
          <Label htmlFor="search_active">Discover</Label>
        </div>
          {!isDiscovering ? (
        <SearchForm/>
      ) : (
        <DiscoverForm />
      )}
    </div>
}