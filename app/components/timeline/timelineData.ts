export type TimelineEvent = {
  title: string;
  text: string;
};

export type TimelineItem = {
  /** Small label above the line, e.g. "2019" */
  year: string;
  /** Text shown under the big year, e.g. "Found Since" */
  label: string;
  /** File inside /public/images/timeline */
  image: string;
  /** "cover" for photos, "contain" for logos and flags */
  fit: "cover" | "contain";
  events: TimelineEvent[];
};

const dir = "/images/timeline";

// Rename your uploaded images to match these file names,
// or change the file names here (for example to .jpg or .webp).
export const timeline: TimelineItem[] = [
  {
    year: "2019",
    label: "Found Since",
    image: `${dir}/2019.png`,
    fit: "contain",
    events: [
      {
        title: "Company Founded",
        text: "Silverdab Corporation was founded by Jose Lorenzo Afable",
      },
    ],
  },
  {
    year: "2020",
    label: "Recognized Globally",
    image: `${dir}/2020.png`,
    fit: "cover",
    events: [
      {
        title: "Industry Recognition",
        text: "Our project was featured in the Bentley 2020 Infrastructure Yearbook.",
      },
    ],
  },
  {
    year: "2021",
    label: "Growing Stronger",
    image: `${dir}/2021.png`,
    fit: "cover",
    events: [
      {
        title: "Office Expansion",
        text: "We've expanded our office and enhanced our services to accommodate new team members and the surge of BIM and Digital Engineering projects.",
      },
    ],
  },
  {
    year: "2022",
    label: "Reaching New Heights",
    image: `${dir}/2022.png`,
    fit: "contain",
    events: [
      {
        title: "Bentley Finalist",
        text: "Finalist for the Bentley Infrastructure (YII) Awards.",
      },
    ],
  },
  {
    year: "2023",
    label: "Certified. Partnered. Growing.",
    image: `${dir}/2023.png`,
    fit: "contain",
    events: [
      {
        title: "ISO 19650 Certification",
        text: "BSI Kitemark ISO 19650 certification achieved in 2023 — the first company in the Philippines to receive this certification.",
      },
      {
        title: "Strategic Partnership",
        text: "Partnered with OC Global, a Tokyo-based engineering consulting firm, to unify Project Management, Design, and BIM expertise.",
      },
    ],
  },
  {
    year: "2024",
    label: "Award-Winning",
    image: `${dir}/2024.png`,
    fit: "contain",
    events: [
      {
        title: "Autodesk Award",
        text: "Received the Autodesk Innovator of the Year Award, a special recognition given by Autodesk as part of its Excellence Awards Program.",
      },
    ],
  },
  {
    year: "2025",
    label: "Going Regional",
    image: `${dir}/2025.png`,
    fit: "cover",
    events: [
      {
        title: "Regional Expansion",
        text: "Expanded our services to new regions, including Japan, Australia, Singapore, Saudi Arabia, and beyond.",
      },
    ],
  },
  {
    year: "2026",
    label: "Going International",
    image: `${dir}/2026.png`,
    fit: "cover",
    events: [
      {
        title: "Singapore Incorporation",
        text: "Incorporated Silverdab Pte. Ltd. in Singapore.",
      },
    ],
  },
  {
    year: "Beyond",
    label: "Still Growing",
    image: `${dir}/beyond.png`,
    fit: "contain",
    events: [
      {
        title: "Still Growing",
        text: "From ISO 9001:2015 to PAS 2080, we continue raising the standard for what BIM can deliver.",
      },
    ],
  },
];
