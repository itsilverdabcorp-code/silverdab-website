"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Reveal from "../Reveal";
import { ICON_PATHS, type IconName } from "./ExpertiseCarousel";

type Item = { title: string; icon: IconName; text: string; bullets?: string[] };

type Tab = {
  name: string;
  tagline: string;
  image: string;
  description: string;
  items: Item[];
};
const TABS: Tab[] = [
  {
    name: "BIM Modelling",
    tagline: "Where accurate models shape smarter projects.",
    image: "/images/expertise/bim-modelling.jpg",
    description:
      "We deliver accurate, data-rich 3D models that form the foundation of intelligent design, coordination, and construction. Our team develops highly detailed models using the latest 3d Software to represent architectural, structural, and MEP systems with precision. Through Level of Detail (LOD)–based modeling, clash detection, and interoperability with other project platforms, we ensure seamless collaboration between disciplines.",
    items: [
      {
        title: "2D to 3D Conversion",
        icon: "box",
        text: "Converting the 2D Drawings to a usable 3D model suitable for coordination",
      },
      {
        title: "Design Modeling & Documentation",
        icon: "ruler",
        text: "Producing design drawings using BIM technology",
      },
      {
        title: "Construction Modeling",
        icon: "crane",
        text: "Developing the existing BIM models from design to the needed maturity level.",
      },
      {
        title: "Coordination & Shop Drawings",
        icon: "cone",
        text: "Produced out of a coordinated BIM model utilizing the conceptual designs and specifications",
      },
    ],
  },
  {
    name: "BIM Management",
    tagline: "Managing information. Mastering delivery.",
    image: "/images/expertise/bim-management.jpg",
    description:
      "We bridge the gap between design, construction, and operations by transforming project data into intelligent, maintainable digital assets. Through structured BIM data, COBie integration, and digital twin technology, we enable owners and facility managers to access accurate, real-time information for effective decision-making throughout the asset lifecycle. Our approach ensures seamless handover, optimized maintenance planning, and improved asset performance using ISO 19650-compliant workflows.",
    items: [
      {
        title: "Consultancy",
        icon: "clipboard",
        text: "Providing consultancy services for organizations / project that is customized based on the Client's need. Some of these are:",
        bullets: [
          "Creating a BIM ecosystem",
          "Streamlines implementation with the organization's goals and resources",
          "Evaluation of the Client's BIM-related expenses and provision of recommended cost-savings strategies",
          "Adherence to BIM standards and Manuals and optimize resource in accordance with ISO 19650",
        ],
      },
      {
        title: "Clash Detection",
        icon: "clash",
        text: "Ensures seamless detection and management of clashes between different trades.",
      },
      {
        title: "Constructability Reviews",
        icon: "hardhat",
        text: "Visualization of potential design issues and extraction of data needed from the BIM model for fabrication.",
      },
      {
        title: "3D Scheduling",
        icon: "gantt",
        text: "Time Simulation and Construction Sequencing.",
      },
      {
        title: "3D Quantity Takeoff",
        icon: "calculator",
        text: "Using BIM, we can have a more accurate estimate of the cost of the project.",
      },
      {
        title: "3D Coordination",
        icon: "users",
        text: "Using BIM models for Project Coordination, Constructability reviews & coordination meetings.",
      },
    ],
  },
  {
    name: "BIM Visualization",
    tagline: "Immersive visuals for smarter decisions.",
    image: "/images/expertise/bim-visualization.jpg",
    description:
      "We transform complex design data into immersive, photorealistic visual experiences that enhance communication, understanding, and stakeholder engagement. Using advanced visualization tools, our team creates high-quality renderings, animations, and virtual walkthroughs directly from BIM models. These visual outputs help clients and decision-makers clearly interpret design intent, spatial relationships, and material selections — supporting faster approvals and better project coordination.",
    items: [
      {
        title: "Virtual Reality",
        icon: "vr",
        text: "Using VR for coordination and presentation.",
      },
      {
        title: "Rendering/Walkthrough",
        icon: "video",
        text: "3d Rendering thru Exterior Flyby and Interior Walkthrough.",
      },
    ],
  },
  {
    name: "BIM Asset Management",
    tagline: "Your digital foundation for long-term asset performance",
    image: "/images/expertise/bim-asset-management.jpg",
    description:
      "We bridge the gap between design, construction, and operations by transforming project data into intelligent, maintainable digital assets. Through structured BIM data, COBie integration, and digital twin technology, we enable owners and facility managers to access accurate, real-time information for effective decision-making throughout the asset lifecycle. Our approach ensures seamless handover, optimized maintenance planning, and improved asset performance using ISO 19650-compliant workflows.",
    items: [
      {
        title: "Digital Handover",
        icon: "handover",
        text: "A structured, data-rich model (often COBie-compliant) is delivered to the owner/operator for ongoing use.",
      },
      {
        title: "Facility Management Integration",
        icon: "factory",
        text: "BIM data is connected or integrated with CAFM (Computer-Aided Facility Management) or CMMS (Computerized Maintenance Management Systems).",
      },
      {
        title: "Asset Tagging & Tracking",
        icon: "pin",
        text: "Every system or component (HVAC, electrical, plumbing, etc.) is tagged and linked to relevant documents (warranties, manuals, maintenance schedules).",
      },
      {
        title: "Preventive Maintenance Planning",
        icon: "wrench",
        text: "Using BIM data, facilities teams can plan inspections, repairs, and replacements efficiently.",
      },
      {
        title: "Space Management & Occupancy",
        icon: "sofa",
        text: "BIM models help manage space allocation, usage, and changes over time.",
      },
      {
        title: "Lifecycle Cost Management",
        icon: "recycle",
        text: "Facility owners can analyze the cost implications of assets over time using BIM-based data.",
      },
    ],
  },
  {
    name: "BIM Academy",
    tagline: "Your pathway to certified BIM excellence.",
    image: "/images/expertise/bim-academy.jpg",
    description:
      "We are dedicated to developing the next generation of digital design and construction professionals through comprehensive, industry-aligned BIM training. Our academy offers structured programs that cover the full spectrum of Building Information Modeling — from foundational concepts and software proficiency to advanced coordination, ISO 19650 standards, and real-world project applications. Guided by experienced BIM managers and industry practitioners, participants gain hands-on experience.",
    items: [
      {
        title: "BIM Training",
        icon: "training",
        text: "We provide training to individuals or organizations that want to take the BIM Personal Qualification certification",
      },
      {
        title: "BIM Coaching",
        icon: "book",
        text: "We provide assistance to projects or organizations that need to adopt and adhere to BIM ISO 19650 or implement Digital Engineering processes",
      },
      {
        title: "BIM Support",
        icon: "support",
        text: "We provide technical support to projects or organizations that need to adopt and adhere to BIM ISO 19650 or implement Digital Engineering processes.",
      },
      {
        title: "BIM ISO 19650 Accreditation",
        icon: "certificate",
        text: "We assist the project or the organization to be certified.",
      },
    ],
  },
];
function ItemIcon({ name }: { name: IconName }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 shrink-0 text-zinc-800"
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

export default function ExpertiseTabs() {
  const [active, setActive] = useState(0);
  const tab = TABS[active];

  return (
    <section id="expertise" className="w-full bg-[#F5F6F7] py-20">
      <div className="mx-auto w-full max-w-7xl px-10">
        <Reveal>
          <h2 className="text-4xl font-medium text-black sm:text-5xl">
            Our Expertise
          </h2>
        </Reveal>

        {/* Tab bar */}
        <Reveal delay={0.2}>
        <div className="mt-8 overflow-x-auto">
          <div
            role="tablist"
            className="flex w-full min-w-max gap-2 rounded-full bg-zinc-200 p-2"
          >
            {TABS.map((t, i) => (
              <button
                key={t.name}
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={`flex-1 whitespace-nowrap rounded-full px-6 py-2 text-center text-base transition-colors ${
                  i === active
                    ? "bg-black text-white"
                    : "text-zinc-900 hover:bg-zinc-300"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
        </Reveal>

        <Reveal delay={0.4}>
        <div key={active} className="tab-fade">
        {/* Banner */}
        <div className="relative mt-6 h-72 w-full overflow-hidden rounded-xl sm:h-96">
          <Image
            key={tab.image}
            src={tab.image}
            alt={tab.name}
            fill
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <h3 className="text-4xl font-normal sm:text-5xl">{tab.name}</h3>
            <p className="mt-2 text-lg italic sm:text-2xl">
              &ldquo;{tab.tagline}&rdquo;
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="mt-8 grid grid-cols-1 gap-x-16 md:grid-cols-2">
          {[
            tab.items.slice(0, Math.ceil(tab.items.length / 2)),
            tab.items.slice(Math.ceil(tab.items.length / 2)),
          ].map((column, ci) => (
            <ul key={ci} className="flex flex-col gap-8">
              {column.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <ItemIcon name={item.icon} />
                  <div>
                    <h4 className="text-xl font-normal text-black">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-sm leading-snug text-zinc-700">
                      {item.text}
                    </p>
                    {item.bullets && (
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-snug text-zinc-700">
                        {item.bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ))}
        </div>

        {/* Description + button */}
        <p className="mt-10 text-base leading-relaxed text-zinc-900 sm:text-xl">
          {tab.description}
        </p>

        <Link
          href="/contact"
          className="mt-8 inline-block rounded-full bg-[#35A2CA] px-8 py-3 text-lg font-normal text-white transition-colors hover:bg-[#2b8aae]"
        >
          Send Inquiry
        </Link>
        </div>
        </Reveal>
      </div>
    </section>
  );
}