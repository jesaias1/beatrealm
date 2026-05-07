import { FileAudio, UploadCloud } from "lucide-react";

type MockUploadZoneProps = {
  value: string;
  onChange: (value: string) => void;
};

const mockFiles = [
  "night-circuit-demo.wav",
  "redline-loop-148bpm.mp3",
  "ghost-room-sketch.wav",
];

export function MockUploadZone({ value, onChange }: MockUploadZoneProps) {
  return (
    <section className="border border-dashed border-[#21f7ff]/35 bg-black/35 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <UploadCloud className="text-[#21f7ff]" size={28} />
            <h2 className="font-mono text-xs font-black uppercase tracking-[0.16em] text-zinc-300">
              Audio file mock selector
            </h2>
          </div>
          <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
            Real uploads arrive in Phase 3. For now, choose a fake filename so
            the creation flow feels complete.
          </p>
        </div>
        <div className="border border-white/10 bg-[#101012] px-3 py-2 font-mono text-xs text-[#b7ff2a]">
          Upload disabled
        </div>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {mockFiles.map((file) => (
          <button
            key={file}
            type="button"
            aria-pressed={value === file}
            onClick={() => onChange(file)}
            className={`flex items-center gap-2 border px-3 py-3 text-left font-mono text-xs transition focus:outline-none focus:ring-2 focus:ring-[#21f7ff] ${
              value === file
                ? "border-[#21f7ff] bg-[#21f7ff]/10 text-white"
                : "border-white/10 bg-black/30 text-zinc-400 hover:border-white/30"
            }`}
          >
            <FileAudio size={16} />
            <span>{file}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
