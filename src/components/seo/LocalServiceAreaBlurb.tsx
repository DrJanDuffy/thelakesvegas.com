import { theLakesGeo } from "@/lib/the-lakes-aeo";
import { agentInfo, officeInfo } from "@/lib/site-config";

type LocalServiceAreaBlurbProps = {
  /** Short topic phrase, e.g. "Investment property guidance" */
  topic: string;
  /** Override default area list */
  areas?: string[];
  className?: string;
};

/**
 * Visible GEO block: service area + The Lakes / Clark County + NAP-aligned license line.
 */
function formatAreaList(list: string[]): string {
  if (list.length === 0) return "";
  if (list.length === 1) return list[0];
  if (list.length === 2) return `${list[0]} and ${list[1]}`;
  return `${list.slice(0, -1).join(", ")}, and ${list[list.length - 1]}`;
}

export default function LocalServiceAreaBlurb({
  topic,
  areas = [
    "Las Vegas",
    "Henderson",
    "Summerlin",
    "North Las Vegas",
    theLakesGeo.nameWithCity,
    "Clark County, Nevada",
  ],
  className = "text-slate-600 text-sm md:text-base max-w-3xl mx-auto mt-4 leading-relaxed",
}: LocalServiceAreaBlurbProps) {
  return (
    <p className={className}>
      <strong className="text-slate-800">{topic}</strong> across{" "}
      {formatAreaList(areas)}.{" "}
      {agentInfo.name}, {agentInfo.title} (License {agentInfo.license}) with{" "}
      {agentInfo.brokerage} — office: {officeInfo.address.full}. Call{" "}
      <a href={agentInfo.phoneTel} className="font-semibold text-blue-600 hover:underline">
        {agentInfo.phone}
      </a>
      .
    </p>
  );
}
