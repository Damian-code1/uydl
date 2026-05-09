"use client";

import { useState } from "react";
import { ChevronDown, Play, Users, Clock, Trophy, SquarePlay } from "lucide-react";
import Link from "next/link";

export type DemonLevel = {
  id: string;
  rank: number;
  name: string;
  creator: string;
  videoUrl: string;
  description: string;
  points: number;
  difficulty: "EASY" | "NORMAL" | "HARD" | "INSANE" | "EXTREME";
  durationSeconds: number;
  recordRequirement: string;
  thumbnailUrl?: string;
  victors: Array<{
    id: string;
    playerName: string;
    recordedAt: string;
    proofUrl: string;
  }>;
};

function getDifficultyClass(difficulty: string): string {
  const map: Record<string, string> = {
    EASY: "card-accent-achievements",
    NORMAL: "card-accent-pointercrate",
    HARD: "card-accent-aredl",
    INSANE: "card-accent-aredl",
    EXTREME: "card-accent-hardests",
  };
  return map[difficulty] || "card-accent-pointercrate";
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  return `${mins}m`;
}

interface LevelCardProps {
  level: DemonLevel;
  index: number;
}

export function LevelCard({ level, index }: LevelCardProps) {
  const [isVictorsOpen, setIsVictorsOpen] = useState(false);
  const difficultyClass = getDifficultyClass(level.difficulty);

  return (
    <article className={`list-card ${difficultyClass}`}>
      {/* Thumbnail */}
      {level.thumbnailUrl && (
        <div className="list-card__thumb">
          <img
            src={level.thumbnailUrl}
            alt={level.name}
            className="is-loaded"
            loading="lazy"
          />
        </div>
      )}

      {/* Title */}
      <h4>{level.name}</h4>

      {/* Meta Info */}
      <div className="list-card__meta">
        <div>
          <p className="list-card__eyebrow">Difficulty</p>
          <div className="list-card__badge">{level.difficulty}</div>
        </div>
        <div>
          <p className="list-card__subtitle">Rank #{level.rank}</p>
        </div>
      </div>

      {/* Creator */}
      <div className="list-card__meta">
        <div>
          <p className="list-card__eyebrow">Creator</p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {level.creator}
          </p>
        </div>
      </div>

      {/* Description */}
      <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "12px" }}>
        {level.description}
      </p>

      {/* Stats List */}
      <ul className="list-card__list">
        <li>
          <strong>Duration:</strong> {formatDuration(level.durationSeconds)}
        </li>
        <li>
          <strong>Record Requirement:</strong> {level.recordRequirement}
        </li>
        <li>
          <strong>Points:</strong> {level.points}
        </li>
      </ul>

      {/* Victors Section */}
      {level.victors && level.victors.length > 0 && (
        <div className="list-card__victors">
          <div
            className="list-card__victors-title"
            onClick={() => setIsVictorsOpen(!isVictorsOpen)}
            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
          >
            Victors ({level.victors.length})
            <ChevronDown
              size={14}
              style={{
                transform: isVictorsOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 200ms ease",
              }}
            />
          </div>

          {isVictorsOpen && (
            <div className="victor-chips">
              {level.victors.slice(0, 5).map((victor, idx) => (
                <a
                  key={idx}
                  href={victor.proofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="victor-chip"
                >
                  <span>{victor.playerName}</span>
                  <span className="victor-chip__num">{idx + 1}</span>
                </a>
              ))}
              {level.victors.length > 5 && (
                <span className="victor-chip" style={{ pointerEvents: "none", opacity: 0.6 }}>
                  +{level.victors.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      <Link href={`/levels/${level.id}`} className="completion-btn">
        <SquarePlay size={16} />
        View Details
      </Link>
    </article>
  );
}
