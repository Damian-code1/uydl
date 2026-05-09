"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerSchema } from "@/lib/validators";

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [serverMessage, setServerMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  async function onSubmit(values: RegisterValues) {
    setServerMessage("");
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json();
    if (!response.ok) {
      setServerMessage(data.error ?? "No se pudo registrar");
      return;
    }

    setServerMessage("Registro exitoso. Revisa tu correo para confirmación.");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="gradient-card w-full space-y-4 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-white">Crear cuenta</h1>

        <div>
          <Input placeholder="Email" type="email" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>}
        </div>

        <div>
          <Input placeholder="Discord (usuario#0000)" {...register("discord")} />
          {errors.discord && <p className="mt-1 text-xs text-rose-400">{errors.discord.message}</p>}
        </div>

        <div>
          <Input placeholder="Password" type="password" {...register("password")} />
          {errors.password && <p className="mt-1 text-xs text-rose-400">{errors.password.message}</p>}
        </div>

        {serverMessage && <p className="text-sm text-slate-200">{serverMessage}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Registrando..." : "Registrarse"}
        </Button>
      </form>
    </main>
  );
}
