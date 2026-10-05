import LogoLoop, { type LogoItem } from "../logoloop/LogoLoop";
import Reveal from "../Reveal";

// Put the logo files in /public/images/clients/ (or change the paths below).
// Add, remove or reorder logos here.
const clientLogos: LogoItem[] = [
  { src: "/images/clients/bsi.png", alt: "BSI" },
  { src: "/images/clients/oc-global.png", alt: "OC Global" },
  { src: "/images/clients/bdo.png", alt: "BDO" },
  { src: "/images/clients/datem.png", alt: "DATEM" },
  { src: "/images/clients/mj.png", alt: "MJ" },
  { src: "/images/clients/soul-of-japan.png", alt: "Soul of Japan" },
  {
    src: "/images/clients/straits-construction.png",
    alt: "Straits Construction",
  },
];

export default function ClientLogos() {
  return (
    <section className="w-full bg-white py-25">
      <div className="mx-auto w-full max-w-7xl px-10">
        <Reveal>
          <h2 className="text-center text-4xl font-medium text-black sm:text-5xl">
            Trusted by Industry Leaders
          </h2>
        </Reveal>
      </div>

      <Reveal delay={0.2} className="mt-12">
        <LogoLoop
          logos={clientLogos}
          speed={80}
          direction="left"
          logoHeight={100}
          gap={110}
          hoverSpeed={0}
          fadeOut
          fadeOutColor="#ffffff"
          ariaLabel="Companies that trust Silverdab"
        />
      </Reveal>
    </section>
  );
}
