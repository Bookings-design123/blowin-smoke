import type { Metadata } from "next";

import { CategoryLanding } from "@/components/CategoryLanding";
import { DIVISIONS } from "@/lib/divisions";

export const metadata: Metadata = { title: "Published THCA shelf" };
export const dynamic = "force-dynamic";

export default function ThcaShopPage({ searchParams }: Readonly<{ searchParams: Promise<Record<string, string | string[] | undefined>> }>) {
  return <CategoryLanding content={DIVISIONS.thca} searchParams={searchParams} />;
}
