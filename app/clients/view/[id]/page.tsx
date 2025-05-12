"use client";

import ClientViewPage from "@/components/clients/ClientView";
import { notFound } from "next/navigation";
import React from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const actualParams = React.use(params);

  if (!actualParams?.id) {
    return notFound();
  }

  console.log("Route received ID:", actualParams.id);
  return <ClientViewPage params={{ id: actualParams.id }} />;
}
