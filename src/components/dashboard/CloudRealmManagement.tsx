"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Cloud,
  Copy,
  Edit3,
  ExternalLink,
  Gamepad2,
  Loader2,
  Lock,
  Trash2,
  Unlock,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { PersistedRealm, RealmGenre, RealmMood, RealmVisualStyle } from "@/types";

const genres: RealmGenre[] = ["trap", "rage", "drill", "ambient", "electronic", "hyperpop", "experimental", "boom bap", "other"];
const moods: RealmMood[] = ["dark", "aggressive", "sad", "dreamy", "futuristic", "underground", "cinematic", "weird"];
const styles: RealmVisualStyle[] = ["glitch", "dark", "rage", "dreamy", "minimal"];

export function CloudRealmManagement() {
  const { user, accessToken, isCloudConfigured } = useAuth();
  const [realms, setRealms] = useState<PersistedRealm[]>([]);
  const [loading, setLoading] = useState(
    () => !!(isCloudConfigured && user && accessToken),
  );
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const loadRealms = useCallback(async () => {
    if (!isCloudConfigured || !user || !accessToken) return;
    setLoading(true);
    try {
      const response = await fetch("/api/cloud/realms", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        const data = (await response.json()) as { realms: PersistedRealm[] };
        setRealms((data.realms ?? []).filter((r) => r.ownerId === user?.id));
      }
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  }, [isCloudConfigured, user, accessToken]);

  useEffect(() => {
    requestAnimationFrame(() => {
      void loadRealms();
    });
  }, [loadRealms]);

  if (!isCloudConfigured || !user) return null;

  if (loading) {
    return (
      <div className="mt-10 border border-[#21f7ff]/20 bg-black/35 p-5">
        <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-zinc-500 animate-pulse">
          Loading cloud Realms...
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="flex items-center gap-2">
        <Cloud size={16} className="text-[#21f7ff]" />
        <h2 className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#21f7ff]">
          Cloud Realms
        </h2>
        <span className="font-mono text-[10px] text-zinc-500">({realms.length})</span>
      </div>

      {realms.length === 0 ? (
        <div className="mt-4 border border-dashed border-[#21f7ff]/20 bg-black/20 p-5">
          <p className="text-sm text-zinc-400">
            No cloud Realms yet. Create your first cloud-backed Realm to see it here.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid gap-4">
          {realms.map((realm) => (
            <CloudRealmCard
              key={realm.id}
              realm={realm}
              accessToken={accessToken!}
              isEditing={editingSlug === realm.slug}
              isDeleting={deletingSlug === realm.slug}
              onEdit={() => setEditingSlug(editingSlug === realm.slug ? null : realm.slug)}
              onDelete={() => setDeletingSlug(deletingSlug === realm.slug ? null : realm.slug)}
              onUpdated={(updated) => {
                setRealms((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
                setEditingSlug(null);
              }}
              onDeleted={(id) => {
                setRealms((prev) => prev.filter((r) => r.id !== id));
                setDeletingSlug(null);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type CloudRealmCardProps = {
  realm: PersistedRealm;
  accessToken: string;
  isEditing: boolean;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onUpdated: (realm: PersistedRealm) => void;
  onDeleted: (id: string) => void;
};

function CloudRealmCard({
  realm,
  accessToken,
  isEditing,
  isDeleting,
  onEdit,
  onDelete,
  onUpdated,
  onDeleted,
}: CloudRealmCardProps) {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState(realm.title);
  const [editGenre, setEditGenre] = useState(realm.genre);
  const [editMood, setEditMood] = useState(realm.mood);
  const [editBpm, setEditBpm] = useState(String(realm.bpm ?? ""));
  const [editStyle, setEditStyle] = useState(realm.visualStyle);
  const [editDesc, setEditDesc] = useState(realm.description ?? "");
  const [editPublic, setEditPublic] = useState(realm.isPublic !== false);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/cloud/realms/${realm.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: editTitle,
          genre: editGenre,
          mood: editMood,
          bpm: editBpm ? Number(editBpm) : null,
          visualStyle: editStyle,
          description: editDesc || null,
          isPublic: editPublic,
        }),
      });
      if (response.ok) {
        const data = (await response.json()) as { realm: PersistedRealm };
        onUpdated(data.realm);
      } else {
        const err = (await response.json()) as { error: string };
        setError(err.error ?? "Failed to update.");
      }
    } catch {
      setError("Failed to update.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      const response = await fetch(`/api/cloud/realms/${realm.slug}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        onDeleted(realm.id);
      } else {
        const err = (await response.json()) as { error: string };
        setError(err.error ?? "Failed to delete.");
      }
    } catch {
      setError("Failed to delete.");
    } finally {
      setDeleting(false);
    }
  }

  function handleCopyLink() {
    const url = `${window.location.origin}/realm/${realm.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  }

  return (
    <div className="border border-white/10 bg-[#101012]/80 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-lg font-black uppercase text-white">{realm.title}</h3>
            {realm.isPublic !== false ? (
              <Unlock size={13} className="shrink-0 text-[#b7ff2a]" aria-label="Public" />
            ) : (
              <Lock size={13} className="shrink-0 text-zinc-500" aria-label="Private" />
            )}
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-zinc-400">
            {realm.producerName} · {realm.genre} · {realm.mood} · {realm.visualStyle}
          </p>
          <p className="mt-1 font-mono text-[10px] text-zinc-600">
            Created {new Date(realm.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <a
            href={`/realm/${realm.slug}`}
            className="inline-flex items-center gap-1 border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.12em] text-zinc-300 transition hover:border-[#21f7ff]/50"
          >
            <ExternalLink size={12} /> Open
          </a>
          <a
            href={`/realm/${realm.slug}/fight`}
            className="inline-flex items-center gap-1 border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.12em] text-zinc-300 transition hover:border-[#ff2a6d]/50"
          >
            <Gamepad2 size={12} /> Fight
          </a>
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1 border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.12em] text-zinc-300 transition hover:border-[#21f7ff]/50"
          >
            <Copy size={12} /> {copied ? "Copied" : "Link"}
          </button>
          <button
            type="button"
            onClick={onEdit}
            className={`inline-flex items-center gap-1 border px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.12em] transition ${
              isEditing
                ? "border-[#b7ff2a]/50 bg-[#b7ff2a]/10 text-[#b7ff2a]"
                : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-[#b7ff2a]/50"
            }`}
          >
            <Edit3 size={12} /> Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className={`inline-flex items-center gap-1 border px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.12em] transition ${
              isDeleting
                ? "border-[#ff2a6d]/50 bg-[#ff2a6d]/10 text-[#ff2a6d]"
                : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-[#ff2a6d]/50"
            }`}
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </div>

      {error ? (
        <p className="mt-3 border border-[#ff2a6d]/30 bg-[#ff2a6d]/5 px-3 py-2 text-xs text-[#ff2a6d]">
          {error}
        </p>
      ) : null}

      {/* Delete Confirmation */}
      {isDeleting ? (
        <div className="mt-4 border border-[#ff2a6d]/30 bg-[#ff2a6d]/5 p-4">
          <p className="text-sm text-white">
            Delete <strong>{realm.title}</strong>? This removes the cloud metadata and storage files. Cannot be undone.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1 border border-[#ff2a6d]/70 bg-[#ff2a6d] px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#ff2a6d]/80 disabled:opacity-50"
            >
              {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
              {deleting ? "Deleting..." : "Confirm Delete"}
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-1 border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.12em] text-zinc-300"
            >
              <X size={12} /> Cancel
            </button>
          </div>
        </div>
      ) : null}

      {/* Edit Form */}
      {isEditing ? (
        <div className="mt-4 border border-[#b7ff2a]/20 bg-black/30 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="mt-1 w-full border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#21f7ff]"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">BPM</label>
              <input
                type="number"
                value={editBpm}
                onChange={(e) => setEditBpm(e.target.value)}
                className="mt-1 w-full border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#21f7ff]"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">Genre</label>
              <select value={editGenre} onChange={(e) => setEditGenre(e.target.value as RealmGenre)} className="mt-1 w-full border border-white/10 bg-black/90 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#21f7ff]">
                {genres.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">Mood</label>
              <select value={editMood} onChange={(e) => setEditMood(e.target.value as RealmMood)} className="mt-1 w-full border border-white/10 bg-black/90 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#21f7ff]">
                {moods.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">Style</label>
              <select value={editStyle} onChange={(e) => setEditStyle(e.target.value as RealmVisualStyle)} className="mt-1 w-full border border-white/10 bg-black/90 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#21f7ff]">
                {styles.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <label className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">Public</label>
              <button
                type="button"
                onClick={() => setEditPublic(!editPublic)}
                className={`inline-flex items-center gap-1 border px-3 py-1.5 font-mono text-[10px] font-black uppercase ${
                  editPublic
                    ? "border-[#b7ff2a]/50 bg-[#b7ff2a]/10 text-[#b7ff2a]"
                    : "border-zinc-600 bg-black/20 text-zinc-500"
                }`}
              >
                {editPublic ? <Unlock size={11} /> : <Lock size={11} />}
                {editPublic ? "Public" : "Private"}
              </button>
            </div>
          </div>
          <div className="mt-3">
            <label className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">Description</label>
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              rows={2}
              className="mt-1 w-full resize-none border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#21f7ff]"
            />
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1 border border-[#b7ff2a]/70 bg-[#b7ff2a] px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.12em] text-black transition hover:bg-white disabled:opacity-50"
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Edit3 size={12} />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-1 border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.12em] text-zinc-300"
            >
              <X size={12} /> Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
