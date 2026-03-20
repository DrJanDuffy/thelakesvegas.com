import {
  combineSchemas,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateNeighborhoodSchema,
} from "@/lib/schema";

export type NeighborhoodFaqItem = { question: string; answer: string };

export type NeighborhoodPageGraphInput = {
  slug: string;
  name: string;
  breadcrumbLabel: string;
  description: string;
  faqs: NeighborhoodFaqItem[];
  latitude?: number;
  longitude?: number;
  containedIn?: string;
};

/** Breadcrumb + Place + FAQ JSON-LD bundle for neighborhood marketing pages. */
export function neighborhoodPageGraph(input: NeighborhoodPageGraphInput) {
  return combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Neighborhoods", url: "/neighborhoods" },
      { name: input.breadcrumbLabel, url: `/neighborhoods/${input.slug}` },
    ]),
    generateNeighborhoodSchema({
      name: input.name,
      slug: input.slug,
      description: input.description,
      latitude: input.latitude,
      longitude: input.longitude,
      containedIn: input.containedIn,
    }),
    generateFAQSchema(input.faqs)
  );
}
