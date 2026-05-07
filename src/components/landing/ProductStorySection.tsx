const steps = [
  {
    number: "01",
    title: "Upload your beat",
    desc: "Drop an MP3/WAV file and cover art. Set the metadata, genre, and energy level.",
  },
  {
    number: "02",
    title: "Enter the Realm",
    desc: "Your assets generate an immersive, audio-reactive visual environment synced to the music.",
  },
  {
    number: "03",
    title: "Fight the boss",
    desc: "Audio peaks automatically generate hit prompts. Attack on the beat to survive.",
  },
  {
    number: "04",
    title: "Share your score",
    desc: "Publish your Realm to the cloud. Share the link and climb the global leaderboards.",
  },
];

export function ProductStorySection() {
  return (
    <section className="border-y border-white/10 bg-[#0b0b0d]/88 px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-[#21f7ff]">
            How it works
          </p>
          <h2 className="mt-3 text-4xl font-black uppercase text-white sm:text-5xl">
            Four moves from beat to boss room.
          </h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <article
              key={step.number}
              className="border border-white/10 bg-black/35 p-6 transition duration-300 hover:-translate-y-1 hover:border-[#b7ff2a]/55 hover:bg-[#b7ff2a]/5"
            >
              <span className="font-mono text-sm font-black text-[#ff2a6d]">
                {step.number}
              </span>
              <h3 className="mt-8 text-2xl font-black uppercase leading-none text-white">
                {step.title}
              </h3>
              <p className="mt-4 text-sm leading-6 text-zinc-400">
                {step.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
