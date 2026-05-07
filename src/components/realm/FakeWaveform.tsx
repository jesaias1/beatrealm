type FakeWaveformProps = {
  bars?: number;
  active?: boolean;
};

export function FakeWaveform({ bars = 48, active = true }: FakeWaveformProps) {
  return (
    <div className="flex h-20 items-center gap-1 overflow-hidden border border-white/10 bg-black/35 px-4">
      {Array.from({ length: bars }).map((_, index) => {
        const height = 22 + ((index * 17) % 54);
        const delay = `${(index % 9) * 90}ms`;

        return (
          <span
            key={index}
            className={`w-full min-w-1 origin-center rounded-full bg-gradient-to-t from-[#ff2a6d] via-[#21f7ff] to-[#b7ff2a] opacity-80 ${
              active ? "animate-wave" : ""
            }`}
            style={{ height, animationDelay: delay }}
          />
        );
      })}
    </div>
  );
}
