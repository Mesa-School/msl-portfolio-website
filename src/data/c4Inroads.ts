export interface InroadsFounder {
  name: string;
  role: string;
  photo: string;
}

export interface InroadsStartup {
  startup: string;
  /** Full legal/brand name when it differs from the short display name. */
  startupFull?: string;
  sector: string;
  description: string;
  founders: InroadsFounder[];
}

/** Cohort 4 startups selected for Inroads, in announcement order. */
export const C4_INROADS: InroadsStartup[] = [
  {
    startup: "Kadak",
    sector: "Consumer",
    description:
      "A consumer startup building ₹5 caffeine sachets for quick, convenient energy and alertness — without tobacco or nicotine.",
    founders: [{ name: "Ishaan Panchal", role: "Founder", photo: "/c4_inroads/cutout/ishaan-panchal.webp" }],
  },
  {
    startup: "Skillhance",
    sector: "EdTech",
    description: "A trusted, learner-first platform for discovering, comparing and choosing education programs.",
    founders: [{ name: "Honey Gupta", role: "Founder", photo: "/c4_inroads/cutout/honey-gupta.webp" }],
  },
  {
    startup: "Alfred Scholar",
    sector: "Research Tech",
    description:
      "Streamlines the researcher's workflow into one place — gather research, then write your own papers confidently and securely.",
    founders: [{ name: "Bhushan", role: "Founder", photo: "/c4_inroads/cutout/bhushan.webp" }],
  },
  {
    startup: "Praroh",
    sector: "AgriTech",
    description:
      "Growing organic, pesticide-free produce year-round in controlled greenhouses, using 60–70% less water than conventional farming.",
    founders: [{ name: "Dhruv Chandan", role: "Founder", photo: "/c4_inroads/cutout/dhruv-chandan.webp" }],
  },
  {
    startup: "Athanni",
    startupFull: "Athanni Financial Services Pvt. Ltd.",
    sector: "FinTech",
    description:
      "The one-stop solution for freelancers to secure their payments and run the back office of their personal brand.",
    founders: [{ name: "Vedant Yadav", role: "Founder", photo: "/c4_inroads/cutout/vedant-yadav.webp" }],
  },
  {
    startup: "SudoSquad Club",
    sector: "Gaming",
    description: "Takes the Sudoku people already know and makes it something they can play with others.",
    founders: [{ name: "Ashish Bajaj", role: "Founder", photo: "/c4_inroads/cutout/ashish-bajaj.webp" }],
  },
  {
    startup: "Sauce It Up",
    sector: "Food & Beverage",
    description:
      "Protein-rich sauces and dips for consumers who want great taste without compromising on nutrition.",
    founders: [{ name: "Adit Shah", role: "Founder", photo: "/c4_inroads/cutout/adit-shah.webp" }],
  },
  {
    startup: "Beta",
    startupFull: "Beta by Digimuse",
    sector: "Creator Economy",
    description: "The platform brands use to price and evaluate creators with data instead of guesswork.",
    founders: [{ name: "Srishiv Patro", role: "Founder", photo: "/c4_inroads/cutout/srishiv-patro.webp" }],
  },
  {
    startup: "House of Indian Spirits",
    sector: "Alcobev",
    description:
      "Building the brand infrastructure to take India's indigenous spirits from fragmented local products to standardized consumer brands.",
    founders: [
      { name: "Karan Menon", role: "Co-founder", photo: "/c4_inroads/cutout/karan-menon.webp" },
      { name: "Aryan Wadhwa", role: "Co-founder", photo: "/c4_inroads/cutout/aryan-wadhwa.webp" },
    ],
  },
];

export const C4_FOUNDERS = C4_INROADS.flatMap((s) => s.founders.map((f) => ({ ...f, startup: s.startup })));
