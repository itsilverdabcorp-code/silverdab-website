import Link from "next/link";
import ExpertiseCarousel from "./components/expertise/ExpertiseCarousel";
import ClientLogos from "./components/clients/ClientLogos";
import Reveal from "./components/Reveal";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <section className="relative flex h-[calc(100vh-73px)] w-full items-center justify-center overflow-hidden">
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

        <div className="relative z-10 flex flex-col items-center gap-6 px-6 py-24 text-center text-white">
          <p className="hero-slide-in text-5xl font-normal">
            Welcome to Silverdab!
          </p>

          <h1
            className="hero-slide-in max-w-6xl whitespace-nowrap text-5xl font-medium leading-tight sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "0.3s" }}
          >
            Building Smarter, For a Better World
          </h1>

          <div
            className="hero-slide-up flex flex-wrap items-center justify-center gap-4"
            style={{ animationDelay: "0.8s" }}
          >
            <Link
              href="/contact"
              className="rounded-full bg-sky-400 px-6 py-2.5 text-xl font-normal text-white transition-colors hover:bg-sky-500"
            >
              Let&apos;s Connect
            </Link>

            <Link
              href="/projects"
              className="rounded-full border border-white px-6 py-2.5 text-xl font-normal text-white transition-colors hover:bg-white/10"
            >
              Explore Projects
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-start justify-center gap-x-20 gap-y-6">
            <div
              className="hero-slide-up text-left"
              style={{ animationDelay: "1.2s" }}
            >
              <p className="text-5xl font-medium sm:text-7xl">26+</p>
              <p className="mt-1 text-2xl text-zinc-200">
                Projects
                <br />
                Delivered
              </p>
            </div>
            <div
              className="hero-slide-up text-left"
              style={{ animationDelay: "1.5s" }}
            >
              <p className="text-5xl font-medium sm:text-7xl">13+</p>
              <p className="mt-1 text-2xl text-zinc-200">
                Countries
                <br />
                Served
              </p>
            </div>
            <div
              className="hero-slide-up text-left"
              style={{ animationDelay: "1.8s" }}
            >
              <p className="text-5xl font-medium sm:text-7xl">1st</p>
              <p className="mt-1 text-2xl text-zinc-200">
                ISO 19650 Certified
                <br />
                in the Philippines
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-20">
        <div className="mx-auto w-full max-w-7xl px-10 text-center">
          <Reveal>
            <h2 className="text-4xl font-medium text-black sm:text-5xl">
              About Silverdab
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
          <div className="mt-10 w-full space-y-8 text-base leading-relaxed text-zinc-800 sm:text-xl">
            <p>
              <span className="text-sky-600">Silverdab Corporation</span> is a
              technology-driven BIM and Digital Engineering company focused on
              delivering high-quality solutions for the Architecture,
              Engineering, and Construction (AEC) industry. The company provides
              integrated services across{" "}
              <span className="text-sky-600">
                BIM Management, BIM Modelling, Digital Engineering,
                Visualization, and Asset Information Delivery
              </span>
              , supporting complex infrastructure and building projects in the
              Philippines, Japan, Southeast Asia, and beyond.
            </p>

            <p>
              Silverdab is known for its commitment to efficient collaboration,
              advanced workflows, and global standards such as ISO 19650,
              ensuring that clients receive accurate, coordinated, and data-rich
              models throughout the project lifecycle. With experience in major
              infrastructure sectors—including railways, roads, metro systems,
              utilities, and asset-heavy developments—the company helps
              organizations improve design quality, reduce risks, accelerate
              delivery, and strengthen digital transformation.
            </p>

            <p>
              Backed by a growing team of BIM specialists, designers, and
              digital engineering professionals, Silverdab continues to expand
              its capabilities and global partnerships, positioning itself as a
              leading provider of smart, innovative, and future-ready BIM
              solutions.
            </p>
          </div>
          </Reveal>
        </div>
      </section>

      <ClientLogos />

      <ExpertiseCarousel />

      <section className="w-full bg-white py-20">
        <div className="mx-auto w-full max-w-7xl px-10">
          <Reveal autoPlayVideo>
          <video
            className="aspect-video w-full rounded-2xl object-cover"
            src="/videos/hero-edit.mp4"
            controls
            muted
            playsInline
          />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
