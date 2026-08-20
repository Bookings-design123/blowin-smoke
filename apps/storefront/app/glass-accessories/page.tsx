import type { Metadata } from "next";

import { DivisionLanding } from "@/components/DivisionLanding";
import { DIVISIONS } from "@/lib/divisions";

export const metadata: Metadata = { title: "Glass / Accessories / Merch" };
export const dynamic = "force-dynamic";

export default function GlassAccessoriesPage() {
  return <DivisionLanding content={DIVISIONS["glass-accessories"]} />;
}
