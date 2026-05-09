"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDemonListFilters } from "@/hooks/useDemonListFilters";
import { LevelCard, DemonLevel } from "@/components/list/LevelCard";

async function getLevels(): Promise<DemonLevel[]> {
  const response = await fetch("/api/levels", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("No se pudo cargar la demon list");
  }
  return response.json();
}

export function DemonList() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [range, setRange] = useState<"ALL" | "TOP_1_10" | "TOP_11_50" | "TOP_51_75">("ALL");

  const { data = [], isLoading } = useQuery({
    queryKey: ["levels"],
    queryFn: getLevels,
    staleTime: 30_000,
  });

  const filtered = useDemonListFilters(data, search, range, "ALL").filter((level) => {
    if (!difficulty) return true;
    return level.difficulty === difficulty;
  });

  return (
    <section className="space-y-6">
      {/* Filters */}
      <div className="grid gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm p-4 sm:grid-cols-4">
        <div className="relative sm:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            placeholder="Search levels or creators..."
          />
        </div>

        <Select value={range} onValueChange={(value) => setRange(value as typeof range)}>
          <SelectTrigger>
            <SelectValue placeholder="Position Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Levels</SelectItem>
            <SelectItem value="TOP_1_10">Top 1-10</SelectItem>
            <SelectItem value="TOP_11_50">Top 11-50</SelectItem>
            <SelectItem value="TOP_51_75">Top 51-75</SelectItem>
          </SelectContent>
        </Select>

        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger>
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Difficulties</SelectItem>
            <SelectItem value="EASY">Easy</SelectItem>
            <SelectItem value="NORMAL">Normal</SelectItem>
            <SelectItem value="HARD">Hard</SelectItem>
            <SelectItem value="INSANE">Insane</SelectItem>
            <SelectItem value="EXTREME">Extreme</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 p-12 text-center">
          <div className="inline-flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-slate-600 border-t-white rounded-full animate-spin" />
            <p className="text-slate-400">Loading demon list...</p>
          </div>
        </div>
      )}

      {/* Levels Grid */}
      {!isLoading && (
        <div className="grid gap-4">
          {filtered.length > 0 ? (
            filtered.map((level, index) => (
              <LevelCard key={level.id} level={level} index={index} />
            ))
          ) : (
            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 p-12 text-center">
              <p className="text-slate-400">No levels found matching your filters</p>
            </div>
          )}
        </div>
      )}

      {/* Stats Footer */}
      <div className="flex justify-between items-center text-sm text-slate-500 pt-4 border-t border-white/10">
        <span>{filtered.length} of {data.length} levels</span>
        <span>Last updated: now</span>
      </div>
    </section>
  );
}
