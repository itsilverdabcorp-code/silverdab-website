// data/projects.ts

export type Project = {
  countryCode: string;
  country: string;
  location: [number, number]; // [lat, lng]
  projects: string[];
};

export const PROJECTS: Project[] = [
  {
    countryCode: "KH",
    country: "Cambodia",
    location: [12.5657, 104.9910],
    projects: ["Peace Museum of Mine Action"],
  },
  {
    countryCode: "VN",
    country: "Vietnam",
    location: [14.0583, 108.2772],
    projects: ["Hanoi Metro Line 2"],
  },
  {
    countryCode: "MN",
    country: "Mongolia",
    location: [46.8625, 103.8467],
    projects: ["BIM Feasibility for New Zuunmod City"],
  },
  {
    countryCode: "KE",
    country: "Kenya",
    location: [-0.0236, 37.9062],
    projects: ["Kenya Medical Research Institute"],
  },
  {
    countryCode: "JP",
    country: "Japan",
    location: [36.2048, 138.2529],
    projects: ["Soul of Japan 10k TPA RAS Project Salmon Factory"],
  },
  {
    countryCode: "EG",
    country: "Egypt",
    location: [26.8206, 30.8025],
    projects: [
      "MODON REH North Boutique Cluster Hotel",
      "MODON REH North Resi P1 Sports Club",
      "MODON Wadi Yemm Amphitheater",
      "MODON Wadi Yemm North Plots",
      "MODON REH Lighthouse Village",
      "MODON Fortaleza Hotel",
    ],
  },
  {
    countryCode: "PH",
    country: "Philippines",
    location: [12.8797, 121.7740],
    projects: [
      "Metro Manila Subway Project",
      "North South Commuter Rail",
      "BDO Tower 1, 2, Annex",
      "Lopez Earth Dam",
      "WB 200 Schools",
      "Lufthansa Aircraft Hangar – Clark International Airport",
    ],
  },
  {
    countryCode: "SG",
    country: "Singapore",
    location: [1.3521, 103.8198],
    projects: [
      "The Continuum Project (TSAVC)",
      "Plantation Close-B Project (PCPLB)",
      "Flynn Park (FLPKC)",
      "Singapore Institute of Technology - Punggol North",
      "Tampines Street 94 Mixed Development",
    ],
  },
  {
    countryCode: "TL",
    country: "Timor Leste",
    location: [-8.8742, 125.7275],
    projects: ["Guido Valadares National Hospital"],
  },
  {
    countryCode: "ID",
    country: "Indonesia",
    location: [-0.7893, 113.9213],
    projects: ["MRTJ Phase 2A"],
  },
  {
    countryCode: "AE",
    country: "Dubai",
    location: [25.2048, 55.2708],
    projects: ["Dubai Metro Blue Line"],
  },
];