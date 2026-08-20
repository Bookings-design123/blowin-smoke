import type { Metadata } from "next";

import { CategoryLanding } from "@/components/CategoryLanding";
import { DIVISIONS } from "@/lib/divisions";

export const metadata: Metadata = { title: "Published Vape & Nicotine shelf" };
export const dynamic = "force-dynamic";

export default function VapeShopPage({ searchParams }: Readonly<{ searchParams: Promise<Record<string, string | string[] | undefined>> }>) {
  return <CategoryLanding content={DIVISIONS["vape-nicotine"]} searchParams={searchParams} />;
}
