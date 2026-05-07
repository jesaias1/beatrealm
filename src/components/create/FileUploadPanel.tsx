import { FileAudio, ImagePlus, X } from "lucide-react";

type FileUploadPanelProps = {
  audioFile: File | null;
  coverFile: File | null;
  coverPreviewUrl?: string;
  audioError?: string;
  coverError?: string;
  onAudioChange: (file: File | null) => void;
  onCoverChange: (file: File | null) => void;
};

function formatFileSize(size: number) {
  if (size >= 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(size / 1024))} KB`;
}

export function FileUploadPanel({
  audioFile,
  coverFile,
  coverPreviewUrl,
  audioError,
  coverError,
  onAudioChange,
  onCoverChange,
}: FileUploadPanelProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="border border-dashed border-[#21f7ff]/35 bg-black/35 p-5">
        <div className="flex items-center gap-3">
          <FileAudio className="text-[#21f7ff]" size={28} />
          <div>
            <h2 className="font-mono text-xs font-black uppercase tracking-[0.16em] text-zinc-300">
              Audio upload
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              MP3, WAV, M4A, or OGG. 50MB max.
            </p>
          </div>
        </div>
        <label className="mt-5 flex min-h-32 cursor-pointer flex-col items-center justify-center border border-white/10 bg-[#101012]/70 px-4 py-5 text-center transition hover:border-[#21f7ff]/55 focus-within:ring-2 focus-within:ring-[#21f7ff]">
          <span className="font-mono text-xs font-black uppercase tracking-[0.16em] text-white">
            Choose beat file
          </span>
          <span className="mt-2 text-sm text-zinc-400">
            Local file intake only. No cloud upload yet.
          </span>
          <input
            type="file"
            accept="audio/mpeg,audio/mp3,audio/wav,audio/x-wav,audio/mp4,audio/m4a,audio/aac,audio/ogg,.mp3,.wav,.m4a,.ogg"
            className="sr-only"
            onChange={(event) => onAudioChange(event.target.files?.[0] ?? null)}
          />
        </label>
        {audioFile ? (
          <div className="mt-4 border border-white/10 bg-black/45 p-3">
            <p className="font-mono text-xs text-[#b7ff2a]">
              {audioFile.name}
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              {audioFile.type || "unknown type"} / {formatFileSize(audioFile.size)}
            </p>
          </div>
        ) : null}
        {audioError ? (
          <p className="mt-3 text-sm text-[#ff2a6d]">{audioError}</p>
        ) : null}
      </div>

      <div className="border border-dashed border-[#ff2a6d]/35 bg-black/35 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ImagePlus className="text-[#ff2a6d]" size={28} />
            <div>
              <h2 className="font-mono text-xs font-black uppercase tracking-[0.16em] text-zinc-300">
                Cover image
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                JPG, PNG, or WEBP. 10MB max.
              </p>
            </div>
          </div>
          {coverFile ? (
            <button
              type="button"
              onClick={() => onCoverChange(null)}
              className="border border-white/10 p-2 text-zinc-300 transition hover:border-[#ff2a6d]/60 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#21f7ff]"
              aria-label="Remove cover image"
            >
              <X size={16} />
            </button>
          ) : null}
        </div>
        <label className="mt-5 flex min-h-32 cursor-pointer flex-col items-center justify-center overflow-hidden border border-white/10 bg-[#101012]/70 text-center transition hover:border-[#ff2a6d]/55 focus-within:ring-2 focus-within:ring-[#21f7ff]">
          {coverPreviewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverPreviewUrl}
              alt="Selected cover preview"
              className="h-32 w-full object-cover"
            />
          ) : (
            <span className="px-4 py-5">
              <span className="block font-mono text-xs font-black uppercase tracking-[0.16em] text-white">
                Choose cover image
              </span>
              <span className="mt-2 block text-sm text-zinc-400">
                Or keep using a CSS placeholder below.
              </span>
            </span>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            className="sr-only"
            onChange={(event) => onCoverChange(event.target.files?.[0] ?? null)}
          />
        </label>
        {coverFile ? (
          <div className="mt-4 border border-white/10 bg-black/45 p-3">
            <p className="font-mono text-xs text-[#b7ff2a]">
              {coverFile.name}
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              {coverFile.type || "unknown type"} / {formatFileSize(coverFile.size)}
            </p>
          </div>
        ) : null}
        {coverError ? (
          <p className="mt-3 text-sm text-[#ff2a6d]">{coverError}</p>
        ) : null}
      </div>
    </section>
  );
}
