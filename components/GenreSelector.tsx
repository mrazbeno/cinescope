import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import React from "react";

function GenreSelector({
  availableGenres,
  onChange,
}: {
  availableGenres: Map<string, string>,
  onChange: (selected: string[], operator: "AND" | "OR") => void
}) {
  const [activeGenres, setActiveGenres] = React.useState<Set<string>>(new Set());
  const [operator, setOperator] = React.useState<"AND" | "OR">("AND");

  const toggleGenre = (id: string) => {

    const next = new Set(activeGenres);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setActiveGenres(next);
    onChange(Array.from(next), operator); // safe: inside event handler
  };

  const toggleOperator = (op: "AND" | "OR") => {
    setOperator(op);
    onChange(Array.from(activeGenres), op);
  };

  return (
    <section className="h-auto flex-1 flex flex-col">
      <div className="font-normal whitespace-nowrap mb-2">
        Movie genres
        <div className="flex gap-2 flex-row items-center text-sm text-muted-foreground">
          AND
          <Switch checked={operator === "OR"} onCheckedChange={(checked) => toggleOperator(checked ? "OR" : "AND")} />
          OR
        </div>
      </div>
      {availableGenres.size > 0 ? (
        <ScrollArea className="border rounded-md p-3 grow h-[0]">
          <ul>
            {Array.from(availableGenres.entries()).map(([id, name]) => (
              <li className="flex py-1 gap-2" key={id}>
                <Checkbox
                  id={id}
                  checked={activeGenres.has(id)}
                  onCheckedChange={() => toggleGenre(id)}
                />
                <Label htmlFor={id}>{name}</Label>
              </li>
            ))}
          </ul>
        </ScrollArea>
      ) : (
        <Skeleton className="border w-48 rounded-md p-3 grow" />
      )}
    </section>
  );
}

export default React.memo(GenreSelector);