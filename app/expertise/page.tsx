import Link from "next/link";
import ExpertiseIntro from "../components/expertise/ExpertiseIntro";
import ServicesCarousel from "../components/services/ServicesCarousel";
import ExpertiseTabs from "../components/expertise/ExpertiseTabs";

export default function ExpertisePage() {
  return (
    <div className="flex flex-col flex-1">
      <ExpertiseIntro />
      <ExpertiseTabs />
      <ServicesCarousel />

      {/* Let's Put Our Expertise to Work */}
      <section className="w-full bg-[#F5F6F7] py-24">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-5 px-6 text-center">
          <h2 className="text-4xl font-medium text-black sm:text-5xl">
            Let&apos;s Put Our Expertise to Work
          </h2>

          <p className="text-xl text-zinc-900 sm:text-2xl">
            Your project. Our expertise. Let&apos;s make it happen.
          </p>

          <Link
            href="/contact"
            className="mt-2 rounded-full bg-[#35A2CA] px-8 py-3 text-lg font-normal text-white transition-colors hover:bg-[#2b8aae]"
          >
            Let&apos;s Connect
          </Link>
        </div>
      </section>
    </div>
  );
}