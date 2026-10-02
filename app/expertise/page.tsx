import ExpertiseIntro from "../components/expertise/ExpertiseIntro";
import ExpertiseCarousel from "../components/expertise/ExpertiseCarousel";

export default function ExpertisePage() {
  return (
    <div className="flex flex-col flex-1">
      <ExpertiseIntro />
      <div id="expertise">
      </div>
    </div>
  );
}