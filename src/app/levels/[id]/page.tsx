import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Play, Users, Clock, Target, User } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

function extractYouTubeId(url: string) {
  const regex =
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

async function getLevel(id: string) {
  try {
    const level = await prisma.level.findUnique({
      where: { id },
      include: {
        records: {
          where: { status: "APPROVED" },
          select: {
            id: true,
            playerName: true,
            proofUrl: true,
            recordedAt: true,
          },
          orderBy: { recordedAt: "desc" },
        },
      },
    });

    return level;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  const level = await getLevel(params.id);

  if (!level) {
    return { title: "Level not found" };
  }

  return {
    title: `${level.name} - UYDL`,
    description: `Demon list level ranked #${level.rank}. Created by ${level.creator}.`,
  };
}

export default async function LevelPage({
  params,
}: {
  params: { id: string };
}) {
  const level = await getLevel(params.id);

  if (!level) {
    notFound();
  }

  const youtubeId = extractYouTubeId(level.videoUrl);

  const difficultyColors: Record<
    string,
    { text: string; bg: string; border: string }
  > = {
    EASY: {
      text: "text-green-100",
      bg: "bg-green-500/20",
      border: "border-green-500/50",
    },
    NORMAL: {
      text: "text-blue-100",
      bg: "bg-blue-500/20",
      border: "border-blue-500/50",
    },
    HARD: {
      text: "text-purple-100",
      bg: "bg-purple-500/20",
      border: "border-purple-500/50",
    },
    INSANE: {
      text: "text-pink-100",
      bg: "bg-pink-500/20",
      border: "border-pink-500/50",
    },
    EXTREME: {
      text: "text-red-100",
      bg: "bg-red-500/20",
      border: "border-red-500/50",
    },
  };

  const diffColors = difficultyColors[level.difficulty] || difficultyColors.EXTREME;

  return (
    <main className="min-h-screen w-full bg-[#0a0a0a] py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        {/* Header */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-6 text-sm text-slate-400 hover:text-white transition-colors"
        >
          ← Back to List
        </Link>

        {/* Title Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider border ${diffColors.bg} ${diffColors.border} ${diffColors.text}`}>
                  {level.difficulty}
                </span>
                <span className="text-3xl font-black text-white">#{level.rank}</span>
              </div>
              <h1 className="text-5xl font-black text-white mb-2">
                {level.name}
              </h1>
              <p className="text-lg text-slate-300">By {level.creator}</p>
            </div>
          </div>
          <p className="text-slate-400 max-w-2xl">{level.description}</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Video + Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* YouTube Player */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl"
            >
              {youtubeId ? (
                <iframe
                  width="100%"
                  height="400"
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title="Level Verification"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full"
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">Video not available</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Technical Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="grid grid-cols-2 gap-4 sm:grid-cols-4"
            >
              {[
                {
                  icon: Target,
                  label: "Record Requirement",
                  value: level.recordRequirement,
                },
                {
                  icon: Clock,
                  label: "Estimated Duration",
                  value: `${Math.floor(level.durationSeconds / 60)}m`,
                },
                { icon: Users, label: "Total Records", value: level.records.length.toString() },
                {
                  icon: User,
                  label: "Difficulty Points",
                  value: `${level.points} pts`,
                },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 + idx * 0.05 }}
                  className="rounded-lg border border-white/10 bg-gradient-to-br from-white/5 to-white/2 p-4"
                >
                  <stat.icon className="w-5 h-5 text-slate-400 mb-2" />
                  <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Victors List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm p-6 h-fit"
          >
            <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Verified Records ({level.records.length})
            </h2>

            {level.records.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pr-2">
                {level.records.map((record, idx) => (
                  <motion.a
                    key={record.id}
                    href={record.proofUrl}
                    target="_blank"
                    rel="noreferrer"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + idx * 0.05 }}
                    className="group flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/20 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xs font-bold text-black flex-shrink-0">
                      {idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
                        {record.playerName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(record.recordedAt).toLocaleDateString("es-UY", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-4 h-4 text-slate-400 group-hover:text-white" />
                    </div>
                  </motion.a>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No verified records yet</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Submit Record CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link
            href="/submissions"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold transition-all hover:shadow-lg hover:shadow-red-500/50"
          >
            <Play className="w-5 h-5" />
            Submit Your Record
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
