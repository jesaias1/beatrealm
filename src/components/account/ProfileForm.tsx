"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Loader2, Save, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { validateUsername } from "@/lib/profiles/username";

type ProfileData = {
  username: string;
  displayName: string;
  bio: string;
};

export function ProfileForm() {
  const { user, accessToken, isCloudConfigured } = useAuth();
  const [form, setForm] = useState<ProfileData>({ username: "", displayName: "", bio: "" });
  const [original, setOriginal] = useState<ProfileData>({ username: "", displayName: "", bio: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!isCloudConfigured || !user || !accessToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/cloud/profile", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        const data = (await response.json()) as {
          profile: { username: string | null; display_name: string | null; bio: string | null };
        };
        const profile = {
          username: data.profile.username ?? "",
          displayName: data.profile.display_name ?? "",
          bio: data.profile.bio ?? "",
        };
        setForm(profile);
        setOriginal(profile);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [isCloudConfigured, user, accessToken]);

  useEffect(() => {
    requestAnimationFrame(() => {
      void loadProfile();
    });
  }, [loadProfile]);

  function handleUsernameChange(value: string) {
    const lower = value.toLowerCase().replace(/\s/g, "");
    setForm((prev) => ({ ...prev, username: lower }));
    if (lower) {
      const validation = validateUsername(lower);
      setUsernameError(validation.valid ? null : (validation.error ?? null));
    } else {
      setUsernameError(null);
    }
    setStatus(null);
  }

  function handleChange(field: keyof ProfileData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setStatus(null);
  }

  const isDirty =
    form.username !== original.username ||
    form.displayName !== original.displayName ||
    form.bio !== original.bio;

  async function handleSave() {
    if (!accessToken || !isDirty) return;

    // Client-side validation
    if (form.username) {
      const validation = validateUsername(form.username);
      if (!validation.valid) {
        setUsernameError(validation.error ?? null);
        return;
      }
    }

    setSaving(true);
    setStatus(null);

    try {
      const body: Record<string, string> = {};
      if (form.username !== original.username) body.username = form.username;
      if (form.displayName !== original.displayName) body.displayName = form.displayName;
      if (form.bio !== original.bio) body.bio = form.bio;

      const response = await fetch("/api/cloud/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = (await response.json()) as {
          profile: { username: string | null; display_name: string | null; bio: string | null };
        };
        const updated = {
          username: data.profile.username ?? "",
          displayName: data.profile.display_name ?? "",
          bio: data.profile.bio ?? "",
        };
        setForm(updated);
        setOriginal(updated);
        setStatus({ type: "success", message: "Profile updated." });
        setUsernameError(null);
      } else {
        const errorData = (await response.json()) as { error: string };
        if (errorData.error?.toLowerCase().includes("username")) {
          setUsernameError(errorData.error);
        }
        setStatus({ type: "error", message: errorData.error ?? "Failed to update profile." });
      }
    } catch {
      setStatus({ type: "error", message: "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="border border-white/10 bg-[#101012]/82 p-6 glow-border">
        <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-zinc-500 animate-pulse">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="border border-white/10 bg-[#101012]/82 p-6 glow-border">
      <div className="flex items-center gap-2">
        <User size={16} className="text-[#b7ff2a]" />
        <h2 className="font-mono text-xs font-black uppercase tracking-[0.18em] text-[#b7ff2a]">
          Profile Settings
        </h2>
      </div>

      <div className="mt-5 grid gap-5">
        {/* Email (read-only) */}
        <div>
          <label className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500">
            Email
          </label>
          <p className="mt-1 border border-white/5 bg-black/30 px-3 py-2.5 text-sm text-zinc-400">
            {user?.email ?? "—"}
          </p>
        </div>

        {/* Username */}
        <div>
          <label
            htmlFor="profile-username"
            className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500"
          >
            Username
          </label>
          <input
            id="profile-username"
            type="text"
            value={form.username}
            onChange={(event) => handleUsernameChange(event.target.value)}
            maxLength={24}
            placeholder="your-username"
            className={`mt-1 w-full border bg-black/30 px-3 py-2.5 font-mono text-sm text-white placeholder-zinc-600 outline-none transition focus:ring-2 focus:ring-[#21f7ff] ${
              usernameError ? "border-[#ff2a6d]/60" : "border-white/10"
            }`}
          />
          {usernameError ? (
            <p className="mt-1 text-xs text-[#ff2a6d]">{usernameError}</p>
          ) : form.username ? (
            <p className="mt-1 text-xs text-zinc-500">
              Profile URL: /producer/{form.username}
            </p>
          ) : (
            <p className="mt-1 text-xs text-zinc-600">
              3–24 chars. Letters, numbers, hyphens, underscores.
            </p>
          )}
        </div>

        {/* Display Name */}
        <div>
          <label
            htmlFor="profile-displayname"
            className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500"
          >
            Display Name
          </label>
          <input
            id="profile-displayname"
            type="text"
            value={form.displayName}
            onChange={(event) => handleChange("displayName", event.target.value)}
            maxLength={60}
            placeholder="Your Name"
            className="mt-1 w-full border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:ring-2 focus:ring-[#21f7ff]"
          />
        </div>

        {/* Bio */}
        <div>
          <label
            htmlFor="profile-bio"
            className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500"
          >
            Bio
          </label>
          <textarea
            id="profile-bio"
            value={form.bio}
            onChange={(event) => handleChange("bio", event.target.value)}
            maxLength={300}
            rows={3}
            placeholder="A short bio about you..."
            className="mt-1 w-full resize-none border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:ring-2 focus:ring-[#21f7ff]"
          />
          <p className="mt-1 text-right text-xs text-zinc-600">{form.bio.length}/300</p>
        </div>
      </div>

      {/* Status */}
      {status ? (
        <div
          className={`mt-4 border px-3 py-2 text-sm ${
            status.type === "success"
              ? "border-[#b7ff2a]/30 bg-[#b7ff2a]/10 text-[#b7ff2a]"
              : "border-[#ff2a6d]/30 bg-[#ff2a6d]/10 text-[#ff2a6d]"
          }`}
        >
          <div className="flex items-center gap-2">
            {status.type === "success" ? <Check size={14} /> : null}
            {status.message}
          </div>
        </div>
      ) : null}

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving || !isDirty || Boolean(usernameError)}
        className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 border border-[#b7ff2a]/70 bg-[#b7ff2a] px-5 py-3 font-mono text-xs font-black uppercase tracking-[0.14em] text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#21f7ff]"
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}
