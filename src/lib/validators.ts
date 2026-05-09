import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  discord: z.string().min(2, "Discord requerido"),
});

export const submissionSchema = z.object({
  levelId: z.string().min(1, "Selecciona un nivel"),
  playerName: z.string().min(2, "Nombre de jugador requerido"),
  videoUrl: z.string().url("Video URL inválida"),
  rawFootage: z.string().url("Raw footage URL inválida"),
});

export const levelEditSchema = z.object({
  rank: z.number().int().min(1).max(75),
  name: z.string().min(2),
  creator: z.string().min(2),
  videoUrl: z.string().url(),
  description: z.string().min(8),
  points: z.number().int().min(1).max(500),
});

export const levelReorderSchema = z.object({
  newRank: z.number().int().min(1).max(75),
});
