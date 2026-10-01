import type { Metadata } from "next";
import TimelineCarousel from "../components/timeline/TimelineCarousel";
import KitemarkSection from "../components/kitemark/Kitemarksection";
import OurOffices from "../components/offices/Ouroffices";
import CompanyQuote from "../components/quote/Companyquote";

export const metadata: Metadata = {
  title: "Company | Silverdab",
  description:
    "From one bold vision to a global presence: the Silverdab Corporation timeline.",
};

export default function CompanyPage() {
  return (
    <div className="flex flex-1 flex-col">
      <TimelineCarousel />
      <KitemarkSection />
      <OurOffices />
      <CompanyQuote />
    </div>
  );
}
