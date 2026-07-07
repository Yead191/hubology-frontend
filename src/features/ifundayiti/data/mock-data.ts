export interface IFundApplicant {
  id: string; // Tracking ID
  name: string;
  dob: string;
  nationality: string;
  location: string;
  email: string;
  phone: string;
  nationalId: string;
  passport?: string;
  projectName: string;
  projectDescription: string;
  requestedAmount: number;
  fundUsage: string;
  expectedImpact: string;
  documents: { type: string; name: string }[];
  occupation: string;
  financialBackground: string;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Top 5 Finalist' | 'Winner' | 'Rejected' | 'Archived';
  submissionDate: string;
  photoUrl: string;
  story?: string;
  periodId: string;
}

export interface IFundWinner {
  id: string;
  name: string;
  projectName: string;
  awardedAmount: number;
  period: string;
  successStory: string;
  photoUrl: string;
  additionalPhotos: string[];
}

export interface IFundDonation {
  id: string;
  name: string;
  amount: number;
  date: string;
  status: 'Successful' | 'Pending' | 'Failed';
}

export const INITIAL_STATS = {
  totalApplications: 148,
  approvedApplicants: 36,
  totalDonations: 24500,
  currentProgramFund: 12500,
  totalWinners: 12,
};

export const INITIAL_PERIOD = {
  id: "period-2026-q3",
  title: "Summer 2026 Cohort",
  startDate: "2026-07-01",
  endDate: "2026-08-31",
  maxAmount: 1000,
  status: "Open", // Open, Closed, Review, Completed
};

export const INITIAL_APPLICANTS: IFundApplicant[] = [
  {
    id: "IFA-2026-000101",
    name: "Jean-Baptiste Pierre",
    dob: "1994-04-12",
    nationality: "Haitian",
    location: "Port-au-Prince, Delmas 31",
    email: "jean.pierre@email.ht",
    phone: "+509 3712-3456",
    nationalId: "01-01-99-1994-04-00101",
    projectName: "Eco-Grow Hydroponics",
    projectDescription: "A urban hydroponic farming project aiming to supply fresh, organic leafy greens to local markets in Port-au-Prince using water-efficient systems.",
    requestedAmount: 950,
    fundUsage: "Purchasing water pumps, solar cells, nutrient solutions, and locally sourced PVC piping structures.",
    expectedImpact: "Providing high-quality fresh vegetables to 50+ local families while reducing water consumption by 80% compared to traditional farming.",
    documents: [
      { type: "Government-issued ID", name: "National_ID_Pierre.pdf" },
      { type: "Proof of Address", name: "Utility_Bill_Delmas.pdf" }
    ],
    occupation: "Urban Farmer / Student",
    financialBackground: "Independent worker relying on small-scale crop sales. No access to traditional bank loans due to high interest rates in Haiti.",
    status: "Approved",
    submissionDate: "2026-07-02",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300",
    story: "Growing up in Delmas, Jean-Baptiste noticed how expensive imported vegetables were. After studying agriculture online, he set up a tiny hydroponic rack on his roof. He aims to scale this system to feed his neighborhood and build a sustainable local business.",
    periodId: "period-2026-q3"
  },
  {
    id: "IFA-2026-000105",
    name: "Marie-Claire Augustin",
    dob: "1988-11-23",
    nationality: "Haitian",
    location: "Cap-Haïtien, Rue 24 A",
    email: "marie.augustin@email.ht",
    phone: "+509 4812-7890",
    nationalId: "02-01-99-1988-11-00205",
    projectName: "Soleil Clean Energy",
    projectDescription: "Setting up a solar charging kiosk to provide affordable phone charging and clean lighting solutions for local residents and market vendors.",
    requestedAmount: 800,
    fundUsage: "Buying two 200W solar panels, one deep-cycle solar battery, charging cables, and building a wooden kiosk structure.",
    expectedImpact: "Replacing dangerous kerosene lamps for at least 15 local street vendors and providing reliable power in an area with daily blackouts.",
    documents: [
      { type: "Government-issued ID", name: "Marie_ID_Card.jpg" },
      { type: "Proof of Address", name: "DGI_Tax_Receipt.pdf" }
    ],
    occupation: "Market Vendor",
    financialBackground: "Sole breadwinner running a small household shop. High energy costs swallow 30% of her monthly profits.",
    status: "Approved",
    submissionDate: "2026-07-03",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300",
    story: "Marie-Claire runs a neighborhood kiosk. Due to unstable grids, her business shuts down at sunset, and kids study by candlelight. By placing solar panels on her roof, she will keep her kiosk open and provide a safe study space for neighborhood children.",
    periodId: "period-2026-q3"
  },
  {
    id: "IFA-2026-000112",
    name: "Dieudonné Joseph",
    dob: "1991-08-05",
    nationality: "Haitian",
    location: "Jacmel, Bel-Air District",
    email: "d.joseph@email.ht",
    phone: "+509 3112-9988",
    nationalId: "03-01-99-1991-08-00112",
    projectName: "Atelye Kreyatif Jacmel",
    projectDescription: "A workshop to train unemployed youths in Jacmel in traditional papier-mâché and recycled art, helping them sell to tourists and galleries.",
    requestedAmount: 1000,
    fundUsage: "Purchasing bulk glues, paint sets, brushes, wire mesh, worktables, and establishing a small physical showcase area.",
    expectedImpact: "Enrolling 10 local youths in a 3-month mentoring program, equipping them with artistic skills to earn a dignified living.",
    documents: [
      { type: "Government-issued ID", name: "ID_Dieudonne.pdf" },
      { type: "Proof of Address", name: "Mayor_Office_Jacmel.pdf" }
    ],
    occupation: "Artisanal Sculptor",
    financialBackground: "Experienced sculptor who lost business due to decreased tourism. He wants to transition into youth mentoring and community art manufacturing.",
    status: "Top 5 Finalist",
    submissionDate: "2026-07-04",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300&h=300",
    story: "Jacmel is the cultural capital of Haiti, but lack of jobs pushes youth away. Dieudonné believes art can heal and provide income. This grant allows him to rent workshop tools and buy supplies so local kids can learn papier-mâché and start selling their artwork.",
    periodId: "period-2026-q3"
  },
  {
    id: "IFA-2026-000118",
    name: "Lourdes Chery",
    dob: "1995-02-14",
    nationality: "Haitian",
    location: "Les Cayes, La Savane",
    email: "lourdes.chery@email.ht",
    phone: "+509 3445-6677",
    nationalId: "04-01-99-1995-02-00118",
    projectName: "Cayes Clean Water Station",
    projectDescription: "Installing a localized gravity-based water filtration system to sell clean, purified drinking water at a fraction of standard commercial prices.",
    requestedAmount: 900,
    fundUsage: "Acquiring ceramic filtration units, high-grade storage tanks, reusable 5-gallon bottles, and public sanitization signage.",
    expectedImpact: "Providing clean drinking water access to over 100 households in La Savane, reducing waterborne illness risks in the area.",
    documents: [
      { type: "Government-issued ID", name: "Lourdes_NIF.jpg" },
      { type: "Proof of Address", name: "Rent_Contract_Cayes.pdf" }
    ],
    occupation: "Community Health Volunteer",
    financialBackground: "Volunteers for health organizations and has firsthand experience with waterborne cholera outbreaks in her community.",
    status: "Top 5 Finalist",
    submissionDate: "2026-07-04",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300",
    story: "After Hurricane Matthew, clean water became scarce in Les Cayes. Lourdes saw cholera return. She wants to use her saving and this grant to build a gravity-powered purification system, selling clean water cheaply to local mothers while distributing free tablets for kids.",
    periodId: "period-2026-q3"
  },
  {
    id: "IFA-2026-000122",
    name: "Roody Bernard",
    dob: "1997-06-18",
    nationality: "Haitian",
    location: "Gonaïves, Raboteau",
    email: "roody.bernard@email.ht",
    phone: "+509 3662-1122",
    nationalId: "05-01-99-1997-06-00122",
    projectName: "Bernard Poultry Hatchery",
    projectDescription: "A small-scale local chicken farm supplying fresh eggs and chicks to neighborhood households, bypassing major commercial transport channels.",
    requestedAmount: 750,
    fundUsage: "Purchasing a high-efficiency incubator, chicken feed, wood shavings, vaccine doses, and mesh fencing wire.",
    expectedImpact: "Boosting protein food security in Raboteau with local egg production, creating a small recurring revenue stream.",
    documents: [
      { type: "Government-issued ID", name: "ID_Bernard_Roody.pdf" },
      { type: "Proof of Address", name: "Electricity_Invoice_Gonaives.pdf" }
    ],
    occupation: "Unemployed",
    financialBackground: "Struggling to find steady work. Supports his elderly parents by doing casual manual labor around the Gonaïves port.",
    status: "Top 5 Finalist",
    submissionDate: "2026-07-05",
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300&h=300",
    story: "Roody lives in Raboteau, Gonaïves. High food prices have hit his household hard. By building a modest chicken coop and buying an automated solar-ready egg incubator, he will generate high-quality food and a regular micro-income for his family.",
    periodId: "period-2026-q3"
  }
];

export const INITIAL_WINNERS: IFundWinner[] = [
  {
    id: "IFA-2026-000088",
    name: "Fabienne Bastien",
    projectName: "Bastien Cocoa Processing",
    awardedAmount: 1000,
    period: "Spring 2026 Cohort",
    successStory: "Fabienne used her $1,000 grant to purchase an industrial grinding machine and high-quality packaging sealers. Before the grant, she processed cocoa beans manually by hand, limiting production to 10kg per week. Today, she processes over 120kg weekly, supplying organic Haitian chocolate and cocoa powder to three regional grocery stores in Saint-Marc, and has hired two local women to assist with packaging.",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400",
    additionalPhotos: [
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=400&h=300",
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400&h=300"
    ]
  },
  {
    id: "IFA-2025-000042",
    name: "Luc Desir",
    projectName: "Desir Carpentry & Repair",
    awardedAmount: 950,
    period: "Winter 2025 Cohort",
    successStory: "With his micro-grant, Luc purchased a heavy-duty table saw and safety gear. In Jacmel, his shop was previously limited to hand saws, making it difficult to compete. Since upgrading, he has manufactured school benches for two local nurseries and repaired roof timbers for households affected by heavy storms. Luc's workshop now trains high schoolers on weekends in safety and basic woodcraft.",
    photoUrl: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=400&h=400",
    additionalPhotos: [
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=400&h=300"
    ]
  }
];

export const INITIAL_DONATIONS: IFundDonation[] = [
  { id: "DON-001", name: "Anonymous Donor", amount: 1500, date: "2026-07-01", status: "Successful" },
  { id: "DON-002", name: "Sarah Jenkins", amount: 250, date: "2026-07-03", status: "Successful" },
  { id: "DON-003", name: "Marc-Arthur Paul", amount: 100, date: "2026-07-04", status: "Successful" }
];
