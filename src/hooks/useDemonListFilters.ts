"use client";

import { useMemo } from "react";
import Fuse from "fuse.js";
import { DemonLevel } from "@/types/domain";

export type RankRange = "ALL" | "TOP_1_10" | "TOP_11_50" | "TOP_51_75";

export function useDemonListFilters(levels: DemonLevel[], query: string, rankRange: RankRange, status: string) {
  const fuse = useMemo(
    () =>
      new Fuse(levels, {
        keys: ["name", "victors"],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [levels],
  );

  return useMemo(() => {
    const searched = query.trim() ? fuse.search(query).map((result) => result.item) : levels;

    const rankFiltered = searched.filter((level) => {
      if (rankRange === "TOP_1_10") return level.rank >= 1 && level.rank <= 10;
      if (rankRange === "TOP_11_50") return level.rank >= 11 && level.rank <= 50;
      if (rankRange === "TOP_51_75") return level.rank >= 51 && level.rank <= 75;
      return true;
    });

    const statusFiltered = rankFiltered.filter((level) => {
      if (status === "ALL") return true;
      if (status === "APPROVED") return level.victors.length > 0;
      if (status === "PENDING") return level.victors.length === 0;
      return true;
    });

    return statusFiltered.sort((a, b) => a.rank - b.rank);
  }, [fuse, levels, query, rankRange, status]);
}
