import type { Metadata } from "next";

import { getPublishedCatalog } from "@/lib/catalog/api";

import { ThcaDivisionLanding } from "./ThcaDivisionLanding";
import { parseThcaFormat } from "./thca-domain";

export const metadata: Metadata = { title: "THCA" };
export const dynamic = "force-dynamic";

type SearchParams = Readonly<{ format?: string | string[] }>;

export default async function ThcaPage({
  searchParams,
}: Readonly<{ searchParams: Promise<SearchParams> }>) {
  const [catalog, params] = await Promise.all([getPublishedCatalog(), searchParams]);

  return (
    <ThcaDivisionLanding
      catalog={catalog}
      requestedFormat={parseThcaFormat(params.format)}
    />
  );
}
