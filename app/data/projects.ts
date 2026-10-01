// data/projects.ts
// One flat list of projects (PROJECT_LIST). The globe, the details card and the
// "Projects" section below the globe all read from it.

export type Category = "Infrastructure" | "Residential" | "Institutional" | "Hospitality";

export const CATEGORIES: Category[] = [
  "Infrastructure",
  "Residential",
  "Institutional",
  "Hospitality",
];

export type ProjectItem = {
  name: string;
  place?: string;
  stats?: string[]; // each one becomes a line on the globe card
  description?: string;
  video?: string; // e.g. "/projects/metro-manila-subway/video.mp4"
  logos?: string[]; // e.g. ["/images/clients/jica.png"]
  category?: Category;
};

export type Project = {
  countryCode: string;
  country: string;
  location: [number, number]; // [lat, lng]
  projects: (string | ProjectItem)[];
};

export type ListItem = ProjectItem & { countryCode: string; category: Category };

// ---- Logos (files in public/images/clients/) -------------------------------
const JICA = "/images/clients/jica.png"; // add this file
const DOTR = "/images/clients/dotr.png"; // add this file
const BDO = "/images/clients/bdo.png";
const STRAITS = "/images/clients/straits-construction.png";
const SOUL = "/images/clients/soul-of-japan.png";
const MJ = "/images/clients/mj.png";
const AEDAS = "/images/clients/aedas.png";
const ADB = "/images/clients/adb.png";
const CMAC = "/images/clients/cmac.png";
const IRRIGATION = "/images/clients/irrigation.png";
const EEI = "/images/clients/ee.png";
const DPWH = "/images/clients/dpwh.png";
const WORLDBANK = "/images/clients/worldbank.png";

// ---- All projects, in the order they appear in the section -----------------
export const PROJECT_LIST: ListItem[] = [
  // ===== Infrastructure =====
  {
    countryCode: "PH",
    category: "Infrastructure",
    name: "Metro Manila Subway Project",
    place: "Metro Manila, Philippines",
    stats: ["17 Stations", "36 Kilometers", "9 Contract Packages", "17 Contractors"],
    description:
      "This 36-km underground railway will connect major financial districts in Metro Manila to the country's main international airport. Supported by Japanese ODA, it is expected to serve over 500,000 passengers daily in its first year.",
    video: "/projects/metro-manila-subway/video.mp4",
    logos: [JICA, DOTR],
  },
  {
    countryCode: "PH",
    category: "Infrastructure",
    name: "North South Commuter Rail",
    place: "Greater Metro Manila, Philippines",
    stats: ["25 Stations", "147 Kilometers", "10 Contract Packages", "20 Contractors"],
    description:
      "This 147-km elevated railway will enhance connectivity across three Luzon regions, including Metro Manila, and is projected to serve up to 800,000 passengers daily in its first year.",
    video: "/projects/north-south-commuter-rail/video.mp4",
    logos: [JICA, DOTR, ADB],
  },
  {
    countryCode: "ID",
    category: "Infrastructure",
    name: "MRTJ Phase 2A",
    place: "Jakarta, Indonesia",
    stats: ["7 Stations", "11.8 Kilometers"],
    description:
      "The MRT Jakarta Phase 2 project extends 11.8 km from the HI Roundabout to West Ancol, adding to the existing Phase 1 corridor. The total north-south line will be 27.8 km, with a 45-minute travel time from Lebak Bulus Grab Station to Kota Station. Stations are 0.6–1 km apart, using a CBTC Level 2 automatic signaling system.",
    video: "/projects/mrtj-phase-2a/video.mp4",
    logos: [JICA, MJ],
  },
  {
    countryCode: "AE",
    category: "Infrastructure",
    name: "Dubai Metro Blue Line Project",
    place: "Dubai, United Arab Emirates",
    description:
      "The Blue Line represents a massive Dh56 billion investment in the emirate's transport infrastructure. It will stretch 30 kilometres, split between 15.5 kilometres of underground track and 14.5 kilometres above ground. It will include 14 stations, with critical interchange connections to both the Red and Green Lines.",
    video: "/projects/dubai-metro-blue-line/video.mp4",
  },
  {
    countryCode: "VN",
    category: "Infrastructure",
    name: "Hanoi Metro Line 2",
    place: "Hanoi, Vietnam",
    // description: paste here (no text provided yet)
    video: "/projects/hanoi-metro-line-2/video.mp4",
  },
  {
    countryCode: "PH",
    category: "Infrastructure",
    name: "NIA Lopez SRIP",
    place: "Cawayanin Lopez, Quezon, Philippines",
    description:
      "Key components: construction of a small dam/reservoir, an irrigation canal and distribution network, drainage and access facilities, service roads and other support infrastructure, and support for local farming communities in the project area.",
    video: "/projects/lopez-srip/video.mp4",
    logos: [IRRIGATION, EEI],
  },
  {
    countryCode: "MN",
    category: "Infrastructure",
    name: "New Zuunmod",
    place: "Mongolia",
    description:
      "The new Zuunmod satellite city is designated to implement the special functions of the capital city, Ulaanbaatar, and is projected to cover an area of 31,501 hectares. The key infrastructure of the satellite city will be built through public-private partnerships, including 128.5 kilometers of roads, a thermal power plant with a capacity to produce 250 MW of electricity and 465 MW of heat, and a wastewater treatment plant with a capacity to process 20,000 cubic meters of wastewater per day.",
    video: "/projects/new-zuunmod-city/video.mp4",
    logos: [ADB],
  },
  {
    countryCode: "PH",
    category: "Infrastructure",
    name: "World Bank 200 Schools Retrofit",
    place: "PSRRRP Firm-4, Metro Manila, Philippines",
    description:
      "This project will fund the repair and reconstruction of disaster-damaged schools, improving learning environments for over 700,000 students. It will focus on the regions most affected by earthquakes and tropical cyclones and strengthen DepEd's PH operations and maintenance systems to ensure safer, well-managed school infrastructure after future disasters.",
    video: "/projects/wb-200-schools/video.mp4",
    logos: [DPWH, WORLDBANK],
  },
  {
    countryCode: "PH",
    category: "Infrastructure",
    name: "Lufthansa Aircraft Hangar, Clark International Airport",
    place: "Clark, Philippines",
    // description: paste here (no text provided yet)
    video: "/projects/lufthansa-hangar-clark/video.mp4",
  },

  // ===== Residential =====
  {
    countryCode: "SG",
    category: "Residential",
    name: "The Continuum (TSAVC)",
    place: "Thiam Siew Avenue, Singapore",
    description:
      "The proposed executive condominium at Lot 05428V MK 10 on Plantation Close will include one 16-storey block, one 17-storey block, and six 20-storey blocks, totaling 612 units with shared amenities such as a landscaped deck and basement parking. Conveniently located near the upcoming Tengah Park MRT and beside the earlier Tengah Plantation EC Plot A, the development offers strong connectivity and a well-integrated required environment.",
    video: "/projects/the-continuum/video.mp4",
    logos: [STRAITS],
  },
  {
    countryCode: "SG",
    category: "Residential",
    name: "Plantation Close-B (PCPLB)",
    place: "Thiam Siew Avenue, Singapore",
    description:
      "This freehold condominium at Thiam Siew Avenue, District 15, is within walking distance of Dakota and Paya Lebar MRT stations, with easy access to ECP and the CBD. It features 816 units across 6 residential towers, with amenities including basement carparks, swimming pools, and a conserved bungalow. The development is connected by a private skywalk and skybridges.",
    video: "/projects/plantation-close-b/video.mp4",
    logos: [STRAITS],
  },
  {
    countryCode: "SG",
    category: "Residential",
    name: "Flynn Park (FLPKC)",
    place: "Yew Siang Road, Singapore",
    description:
      "Flynn Park is a 72-unit freehold development on a 208,443 sq ft site along Yew Siang Road, about 350m from Pasir Panjang MRT. It is close to Mapletree's business park, Sentosa, and amenities like Pasir Panjang Food Centre and VivoCity.",
    video: "/projects/flynn-park/video.mp4",
    logos: [STRAITS],
  },
  {
    countryCode: "SG",
    category: "Residential",
    name: "Tampines Street 94 Mixed Development",
    place: "Singapore",
    // description: paste here (no text provided yet)
    video: "/projects/tampines-street-94/video.mp4",
  },
  {
    countryCode: "EG",
    category: "Residential",
    name: "MODON REH North Boutique Cluster Hotel",
    place: "North Coast, Egypt",
    description:
      "Ras Al Hekma (REH) is a visionary waterfront city on Egypt's North Coast, designed for sustainable coastal living. Integrating renewable energy, green transport, eco-friendly architecture, and water recycling, it promotes low-impact urban growth. Strategically located along the Mediterranean, it offers luxury resorts, residential communities, commercial hubs, and cultural spaces within walkable, green neighborhoods. More than a real estate project, REH represents Egypt's model for smart, sustainable development and long-term investment.",
    video: "/projects/modon-reh-boutique-hotel/video.mp4",
    logos: [AEDAS],
  },
  {
    countryCode: "EG",
    category: "Residential",
    name: "MODON REH North Resi P1 Sports Club",
    place: "North Coast, Egypt",
    // description: paste here (no text provided yet)
    video: "/projects/modon-reh-resi-sports-club/video.mp4",
    logos: [AEDAS],
  },
  {
    countryCode: "EG",
    category: "Residential",
    name: "MODON Wadi Yemm Amphitheater",
    place: "North Coast, Egypt",
    description:
      "Wadi Yemm by Modon Egypt is an ultra-premium seafront community in Ras El Hekma on Egypt's North Coast. It offers smart 1–4 bedroom apartments and 5–6 bedroom villas with sea or pool views, private terraces, and premium amenities. Residents enjoy direct beach access, green parks, golf, equestrian trails, and wellness facilities in a world-class Mediterranean setting.",
    video: "/projects/modon-wadi-yemm-amphitheater/video.mp4",
    logos: [AEDAS],
  },
  {
    countryCode: "EG",
    category: "Residential",
    name: "MODON Wadi Yemm North Plots",
    place: "North Coast, Egypt",
    description:
      "Masterfully developed by Modon Properties, this coastal enclave offers a sophisticated selection of ultra-luxury 1 to 4 bedroom apartments and signature 5 to 6 bedroom villas. Each home is smart-home enabled and designed with sea or pool views, private terraces, BOH kitchens, and dedicated staff quarters. With direct beach access, expansive green parks, championship golf courses, equestrian facilities, and wellness hubs, Wadi Yemm delivers a lifestyle of refined Mediterranean elegance.",
    video: "/projects/modon-wadi-yemm-north-plots/video.mp4",
    logos: [AEDAS],
  },
  {
    countryCode: "EG",
    category: "Residential",
    name: "MODON REH Lighthouse Village",
    place: "North Coast, Egypt",
    // description: paste here (no text provided yet)
    video: "/projects/modon-reh-lighthouse-village/video.mp4",
    logos: [AEDAS],
  },
  {
    countryCode: "EG",
    category: "Residential",
    name: "MODON Wadi Yemm Fortaleza Hotel",
    place: "North Coast, Egypt",
    description:
      "Developed by Modon on Egypt's Mediterranean coast, Ras El Hekma is an ambitious, world-class city blending modern living with sustainable infrastructure. This cutting-edge development will feature a wide range of residential, commercial, and recreational facilities to serve both local and international audiences. Ultimately, it is envisioned as a major global destination, attracting tourists and investors with luxurious seaside resorts, top-tier entertainment, retail spaces, and cultural attractions.",
    video: "/projects/modon-fortaleza-hotel/video.mp4",
    logos: [AEDAS],
  },

  // ===== Institutional =====
  {
    countryCode: "PH",
    category: "Institutional",
    name: "BDO Unibank Inc. Campus",
    place: "Metro Manila, Philippines",
    stats: ["Designed by Foster and Partners"],
    description:
      "The new BDO campus introduces a flexible, climate-responsive workplace model for the Philippines. It unifies five urban plots into a single campus, featuring two slender towers and a sheltered triple-height public space enriched with greenery and artworks to enhance Manila's public realm.",
    video: "/projects/bdo-campus/video.mp4",
    logos: [BDO],
  },
  {
    countryCode: "SG",
    category: "Institutional",
    name: "Singapore Institute of Technology – Punggol North",
    place: "(SIT) 11 New Punggol Road, Singapore",
    description:
      "The Singapore Institute of Technology is a public autonomous university known for its \"Campus-in-a-Park\" identity where academic buildings encircle a central Community Park that serves as the primary hub for socializing and relaxation.",
    video: "/projects/sit-punggol-north/video.mp4",
    logos: [STRAITS],
  },
  {
    countryCode: "KE",
    category: "Institutional",
    name: "Kenya Medical Research Institute",
    place: "Kenya",
    // description: paste here (no text provided yet)
    video: "/projects/kemri/video.mp4",
  },
  {
    countryCode: "TL",
    category: "Institutional",
    name: "Guido Valadares National Hospital",
    place: "Timor-Leste",
    // description: paste here (no text provided yet)
    video: "/projects/guido-valadares-hospital/video.mp4",
  },
  {
    countryCode: "KH",
    category: "Institutional",
    name: "Peace Museum of Mine Action",
    place: "Cambodia",
    description:
      "The Peace Museum of Mine Action is a project aimed at raising awareness about the impact of landmines and unexploded ordnance (UXO) in post-conflict areas, with a focus on education, advocacy, and commemoration related to mine action.",
    video: "/projects/peace-museum-mine-action/video.mp4",
    logos: [JICA, CMAC],
  },
  {
    countryCode: "BR",
    category: "Institutional",
    name: "Embassy of Japan in Brazil",
    place: "Brazil",
    // description: paste here (no text provided yet)
    video: "/projects/embassy-japan-brazil/video.mp4",
  },

  // ===== Hospitality =====
  {
    countryCode: "SA",
    category: "Hospitality",
    name: "Trojena Ski Village",
    place: "Saudi Arabia",
    description:
      "During the winter season, the Ski Village will become a hotbed of alpine action, providing three months of snow-covered slopes for skiers and snowboarders of all levels. In the summer season, the cool clean air will transform the village into a haven where any activity is possible, welcoming revelers and thrill-seekers from all walks of life.",
    video: "/projects/trojena-ski-village/video.mp4",
    logos: [AEDAS],
  },
  {
    countryCode: "JP",
    category: "Hospitality",
    name: "Soul of Japan 10k TPA RAS Project",
    place: "Tsu City, Mie Prefecture, Japan",
    description:
      "A state-of-the-art RAS Atlantic salmon production facility in Tsu City, designed to be the largest land-based salmon farm in Asia, will produce 10,000 tons of salmon annually. The facility spans 137,000 m², with SOJ partnering with Pure Salmon Technology to ensure high-quality production using advanced RAS technology.",
    video: "/projects/soul-of-japan-salmon/video.mp4",
    logos: [SOUL],
  },
];

// ---- Globe pins: one per country ------------------------------------------
const COUNTRIES: Omit<Project, "projects">[] = [
  { countryCode: "KH", country: "Cambodia", location: [12.5657, 104.991] },
  { countryCode: "VN", country: "Vietnam", location: [14.0583, 108.2772] },
  { countryCode: "MN", country: "Mongolia", location: [46.8625, 103.8467] },
  { countryCode: "KE", country: "Kenya", location: [-0.0236, 37.9062] },
  { countryCode: "JP", country: "Japan", location: [36.2048, 138.2529] },
  { countryCode: "EG", country: "Egypt", location: [26.8206, 30.8025] },
  { countryCode: "PH", country: "Philippines", location: [12.8797, 121.774] },
  { countryCode: "SG", country: "Singapore", location: [1.3521, 103.8198] },
  { countryCode: "TL", country: "Timor Leste", location: [-8.8742, 125.7275] },
  { countryCode: "ID", country: "Indonesia", location: [-0.7893, 113.9213] },
  { countryCode: "AE", country: "Dubai", location: [25.2048, 55.2708] },
  { countryCode: "BR", country: "Brazil", location: [-14.235, -51.9253] },
  { countryCode: "SA", country: "Saudi Arabia", location: [23.8859, 45.0792] },
];

export const PROJECTS: Project[] = COUNTRIES.map((c) => ({
  ...c,
  projects: PROJECT_LIST.filter((p) => p.countryCode === c.countryCode),
}));