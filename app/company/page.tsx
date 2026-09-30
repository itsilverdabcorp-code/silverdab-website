import type { Metadata } from "next";
import TimelineCarousel from "../components/timeline/TimelineCarousel";
import KitemarkSection from "../components/kitemark/Kitemarksection";

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
    </div>
  );
}
