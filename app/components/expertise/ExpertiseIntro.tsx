import Link from "next/link";
import Reveal from "../Reveal";

export default function ExpertiseIntro() {
  return (
    <>
      {/* Precision at Every Stage */}
      <section className="w-full bg-white py-50">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-6 text-center">
          <Reveal>
            <h2 className="text-5xl font-bold text-black sm:text-6xl">
              Precision at Every Stage
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-xl leading-snug text-zinc-900 sm:text-2xl">
              From early design to long-term asset performance, our expertise
              brings clarity, coordination, and confidence to every stage of
              your project.
            </p>
          </Reveal>

          <Reveal delay={0.4}>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="#expertise"
              className="rounded-full bg-[#35A2CA] px-8 py-3 text-lg font-normal text-white transition-colors hover:bg-[#2b8aae]"
            >
              See Our Expertise
            </Link>
            <Link
              href="#services"
              className="rounded-full bg-[#35A2CA] px-8 py-3 text-lg font-normal text-white transition-colors hover:bg-[#2b8aae]"
            >
              See Our Services
            </Link>
          </div>
          </Reveal>
        </div>
      </section>

      {/* Digital Engineering (same background as the home hero) */}
      <section className="relative flex w-full items-center justify-center overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/hero.mp4"
          poster="/images/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-10 py-32 text-center text-white">
          <Reveal>
            <h2 className="text-4xl font-medium sm:text-5xl">
              Digital Engineering
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
          <div className="mt-4 space-y-8 text-base leading-relaxed sm:text-xl">
            <p>
              The demand for digitizing the design and construction process has
              significantly increased. The industry recognizes its importance.
              We believe this is the future and support this concept.
            </p>

            <p>
              Digitization of the construction process will significantly
              reduce risk and enhance the bankability of infrastructure
              projects, besides improving the viability and asset lifecycle.
            </p>

            <p>
              Using the technology will maximize the resources used for design
              and construction. This will improve the way we design, construct,
              manufacture, and operate within our project scope. It has a
              significant impact on our environment by reducing waste and carbon
              emissions, the biggest drivers of global warming.
            </p>

            <p>- Silverdab Corporation President / BIM Director</p>
          </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}