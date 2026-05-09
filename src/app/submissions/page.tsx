"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { submissionSchema } from "@/lib/validators";

type SubmissionValues = z.infer<typeof submissionSchema>;

async function getLevels() {
  const response = await fetch("/api/levels", { cache: "no-store" });
  if (!response.ok) throw new Error("No se pudieron cargar niveles");
  return response.json() as Promise<Array<{ id: string; rank: number; name: string }>>;
}

export default function SubmissionsPage() {
  const [message, setMessage] = useState("");
  const { data: levels = [] } = useQuery({ queryKey: ["levels-min"], queryFn: getLevels });

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SubmissionValues>({
    resolver: zodResolver(submissionSchema),
    mode: "onChange",
  });

  const selectedLevel = watch("levelId");

  async function onSubmit(values: SubmissionValues) {
    setMessage("");
    const response = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error ?? "No se pudo enviar");
      return;
    }
    setMessage("Submission enviada. Quedó en estado Pending.");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-10">
      <form onSubmit={handleSubmit(onSubmit)} className="gradient-card w-full space-y-5 rounded-2xl p-6 sm:p-8">
        <h1 className="text-3xl font-black text-white">Enviar Record</h1>
        <p className="text-sm text-slate-300">Completa todos los campos. La validación es en tiempo real.</p>

        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Nivel</label>
          <Select value={selectedLevel} onValueChange={(value) => setValue("levelId", value, { shouldValidate: true })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un nivel" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((level) => (
                <SelectItem key={level.id} value={level.id}>
                  #{level.rank} - {level.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.levelId && <p className="mt-1 text-xs text-rose-400">{errors.levelId.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Jugador</label>
            <Input placeholder="Nombre del jugador" {...register("playerName")} />
            {errors.playerName && <p className="mt-1 text-xs text-rose-400">{errors.playerName.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Video principal</label>
            <Input placeholder="https://youtube.com/..." {...register("videoUrl")} />
            {errors.videoUrl && <p className="mt-1 text-xs text-rose-400">{errors.videoUrl.message}</p>}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Raw footage</label>
          <Input placeholder="https://drive.google.com/..." {...register("rawFootage")} />
          {errors.rawFootage && <p className="mt-1 text-xs text-rose-400">{errors.rawFootage.message}</p>}
        </div>

        {message && <p className="text-sm text-slate-200">{message}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? "Enviando..." : "Enviar Submission"}
        </Button>
      </form>
    </main>
  );
}
