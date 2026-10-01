export default function CompanyQuote() {
  return (
    <section className="w-full bg-white px-6 py-16 md:py-24" aria-label="Company statement">
      <div className="mx-auto flex max-w-[960px] flex-col items-center text-center text-zinc-900">
        <blockquote className="max-w-[820px] text-[30px] font-medium leading-[1.25] md:text-[40px]">
          &ldquo;Effective communication and collaboration is the company&rsquo;s core attribute to
          achieve its goal.&rdquo;
        </blockquote>

        <p className="mt-10 max-w-[900px] text-[15px] leading-[1.55] text-zinc-800 md:text-[17px]">
          Silverdab Corporation, since its foundation, was established with the vision to provide
          BIM support services that presents innovative solutions and fosters inclusive and
          trustworthy stakeholder community.
        </p>

        <p className="mt-6 max-w-[840px] text-[15px] leading-[1.55] text-zinc-800 md:text-[17px]">
          Silverdab Corporation&rsquo;s commitment, through our purpose, to improve society by
          considering social outcomes in all that we do, focusing on excellence and digital
          innovation, is demonstrated by our ongoing improvement of built environment standards.
        </p>

        <p className="mt-8 text-[15px] text-zinc-800 md:text-[17px]">
          - Silverdab Corporation President / BIM Director -
        </p>
      </div>
    </section>
  );
}