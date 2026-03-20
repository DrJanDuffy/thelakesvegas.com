/**
 * SEO / GEO / AEO — primary focus: "The Lakes Las Vegas"
 * Used for homepage FAQ (visible + JSON-LD) and geographic copy.
 */

import { agentInfo } from "@/lib/site-config";

/** Matches @/lib/schema FAQItem shape for generateFAQSchema() */
export type TheLakesFaqItem = { question: string; answer: string };

/** Target phrase for titles, H1 support, and answer engines */
export const theLakesPrimaryKeyword = "The Lakes Las Vegas";

/** Geographic entity for content + schema (approximate centroid; refine vs GBP) */
export const theLakesGeo = {
  name: "The Lakes",
  nameWithCity: "The Lakes, Las Vegas, Nevada",
  county: "Clark County",
  region: "NV",
  country: "US",
  /** Common ZIPs for the area (verify against USPS/GBP) */
  postalCodes: ["89128", "89129"] as const,
  latitude: 36.198,
  longitude: -115.262,
  summary:
    "The Lakes is a master-planned community in west Las Vegas, Nevada, known for lakefront and water-view homes, tree-lined streets, and quick access to the 215 beltway, Summerlin, and the west valley.",
};

/** Homepage FAQs: direct answers for snippets / AI overviews (AEO) + local intent */
export const theLakesHomeFaqItems: TheLakesFaqItem[] = [
  {
    question: "What is The Lakes Las Vegas?",
    answer:
      "The Lakes Las Vegas is a residential master-planned community in west Las Vegas, Nevada, built around man-made lakes and greenbelts. It is known for waterfront and water-view homes, mature landscaping, and a suburban feel while staying close to shopping, schools, and major roads like the 215 beltway.",
  },
  {
    question: "Where is The Lakes Las Vegas located?",
    answer:
      "The Lakes Las Vegas is located in west Las Vegas in Clark County, Nevada—west of the central Strip corridor and convenient to Summerlin and the western 215 beltway. It is part of the Las Vegas Valley and is commonly associated with west Las Vegas and 89128/89129 ZIP codes (confirm exact address with listings and tax records).",
  },
  {
    question: "What ZIP codes are associated with The Lakes Las Vegas?",
    answer:
      "Many homes in The Lakes Las Vegas fall in the 89128 and 89129 ZIP codes. Always verify the ZIP for a specific property on the MLS listing, county records, and your purchase contract.",
  },
  {
    question: "How do I find homes for sale in The Lakes Las Vegas?",
    answer:
      "Use the property search on this site, browse active listings with your agent, or contact Dr. Jan Duffy at (702) 500-1942 or by email to request a curated list of The Lakes Las Vegas homes that match your budget, timeline, and must-haves.",
  },
  {
    question: "Is The Lakes Las Vegas near Summerlin?",
    answer:
      "Yes. The Lakes Las Vegas is in west Las Vegas and is near Summerlin’s amenities and employment corridors. Many buyers compare The Lakes and Summerlin when choosing a west-side lifestyle; your agent can explain differences in HOA rules, lake access, and commute patterns.",
  },
  {
    question: "Who helps buyers and sellers in The Lakes Las Vegas?",
    answer:
      `Dr. Jan Duffy with Berkshire Hathaway HomeServices Nevada Properties works with buyers and sellers across Las Vegas and specializes in west-side communities including The Lakes Las Vegas. Reach her at (702) 500-1942 or ${agentInfo.email}.`,
  },
  {
    question: "Why choose Berkshire Hathaway HomeServices for The Lakes Las Vegas?",
    answer:
      "Berkshire Hathaway HomeServices is backed by Berkshire Hathaway Inc., with strong brand trust and a large agent network. For The Lakes Las Vegas, you get local market guidance plus the resources of BHHS Nevada Properties for pricing, marketing, negotiation, and closing.",
  },
  {
    question: "How long does it take to buy a home in Las Vegas?",
    answer:
      "Most financed purchases close in about 30–45 days after an accepted offer, depending on loan type, appraisal, and inspections. Cash purchases can close faster. Timelines for The Lakes Las Vegas listings follow the same general Las Vegas closing process.",
  },
  {
    question: "Do you provide home valuations for The Lakes Las Vegas?",
    answer:
      "Yes. Dr. Jan Duffy provides complimentary, data-driven home valuations using recent comparable sales and current Las Vegas market conditions, including micro-market factors relevant to The Lakes Las Vegas.",
  },
  {
    question: "How do I contact Dr. Jan Duffy about The Lakes Las Vegas real estate?",
    answer:
      `Call or text (702) 500-1942 or email ${agentInfo.email}. Office: Berkshire Hathaway HomeServices Nevada Properties, 9406 W Lake Mead Blvd, Suite 100, Las Vegas, NV 89134. License ${agentInfo.license}.`,
  },
];
