import type { Metadata } from "next";

import { getPublishedCatalog } from "@/lib/catalog/api";

import { VapeDivisionLanding } from "./VapeDivisionLanding";
import { parseVapeAisle } from "./vape-domain";

export const metadata: Metadata = { title: "Vape / Nicotine" };
export const dynamic = "force-dynamic";

type SearchParams = Readonly<{ aisle?: string | string[] }>;

export default async function VapeNicotinePage({
  searchParams,
}: Readonly<{ searchParams: Promise<SearchParams> }>) {
  const [catalog, params] = await Promise.all([getPublishedCatalog(), searchParams]);

  return (
    <VapeDivisionLanding
      catalog={catalog}
      requestedAisle={parseVapeAisle(params.aisle)}
    />
  );
}
