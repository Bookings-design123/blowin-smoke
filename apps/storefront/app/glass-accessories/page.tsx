import type { Metadata } from "next";

import { getPublishedCatalog } from "@/lib/catalog/api";

import { GlassDivisionLanding } from "./GlassDivisionLanding";
import { parseGlassAisle } from "./glass-domain";

export const metadata: Metadata = { title: "Glass / Accessories / Merch" };
export const dynamic = "force-dynamic";

type SearchParams = Readonly<{ aisle?: string | string[] }>;

export default async function GlassAccessoriesPage({
  searchParams,
}: Readonly<{ searchParams: Promise<SearchParams> }>) {
  const [catalog, params] = await Promise.all([getPublishedCatalog(), searchParams]);

  return (
    <GlassDivisionLanding
      catalog={catalog}
      requestedAisle={parseGlassAisle(params.aisle)}
    />
  );
}
