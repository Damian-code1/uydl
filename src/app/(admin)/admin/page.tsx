"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LevelAdmin = {
  id: string;
  rank: number;
  name: string;
  creator: string;
  videoUrl: string;
  description: string;
  points: number;
};

type PendingRecord = {
  id: string;
  playerName: string;
  videoUrl: string;
  levelName: string;
};

async function fetchAdminData() {
  const [levelsRes, recordsRes] = await Promise.all([
    fetch("/api/admin/levels", { cache: "no-store" }),
    fetch("/api/admin/records", { cache: "no-store" }),
  ]);

  if (!levelsRes.ok || !recordsRes.ok) {
    throw new Error("No autorizado o error de carga");
  }

  return {
    levels: (await levelsRes.json()) as LevelAdmin[],
    records: (await recordsRes.json()) as PendingRecord[],
  };
}

export default function AdminPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-data"], queryFn: fetchAdminData });

  const [formMap, setFormMap] = useState<Record<string, Partial<LevelAdmin>>>({});

  const levels = useMemo(() => data?.levels ?? [], [data?.levels]);
  const records = useMemo(() => data?.records ?? [], [data?.records]);

  const updateLevel = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<LevelAdmin> }) => {
      const response = await fetch(`/api/admin/levels/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("No se pudo actualizar");
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-data"] }),
  });

  const approveRecord = useMutation({
    mutationFn: async (recordId: string) => {
      const response = await fetch(`/api/admin/records/${recordId}/approve`, { method: "POST" });
      if (!response.ok) throw new Error("No se pudo aprobar");
      return response.json();
    },
    onSuccess: () => {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      queryClient.invalidateQueries({ queryKey: ["admin-data"] });
      queryClient.invalidateQueries({ queryKey: ["levels"] });
    },
  });

  if (isLoading) {
    return <main className="mx-auto max-w-7xl p-6 text-slate-200">Cargando panel admin...</main>;
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-10 px-4 py-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-black text-white">Admin Panel</h1>
        <p className="text-sm text-slate-300">Edición de niveles (Top 1-75) y aprobación de records pendientes.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">Niveles</h2>
        <div className="space-y-2">
          {levels.map((level) => {
            const local = formMap[level.id] ?? {};
            return (
              <div key={level.id} className="gradient-card grid gap-2 rounded-lg p-3 sm:grid-cols-6">
                <Input
                  type="number"
                  defaultValue={level.rank}
                  onChange={(event) =>
                    setFormMap((prev) => ({
                      ...prev,
                      [level.id]: { ...prev[level.id], rank: Number(event.target.value) },
                    }))
                  }
                />
                <Input
                  defaultValue={level.name}
                  onChange={(event) =>
                    setFormMap((prev) => ({ ...prev, [level.id]: { ...prev[level.id], name: event.target.value } }))
                  }
                />
                <Input
                  defaultValue={level.creator}
                  onChange={(event) =>
                    setFormMap((prev) => ({
                      ...prev,
                      [level.id]: { ...prev[level.id], creator: event.target.value },
                    }))
                  }
                />
                <Input
                  type="number"
                  defaultValue={level.points}
                  onChange={(event) =>
                    setFormMap((prev) => ({
                      ...prev,
                      [level.id]: { ...prev[level.id], points: Number(event.target.value) },
                    }))
                  }
                />
                <Input
                  defaultValue={level.videoUrl}
                  onChange={(event) =>
                    setFormMap((prev) => ({
                      ...prev,
                      [level.id]: { ...prev[level.id], videoUrl: event.target.value },
                    }))
                  }
                />
                <Button onClick={() => updateLevel.mutate({ id: level.id, payload: { ...local } })}>Guardar</Button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">Records pendientes</h2>
        <div className="space-y-2">
          {records.map((record) => (
            <div key={record.id} className="gradient-card flex flex-wrap items-center justify-between gap-3 rounded-lg p-3">
              <div>
                <p className="font-semibold text-white">
                  {record.playerName} • {record.levelName}
                </p>
                <a href={record.videoUrl} target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-white">
                  Ver evidencia
                </a>
              </div>
              <Button onClick={() => approveRecord.mutate(record.id)}>Aprobar + Confetti</Button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
