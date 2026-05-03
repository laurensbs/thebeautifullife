import { Suspense } from "react";
import PageLoader from "@/components/ui/PageLoader";
import PlanCallView from "./PlanCallView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Plan je call — The Beautiful Life",
  robots: { index: false, follow: false },
};

export default function PlanCallPage() {
  return (
    <Suspense fallback={<PageLoader label="een moment…" />}>
      <PlanCallView />
    </Suspense>
  );
}
