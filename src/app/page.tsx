import { Swords } from "lucide-react";
import { DemonList } from "@/components/list/DemonList";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-10 sm:px-8">
      <header className="mb-8 flex items-center justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
            <Swords className="h-3.5 w-3.5" />
            Uruguay Demon List
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">UYDL</h1>
          <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
            Ranking oficial inspirado en Pointercrate con enfoque premium, animaciones fluidas y moderación profesional.
          </p>
        </div>
      </header>
      <DemonList />
    </main>
  );
}
