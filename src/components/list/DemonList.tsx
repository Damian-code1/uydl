"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Search, Trophy, UserCircle2 } from "lucide-react";
import { Link } from "next-view-transitions";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDemonListFilters } from "@/hooks/useDemonListFilters";
import { DemonLevel } from "@/types/domain";

async function getLevels(): Promise<DemonLevel[]> {
  const response = await fetch("/api/levels", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("No se pudo cargar la demon list");
  }
  return response.json();
}

function difficultyGlow(rank: number) {
  if (rank <= 10) return "from-red-500/20 to-rose-700/10 border-red-400/20";
  if (rank <= 25) return "from-orange-500/20 to-amber-700/10 border-orange-400/20";
  if (rank <= 50) return "from-violet-500/20 to-fuchsia-700/10 border-violet-400/20";
  return "from-sky-500/20 to-blue-700/10 border-sky-400/20";
}

export function DemonList() {
  const [search, setSearch] = useState("");
  const [range, setRange] = useState<"ALL" | "TOP_1_10" | "TOP_11_50" | "TOP_51_75">("ALL");
  const [status, setStatus] = useState("ALL");

  const { data = [], isLoading } = useQuery({ queryKey: ["levels"], queryFn: getLevels });
  const filtered = useDemonListFilters(data, search, range, status);

  return (
    <TooltipProvider>
      <section className="space-y-5">
        <div className="grid gap-3 rounded-xl border border-white/10 bg-[#09090d]/80 p-4 sm:grid-cols-3">
          <div className="relative sm:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-9"
              placeholder="Buscar por nivel o jugador"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Select value={range} onValueChange={(value) => setRange(value as typeof range)}>
              <SelectTrigger>
                <SelectValue placeholder="Rango" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="TOP_1_10">Top 1-10</SelectItem>
                <SelectItem value="TOP_11_50">Top 11-50</SelectItem>
                <SelectItem value="TOP_51_75">Top 51-75</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todo</SelectItem>
                <SelectItem value="APPROVED">Verificado</SelectItem>
                <SelectItem value="PENDING">Sin verify</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading && <div className="rounded-xl border border-white/10 p-6 text-slate-300">Cargando demon list...</div>}

        <div className="grid gap-3">
          {filtered.map((level, index) => (
            <motion.article
              key={level.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.035 }}
              whileHover={{ scale: 1.01, y: -3 }}
              className={`gradient-card group rounded-xl bg-gradient-to-br p-4 ${difficultyGlow(level.rank)}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">#{level.rank}</p>
                  <h2 className="text-xl font-bold text-white">{level.name}</h2>
                  <p className="text-sm text-slate-300">By {level.creator}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={level.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border border-white/20 px-3 py-1 text-xs text-slate-100 hover:bg-white/10"
                      >
                        Showcase
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>Video principal del nivel</TooltipContent>
                  </Tooltip>
                  <div className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-black/30 px-2 py-1 text-xs text-slate-200">
                    <Trophy className="h-3.5 w-3.5" />
                    {level.points} pts
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-300">{level.description}</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                <UserCircle2 className="h-4 w-4" />
                {level.victors.length ? (
                  <div className="flex flex-wrap gap-2">
                    {level.victors.map((victor) => (
                      <Link
                        key={`${level.id}-${victor}`}
                        href={`/players/${encodeURIComponent(victor)}`}
                        className="rounded border border-white/15 px-2 py-0.5 text-[11px] text-slate-200 hover:bg-white/10"
                      >
                        {victor}
                      </Link>
                    ))}
                  </div>
                ) : (
                  "Aún sin victors aprobados"
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </TooltipProvider>
  );
}
