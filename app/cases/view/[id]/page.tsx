import ViewCasePage from "@/components/case/caseView";
import { notFound } from "next/navigation";
import React from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const actualParams = React.use(params);

  if (!actualParams?.id) {
    return notFound();
  }

    console.log("Route received ID:", actualParams.id);
  return <ViewCasePage params={{id: actualParams.id}}/>
}