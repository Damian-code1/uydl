"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const response = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (response?.error) {
      setError("Credenciales inválidas");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <form onSubmit={onSubmit} className="gradient-card w-full space-y-4 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-white">Iniciar sesión</h1>
        <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" type="email" required />
        <Input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          type="password"
          required
        />
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <div className="flex gap-2">
          <Button type="submit" className="w-full">
            Entrar
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={() => signIn("discord", { callbackUrl: "/" })}>
            Discord
          </Button>
        </div>
      </form>
    </main>
  );
}
