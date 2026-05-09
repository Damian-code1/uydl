"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import confetti from "canvas-confetti";
import { Settings, Plus, List } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"manage" | "add" | "settings">("manage");
  const [newLevelForm, setNewLevelForm] = useState<Partial<LevelAdmin>>({});

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
    return (
      <main className="admin-page">
        <div className="admin-shell">
          <div className="admin-topbar">
            <h1>Admin Panel</h1>
          </div>
          <p style={{ color: "var(--muted)" }}>Cargando...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-shell">
        {/* Admin Topbar */}
        <div className="admin-topbar">
          <div>
            <h1>Admin Panel</h1>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginTop: "4px" }}>
              Gestiona niveles, registros y configuración
            </p>
          </div>
          <div className="admin-top-actions">
            <button className="button button--primary">
              <Settings size={16} />
              Sistema
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            onClick={() => setActiveTab("manage")}
            className={`tab-btn ${activeTab === "manage" ? "active" : ""}`}
          >
            <List size={16} />
            Manage Levels
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`tab-btn ${activeTab === "add" ? "active" : ""}`}
          >
            <Plus size={16} />
            Add New Level
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
          >
            <Settings size={16} />
            Settings
          </button>
        </div>

        {/* Tab: Manage Levels */}
        <div className={`tab-panel ${activeTab === "manage" ? "active" : ""}`}>
          <div className="panel-head">
            <h2>Manage Levels</h2>
            <p style={{ color: "var(--muted)" }}>
              Total: {levels.length} niveles
            </p>
          </div>

          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Creator</th>
                  <th>Points</th>
                  <th>Video</th>
                  <th style={{ width: "120px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {levels.map((level) => {
                  const local = formMap[level.id] ?? {};
                  return (
                    <tr key={level.id}>
                      <td>
                        <input
                          type="number"
                          defaultValue={level.rank}
                          onChange={(e) =>
                            setFormMap((prev) => ({
                              ...prev,
                              [level.id]: { ...prev[level.id], rank: Number(e.target.value) },
                            }))
                          }
                          style={{
                            width: "60px",
                            padding: "8px",
                            borderRadius: "8px",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            background: "rgba(255, 255, 255, 0.04)",
                            color: "var(--text)",
                          }}
                        />
                      </td>
                      <td>
                        <span>{local.name || level.name}</span>
                      </td>
                      <td>
                        <span>{local.creator || level.creator}</span>
                      </td>
                      <td>
                        <span>{local.points || level.points}</span>
                      </td>
                      <td>
                        <a
                          href={level.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="button mini-btn"
                        >
                          Watch
                        </a>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="mini-btn"
                            onClick={() =>
                              updateLevel.mutate({
                                id: level.id,
                                payload: local,
                              })
                            }
                            disabled={updateLevel.isPending}
                          >
                            Save
                          </button>
                          <button className="mini-btn danger">Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pending Records Section */}
          <div style={{ marginTop: "40px" }}>
            <h3>Pending Records for Approval ({records.length})</h3>
            <div className="table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Level</th>
                    <th>Video Proof</th>
                    <th style={{ width: "140px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id}>
                      <td>{record.playerName}</td>
                      <td>{record.levelName}</td>
                      <td>
                        <a
                          href={record.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="button mini-btn"
                        >
                          View
                        </a>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="mini-btn button--primary"
                            onClick={() => approveRecord.mutate(record.id)}
                            disabled={approveRecord.isPending}
                          >
                            Approve
                          </button>
                          <button className="mini-btn danger">Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tab: Add New Level */}
        <div className={`tab-panel ${activeTab === "add" ? "active" : ""}`}>
          <div className="panel-head">
            <h2>Add New Level</h2>
          </div>

          <form className="admin-form admin-form--grid">
            <div>
              <label>Level Name *</label>
              <input
                type="text"
                placeholder="e.g., Sonic Wave"
                value={newLevelForm.name || ""}
                onChange={(e) =>
                  setNewLevelForm({ ...newLevelForm, name: e.target.value })
                }
              />
            </div>

            <div>
              <label>Creator *</label>
              <input
                type="text"
                placeholder="e.g., Cyclic"
                value={newLevelForm.creator || ""}
                onChange={(e) =>
                  setNewLevelForm({ ...newLevelForm, creator: e.target.value })
                }
              />
            </div>

            <div>
              <label>Video URL *</label>
              <input
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={newLevelForm.videoUrl || ""}
                onChange={(e) =>
                  setNewLevelForm({ ...newLevelForm, videoUrl: e.target.value })
                }
              />
            </div>

            <div>
              <label>Rank Position *</label>
              <input
                type="number"
                placeholder="1"
                value={newLevelForm.rank || ""}
                onChange={(e) =>
                  setNewLevelForm({ ...newLevelForm, rank: Number(e.target.value) })
                }
              />
            </div>

            <div>
              <label>Points *</label>
              <input
                type="number"
                placeholder="100"
                value={newLevelForm.points || ""}
                onChange={(e) =>
                  setNewLevelForm({ ...newLevelForm, points: Number(e.target.value) })
                }
              />
            </div>

            <div className="full">
              <label>Description</label>
              <textarea
                placeholder="Brief level description..."
                value={newLevelForm.description || ""}
                onChange={(e) =>
                  setNewLevelForm({ ...newLevelForm, description: e.target.value })
                }
              />
            </div>

            <div className="form-actions full">
              <button type="submit" className="button button--primary">
                <Plus size={16} />
                Create Level
              </button>
              <button
                type="button"
                className="button"
                onClick={() => setNewLevelForm({})}
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Tab: Settings */}
        <div className={`tab-panel ${activeTab === "settings" ? "active" : ""}`}>
          <div className="panel-head">
            <h2>Admin Settings</h2>
          </div>

          <form className="admin-form">
            <div>
              <label>Site Title</label>
              <input type="text" defaultValue="Uruguay Demon List" />
            </div>

            <div>
              <label>Description</label>
              <textarea defaultValue="Official list of demons, hardests, and victors in Uruguay." />
            </div>

            <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <h3 style={{ marginBottom: "10px" }}>Danger Zone</h3>
              <button type="button" className="button button--danger">
                Reset Database
              </button>
            </div>

            <div className="form-actions" style={{ marginTop: "30px" }}>
              <button type="submit" className="button button--primary">
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
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
