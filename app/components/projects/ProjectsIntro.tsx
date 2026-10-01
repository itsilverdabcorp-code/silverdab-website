import type { CSSProperties, ReactNode } from "react";

// Timing (in ms). Each gradient text fades up first, then the shine runs.
const T = {
  line1: 100, // "From the Philippines to the World,"
  headingFade: 100, // gradient heading fades up with everything else
  headingShine: 100, // shine starts right after the fade-up ends (100 + 800)
  paragraph: 100, // paragraph fades up
  statFade: 100, // stats fade up
  statShine: 100, // stats shine starts at the same time as the heading shine
};

const vars = (v: Record<string, string>) => v as CSSProperties;

function Stat({ value, label }: { value: string; label: ReactNode }) {
  return (
    <div className="text-center">
      <p
        className="pi-shine mx-auto w-fit bg-clip-text text-7xl font-normal leading-none text-transparent sm:text-8xl"
        style={vars({
          "--pi-fade": `${T.statFade}ms`,
          "--pi-shine": `${T.statShine}ms`,
        })}
      >
        {value}
      </p>
      <p
        className="pi-fade mt-3 text-base leading-snug text-black"
        style={vars({ "--pi-delay": `${T.statFade}ms` })}
      >
        {label}
      </p>
    </div>
  );
}

export default function ProjectsIntro() {
  return (
    <section className="w-full bg-white px-6 py-30">
      <style>{`
        @keyframes pi-fade-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes pi-shine {
          from { background-position: 100% 0, 0 0; }
          to   { background-position: 0% 0, 0 0; }
        }

        .pi-fade {
          animation: pi-fade-up 800ms cubic-bezier(0.22, 1, 0.36, 1)
            var(--pi-delay, 0ms) both;
        }

        /* Gradient text: starts dark, a shine sweeps across, then the normal gradient stays */
        .pi-shine {
          background-image:
            linear-gradient(90deg, transparent 0%, transparent 55%, #6fdcff 60%, #12365f 64%, #12365f 100%),
            linear-gradient(90deg, #4fd0f7 0%, #2a9dc8 50%, #1c5ea8 100%);
          background-size: 300% 100%, 100% 100%;
          background-repeat: no-repeat;
          background-position: 0% 0, 0 0;
          animation:
            pi-fade-up 800ms cubic-bezier(0.22, 1, 0.36, 1) var(--pi-fade, 0ms) both,
            pi-shine 2000ms cubic-bezier(0.45, 0, 0.25, 1) var(--pi-shine, 0ms) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .pi-fade, .pi-shine { animation: none; }
        }
      `}</style>

      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-4xl font-normal leading-tight text-black sm:text-5xl lg:text-6xl">
          <span
            className="pi-fade block"
            style={vars({ "--pi-delay": `${T.line1}ms` })}
          >
            From the Philippines to the World,
          </span>
          <span
            className="pi-shine mx-auto block w-fit bg-clip-text font-semibold text-transparent"
            style={vars({
              "--pi-fade": `${T.headingFade}ms`,
              "--pi-shine": `${T.headingShine}ms`,
            })}
          >
            Projects That Build the Future
          </span>
        </h2>

        <p
          className="pi-fade mx-auto mt-8 max-w-4xl text-lg text-zinc-900 sm:text-xl lg:text-2xl"
          style={vars({ "--pi-delay": `${T.paragraph}ms` })}
        >
          Full BIM coordination, from design through construction, backed by
          teams working on the ground.
        </p>

        <div className="mt-10 flex flex-wrap items-start justify-center gap-x-20 gap-y-8">
          <Stat
            value="26+"
            label={
              <>
                Projects
                <br />
                Delivered
              </>
            }
          />
          <Stat
            value="13+"
            label={
              <>
                Countries
                <br />
                Served
              </>
            }
          />
        </div>
      </div>
    </section>
  );
}