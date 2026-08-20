import type { Metadata } from "next";

import { DivisionLanding } from "@/components/DivisionLanding";
import { DIVISIONS } from "@/lib/divisions";

export const metadata: Metadata = { title: "Vape & Nicotine" };
export const dynamic = "force-dynamic";

export default function VapeNicotinePage() {
  return <DivisionLanding content={DIVISIONS["vape-nicotine"]} />;
}
