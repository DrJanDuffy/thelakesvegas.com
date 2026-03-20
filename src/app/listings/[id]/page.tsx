import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import Image from "next/image";
import { Bed, Bath, Square, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/page-metadata";
import SchemaScript from "@/components/SchemaScript";
import FAQSection from "@/components/sections/FAQSection";
import LocalServiceAreaBlurb from "@/components/seo/LocalServiceAreaBlurb";
import {
  combineSchemas,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateRealEstateListingSchema,
} from "@/lib/schema";

type ListingPageData = {
  id: string;
  name: string;
  location: string;
  priceDisplay: string;
  priceAmount: number;
  image: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  yearBuilt: number;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
};

// Replace with RealScout (or MLS) fetch when wired
async function getProperty(id: string): Promise<ListingPageData> {
  return {
    id,
    name: "Modern Luxury Home",
    location: "Summerlin, Las Vegas, NV",
    priceDisplay: "$850,000",
    priceAmount: 850000,
    image: "/Image/hero_bg_1.jpg",
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 3200,
    yearBuilt: 2018,
    description:
      "Stunning modern home in desirable Summerlin community. Features open floor plan, updated kitchen, and beautiful backyard. Close to schools, shopping, and entertainment.",
    address: {
      street: "123 Summerlin View Dr",
      city: "Las Vegas",
      state: "NV",
      zip: "89128",
    },
  };
}

const listingDetailFaqs = [
  {
    question: "How do I schedule a showing for this Las Vegas-area home?",
    answer:
      "Call or text Dr. Jan Duffy at (702) 500-1942 or use the contact form. She coordinates private showings across Las Vegas, Henderson, Summerlin, and Clark County.",
  },
  {
    question: "Is buyer representation free when I work with Berkshire Hathaway HomeServices?",
    answer:
      "In most resale transactions the seller's brokerage pays the buyer's agent commission. Dr. Jan Duffy explains agency and compensation so you know what to expect before you write an offer.",
  },
  {
    question: "Can you help if I'm relocating from California or another state?",
    answer:
      "Yes. Dr. Jan Duffy specializes in California relocations to Nevada, virtual tours, and remote offers—backed by Berkshire Hathaway HomeServices Nevada Properties.",
  },
  {
    question: "Where do listing details come from on this page?",
    answer:
      "This page is a template for a single listing. When connected to your MLS or RealScout feed, price, photos, and status will update from that source and must be verified with Dr. Jan Duffy.",
  },
];

type PropertyPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getProperty(id);
  const desc =
    property.description.length > 155
      ? `${property.description.slice(0, 152)}…`
      : property.description;

  return buildPageMetadata({
    path: `/listings/${encodeURIComponent(id)}`,
    title: `${property.name} | ${property.priceDisplay} | Las Vegas Real Estate`,
    description: `${property.location}. ${desc} Dr. Jan Duffy, Berkshire Hathaway HomeServices Nevada Properties. Call (702) 500-1942.`,
    keywords: [
      "Las Vegas homes for sale",
      "Henderson real estate",
      "Summerlin listings",
      property.location,
    ],
    ogImagePath: property.image,
  });
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params;
  const property = await getProperty(id);
  const listingPath = `/listings/${id}`;

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Listings", url: "/listings" },
    { name: property.name, url: listingPath },
  ];

  const listingSchema = generateRealEstateListingSchema({
    name: property.name,
    description: property.description,
    price: property.priceAmount,
    address: property.address,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    sqft: property.squareFeet,
    images: [property.image],
    url: listingPath,
  });

  const pageSchemas = combineSchemas(
    generateBreadcrumbSchema(breadcrumbs),
    listingSchema,
    generateFAQSchema(listingDetailFaqs)
  );

  return (
    <>
      <SchemaScript id="listing-detail-schema" schema={pageSchemas} />
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <nav className="mb-6 text-sm" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-slate-600">
              <li>
                <Link href="/" className="hover:text-blue-600">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/listings" className="hover:text-blue-600">
                  Listings
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-900">{property.name}</li>
            </ol>
          </nav>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{property.name}</h1>
            <div className="flex items-center text-slate-600 mb-4">
              <MapPin className="h-5 w-5 mr-2" />
              {property.location}
            </div>
            <div className="text-3xl font-bold text-blue-600">{property.priceDisplay}</div>
            <LocalServiceAreaBlurb
              className="text-slate-600 text-sm md:text-base max-w-3xl mt-4 leading-relaxed"
              topic="Listing tours and offers"
            />
          </div>

          <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-8">
            <Image
              src={property.image}
              alt={`${property.name} — ${property.location}`}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Property Details</h2>
              <p className="text-slate-700 mb-6">{property.description}</p>

              <div className="bg-slate-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Features</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Bed className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-slate-700">{property.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-slate-700">{property.bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-slate-700">
                      {property.squareFeet.toLocaleString()} sq ft
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-slate-700">Built {property.yearBuilt}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Schedule a Showing</h3>
                <p className="text-slate-700 mb-4">
                  Contact us to schedule a private viewing of this property.
                </p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <a href="/contact">Contact Agent</a>
                </Button>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="bg-white border border-slate-200 rounded-lg p-6 sticky top-24">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Contact Agent</h3>
                <p className="text-slate-600 mb-4">Dr. Jan Duffy</p>
                <p className="text-sm text-slate-600 mb-6">
                  Berkshire Hathaway HomeServices Nevada Properties
                </p>
                <div className="space-y-3">
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                    <a href="tel:+17025001942">Call (702) 500-1942</a>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <a href="/contact">Send Message</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <FAQSection
          title="Listing FAQs"
          subtitle="Questions about showings, representation, and Las Vegas real estate"
          faqs={listingDetailFaqs}
        />
      </main>
      <Footer />
    </>
  );
}
