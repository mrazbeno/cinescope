import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { CircleQuestionMark } from "lucide-react";

function GenreSelector({
  availableGenres,
  onChange,
  disabled = false,
}: {
  availableGenres: Map<string, string>;
  onChange: (selected: string[], operator: "AND" | "OR") => void;
  disabled?: boolean;
}) {
  const [activeGenres, setActiveGenres] = React.useState<Set<string>>(new Set());
  const [operator, setOperator] = React.useState<"AND" | "OR">("AND");

  const toggleGenre = (id: string) => {
    if (disabled) return;

    const next = new Set(activeGenres);
    if (next.has(id)) next.delete(id);
    else next.add(id);

    setActiveGenres(next);
    onChange(Array.from(next), operator);
  };

  const toggleOperator = (op: "AND" | "OR") => {
    if (disabled) return;

    setOperator(op);
    onChange(Array.from(activeGenres), op);
  };

  return (
    <section
      className={[
        "h-auto flex-1 flex flex-col",
        disabled ? "opacity-70 pointer-events-none" : "",
      ].join(" ")}
      aria-disabled={disabled}
    >
      <div className="font-normal whitespace-nowrap mb-2">
        <div className="flex flex-row justify-between">
          Movie genres
          <Tooltip>
            <TooltipTrigger asChild className="cursor-help">
              <CircleQuestionMark className="p-1 shrink-0" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Select one or more movie genres, and decide if results should satisfy having all (AND) or any (OR) of them.</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex gap-2 flex-row items-center text-sm text-muted-foreground">
          AND
          <Switch
            checked={operator === "OR"}
            onCheckedChange={(checked) =>
              toggleOperator(checked ? "OR" : "AND")
            }
            disabled={disabled}
          />
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
                  disabled={disabled}
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