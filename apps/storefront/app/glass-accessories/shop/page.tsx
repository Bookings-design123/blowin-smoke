import type { Metadata } from "next";

import { CategoryLanding } from "@/components/CategoryLanding";
import { DIVISIONS } from "@/lib/divisions";

export const metadata: Metadata = { title: "Published Glass / Accessories / Merch shelf" };
export const dynamic = "force-dynamic";

export default function GlassShopPage({ searchParams }: Readonly<{ searchParams: Promise<Record<string, string | string[] | undefined>> }>) {
  return <CategoryLanding content={DIVISIONS["glass-accessories"]} searchParams={searchParams} />;
}
