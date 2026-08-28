import { Download, Loader2, RefreshCw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROGRAMS } from "@/lib/sace";

export interface FiltersState {
  search: string;
  program: string;
  college: string;
  from: string;
  to: string;
  sort: "newest" | "oldest";
}

interface ResponseFiltersProps {
  filters: FiltersState;
  colleges: string[];
  refreshing: boolean;
  exporting: boolean;
  onChange: (patch: Partial<FiltersState>) => void;
  onRefresh: () => void;
  onExport: () => void;
}

export function ResponseFilters({
  filters,
  colleges,
  refreshing,
  exporting,
  onChange,
  onRefresh,
  onExport,
}: ResponseFiltersProps) {
  return (
    <section className="surface-card space-y-4 p-4 sm:p-5">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Label htmlFor="search" className="sr-only">
          Search responses
        </Label>
        <Input
          id="search"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder="Search responses..."
          className="h-11 rounded-xl pl-9"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-1.5">
          <Label htmlFor="program-filter" className="text-xs">
            Program
          </Label>
          <Select value={filters.program} onValueChange={(v) => onChange({ program: v })}>
            <SelectTrigger id="program-filter" className="h-11 w-full rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              {PROGRAMS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="college-filter" className="text-xs">
            College
          </Label>
          <Select value={filters.college} onValueChange={(v) => onChange({ college: v })}>
            <SelectTrigger id="college-filter" className="h-11 w-full rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Colleges</SelectItem>
              {colleges.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="from-date" className="text-xs">
            From Date
          </Label>
          <Input
            id="from-date"
            type="date"
            value={filters.from}
            onChange={(e) => onChange({ from: e.target.value })}
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="to-date" className="text-xs">
            To Date
          </Label>
          <Input
            id="to-date"
            type="date"
            value={filters.to}
            onChange={(e) => onChange({ to: e.target.value })}
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="sort" className="text-xs">
            Sort by
          </Label>
          <Select
            value={filters.sort}
            onValueChange={(v) => onChange({ sort: v as FiltersState["sort"] })}
          >
            <SelectTrigger id="sort" className="h-11 w-full rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onRefresh} disabled={refreshing} className="h-11">
          <RefreshCw className={`mr-2 size-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden />
          Refresh
        </Button>
        <Button onClick={onExport} disabled={exporting} className="h-11">
          {exporting ? (
            <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
          ) : (
            <Download className="mr-2 size-4" aria-hidden />
          )}
          {exporting ? "Preparing export…" : "Download All Responses"}
        </Button>
      </div>
    </section>
  );
}
