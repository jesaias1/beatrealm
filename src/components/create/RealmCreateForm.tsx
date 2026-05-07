"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Cloud, HardDrive } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { initialRealmDraft } from "@/lib/realms/createOptions";
import { validateAudioFile, validateCoverFile } from "@/lib/realms/fileValidation";
import type { RealmDraft } from "@/types";
import { CoverPlaceholderSelector } from "./CoverPlaceholderSelector";
import { FileUploadPanel } from "./FileUploadPanel";
import { GenreSelector } from "./GenreSelector";
import { MoodSelector } from "./MoodSelector";
import { RealmLivePreview } from "./RealmLivePreview";
import { VisualStyleSelector } from "./VisualStyleSelector";

type ValidationErrors = Partial<
  Record<"title" | "producerName" | "audioFile" | "coverFile" | "submit", string>
>;

type CreateMode = "local" | "cloud";

function labelClass() {
  return "font-mono text-xs font-black uppercase tracking-[0.16em] text-zinc-300";
}

function inputClass(hasError = false) {
  return `mt-2 h-12 w-full border bg-black/45 px-4 text-white placeholder:text-zinc-600 outline-none transition focus:ring-2 focus:ring-[#21f7ff] ${
    hasError ? "border-[#ff2a6d]" : "border-white/10 focus:border-[#21f7ff]"
  }`;
}

export function RealmCreateForm() {
  const router = useRouter();
  const { user, accessToken, isCloudConfigured } = useAuth();
  const [draft, setDraft] = useState<RealmDraft>(initialRealmDraft);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string>();
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createMode, setCreateMode] = useState<CreateMode>(
    isCloudConfigured && user ? "cloud" : "local",
  );

  // Update create mode when auth state changes
  useEffect(() => {
    if (isCloudConfigured && user && createMode === "local") {
      setCreateMode("cloud");
    }
  }, [isCloudConfigured, user, createMode]);

  useEffect(() => {
    if (!coverFile) {
      setCoverPreviewUrl(undefined);
      return;
    }

    const nextUrl = URL.createObjectURL(coverFile);
    setCoverPreviewUrl(nextUrl);

    return () => URL.revokeObjectURL(nextUrl);
  }, [coverFile]);

  function updateDraft<Key extends keyof RealmDraft>(
    key: Key,
    value: RealmDraft[Key],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
    if (key === "title" || key === "producerName") {
      setErrors((current) => ({ ...current, [key]: undefined }));
    }
    setSuccess(false);
  }

  function handleAudioChange(file: File | null) {
    setAudioFile(file);
    setSuccess(false);
    setErrors((current) => ({
      ...current,
      audioFile: file ? validateAudioFile(file) ?? undefined : undefined,
      submit: undefined,
    }));
  }

  function handleCoverChange(file: File | null) {
    setCoverFile(file);
    setSuccess(false);
    setErrors((current) => ({
      ...current,
      coverFile: file ? validateCoverFile(file) ?? undefined : undefined,
      submit: undefined,
    }));
  }

  function validateDraft() {
    const nextErrors: ValidationErrors = {};
    if (!draft.title.trim()) {
      nextErrors.title = "Give this Realm a title.";
    }
    if (!draft.producerName.trim()) {
      nextErrors.producerName = "Add the producer name.";
    }
    if (!audioFile) {
      nextErrors.audioFile = "Upload an audio file.";
    } else {
      const audioError = validateAudioFile(audioFile);
      if (audioError) {
        nextErrors.audioFile = audioError;
      }
    }
    if (coverFile) {
      const coverError = validateCoverFile(coverFile);
      if (coverError) {
        nextErrors.coverFile = coverError;
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateDraft()) {
      setSuccess(false);
      return;
    }

    if (!audioFile) {
      return;
    }

    setIsSubmitting(true);
    setErrors((current) => ({ ...current, submit: undefined }));

    const formData = new FormData();
    formData.set("title", draft.title);
    formData.set("producerName", draft.producerName);
    formData.set("genre", draft.genre);
    formData.set("mood", draft.mood);
    formData.set("bpm", draft.bpm);
    formData.set("visualStyle", draft.visualStyle);
    formData.set("description", draft.description);
    formData.set("coverPlaceholderId", draft.coverPlaceholderId);
    formData.set("audioFile", audioFile);
    if (coverFile) {
      formData.set("coverFile", coverFile);
    }

    const isCloud = createMode === "cloud" && isCloudConfigured && user;
    const endpoint = isCloud ? "/api/cloud/realms" : "/api/realms";
    const headers: Record<string, string> = {};
    if (isCloud && accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers,
      });
      if (response.status === 413) {
        throw new Error("File is too large. Vercel limits uploads to 4.5MB. Please compress your beat.");
      }

      let payload: { realm?: { slug: string }; error?: string } = {};
      try {
        payload = await response.json();
      } catch {
        throw new Error(`Server error (${response.status}): The response could not be parsed.`);
      }

      if (!response.ok || !payload.realm) {
        throw new Error(payload.error ?? "Unable to create Realm.");
      }

      window.localStorage.setItem(
        "beatrealm.latestDraft.v1",
        JSON.stringify(draft),
      );
      setSuccess(true);
      router.push(`/realm/${payload.realm.slug}/fight`);
    } catch (error) {
      setErrors((current) => ({
        ...current,
        submit:
          error instanceof Error ? error.message : "Unable to create Realm.",
      }));
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_500px]">
      <form
        onSubmit={handleSubmit}
        className="border border-white/10 bg-[#101012]/82 p-5 glow-border"
      >
        {/* Storage mode toggle */}
        {isCloudConfigured ? (
          <div className="mb-6 flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500">
              Storage mode
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCreateMode("local")}
                className={`inline-flex items-center gap-2 border px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.14em] transition ${
                  createMode === "local"
                    ? "border-[#b7ff2a] bg-[#b7ff2a]/12 text-white"
                    : "border-white/10 text-zinc-500 hover:border-white/30"
                }`}
              >
                <HardDrive size={12} />
                Local
              </button>
              <button
                type="button"
                onClick={() => {
                  if (user) {
                    setCreateMode("cloud");
                  } else {
                    router.push("/login");
                  }
                }}
                className={`inline-flex items-center gap-2 border px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.14em] transition ${
                  createMode === "cloud"
                    ? "border-[#21f7ff] bg-[#21f7ff]/12 text-white"
                    : "border-white/10 text-zinc-500 hover:border-white/30"
                }`}
              >
                <Cloud size={12} />
                {user ? "Cloud" : "Log in for Cloud"}
              </button>
            </div>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={labelClass()}>Beat title</span>
            <input
              value={draft.title}
              onChange={(event) => updateDraft("title", event.target.value)}
              placeholder="Night Circuit"
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "title-error" : undefined}
              className={inputClass(Boolean(errors.title))}
            />
            {errors.title ? (
              <p id="title-error" className="mt-2 text-sm text-[#ff2a6d]">
                {errors.title}
              </p>
            ) : null}
          </label>

          <label className="block">
            <span className={labelClass()}>Producer name</span>
            <input
              value={draft.producerName}
              onChange={(event) =>
                updateDraft("producerName", event.target.value)
              }
              placeholder="demo"
              aria-invalid={Boolean(errors.producerName)}
              aria-describedby={
                errors.producerName ? "producer-error" : undefined
              }
              className={inputClass(Boolean(errors.producerName))}
            />
            {errors.producerName ? (
              <p id="producer-error" className="mt-2 text-sm text-[#ff2a6d]">
                {errors.producerName}
              </p>
            ) : null}
          </label>

          <label className="block">
            <span className={labelClass()}>BPM optional</span>
            <input
              value={draft.bpm}
              onChange={(event) => updateDraft("bpm", event.target.value)}
              inputMode="numeric"
              placeholder="148"
              className={inputClass()}
            />
          </label>

          <label className="block">
            <span className={labelClass()}>Audio mock</span>
            <input
              value={audioFile?.name ?? "No audio uploaded yet"}
              readOnly
              className={`${inputClass()} cursor-not-allowed text-zinc-400`}
            />
          </label>

          <label className="block sm:col-span-2">
            <span className={labelClass()}>Description optional</span>
            <textarea
              value={draft.description}
              onChange={(event) =>
                updateDraft("description", event.target.value)
              }
              rows={4}
              placeholder="Describe the energy of this Realm."
              className="mt-2 w-full resize-none border border-white/10 bg-black/45 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-[#21f7ff] focus:ring-2 focus:ring-[#21f7ff]"
            />
          </label>
        </div>

        <div className="mt-8 grid gap-8">
          <VisualStyleSelector
            value={draft.visualStyle}
            onChange={(value) => updateDraft("visualStyle", value)}
          />
          <GenreSelector
            value={draft.genre}
            onChange={(value) => updateDraft("genre", value)}
          />
          <MoodSelector
            value={draft.mood}
            onChange={(value) => updateDraft("mood", value)}
          />
          <FileUploadPanel
            audioFile={audioFile}
            coverFile={coverFile}
            coverPreviewUrl={coverPreviewUrl}
            audioError={errors.audioFile}
            coverError={errors.coverFile}
            onAudioChange={handleAudioChange}
            onCoverChange={handleCoverChange}
          />
          <CoverPlaceholderSelector
            value={draft.coverPlaceholderId}
            visualStyle={draft.visualStyle}
            onChange={(value) => updateDraft("coverPlaceholderId", value)}
          />
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-[#b7ff2a]">
              {createMode === "cloud"
                ? "Files upload to Supabase Storage."
                : "Files save locally to public/uploads."}
            </p>
            {errors.submit ? (
              <p className="mt-2 text-sm text-[#ff2a6d]">{errors.submit}</p>
            ) : null}
            {success ? (
              <p className="mt-2 flex items-center gap-2 text-sm text-zinc-300">
                <CheckCircle2 size={16} className="text-[#b7ff2a]" />
                Realm created. Opening your{" "}
                {createMode === "cloud" ? "cloud" : "local"} Realm...
              </p>
            ) : null}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#b7ff2a]/70 bg-[#b7ff2a] px-5 py-3 font-mono text-xs font-black uppercase tracking-[0.14em] text-black shadow-[0_0_28px_rgba(183,255,42,0.2)] transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#21f7ff]"
          >
            {isSubmitting ? "Creating..." : createMode === "cloud" ? "Create Cloud Realm" : "Create Realm"}
            <ArrowRight size={16} />
          </button>
        </div>
      </form>

      <RealmLivePreview
        draft={draft}
        coverImageUrl={coverPreviewUrl}
        audioFileName={audioFile?.name}
      />
    </div>
  );
}
