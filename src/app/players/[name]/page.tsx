import { prisma } from "@/lib/prisma";

export default async function PlayerProfilePage({ params }: { params: { name: string } }) {
  const decodedName = decodeURIComponent(params.name);
  const records = await prisma.record.findMany({
    where: {
      playerName: decodedName,
      status: "APPROVED",
    },
    include: {
      level: true,
    },
    orderBy: {
      timestamp: "desc",
    },
  });

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10">
      <section className="gradient-card rounded-xl p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Player Profile</p>
        <h1 className="mt-1 text-3xl font-black text-white">{decodedName}</h1>
        <p className="mt-2 text-sm text-slate-300">Records aprobados: {records.length}</p>

        <div className="mt-5 space-y-2">
          {records.map((record) => (
            <div key={record.id} className="rounded-md border border-white/10 bg-black/20 p-3">
              <p className="font-semibold text-white">
                #{record.level.rank} - {record.level.name}
              </p>
              <a href={record.videoUrl} target="_blank" rel="noreferrer" className="text-xs text-slate-300 hover:text-white">
                Ver video
              </a>
            </div>
          ))}
          {!records.length && <p className="text-sm text-slate-400">Sin records aprobados todavía.</p>}
        </div>
      </section>
    </main>
  );
}
