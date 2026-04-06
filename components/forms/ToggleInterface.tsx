"use client";

import SearchForm from "@/components/forms/SearchForm";
import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import DiscoverForm from "./DiscoverForm";

export default function ToggleInterface() {
  const [isDiscovering, setIsDiscovering] = React.useState(false);

  return (
    <div className="w-full flex justify-center items-center flex-col gap-6 overflow-hidden">
      <div className="flex grow gap-2">
        <Label htmlFor="search_active">Search</Label>
        <Switch onCheckedChange={setIsDiscovering} checked={isDiscovering} id="search_active" />
        <Label htmlFor="search_active">Discover</Label>
      </div>

      <div className="w-full">
        <div className={isDiscovering ? "hidden" : "flex flex-row justify-center"} aria-hidden={isDiscovering}>
          <SearchForm />
        </div>

        <div className={isDiscovering ? "flex flex-row justify-center" : "hidden"} aria-hidden={!isDiscovering}>
          <DiscoverForm />
        </div>
      </div>
    </div>
  );
}