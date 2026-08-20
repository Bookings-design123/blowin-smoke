import type { Metadata } from "next";

import { DivisionLanding } from "@/components/DivisionLanding";
import { DIVISIONS } from "@/lib/divisions";

export const metadata: Metadata = { title: "THCA" };
export const dynamic = "force-dynamic";

export default function ThcaPage() {
  return <DivisionLanding content={DIVISIONS.thca} />;
}
