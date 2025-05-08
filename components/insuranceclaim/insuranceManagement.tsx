"use client";

import { useState } from "react";
import Link from "next/link";

const dummyClaims = {
  reg: [
    { status: "Pending" },
    { status: "Completed" },
    { status: "Failed" },
    { status: "Pending" },
  ],
  client: [
    { status: "Completed" },
    { status: "Failed" },
    { status: "Pending" },
  ],
};

export default function InsuranceClaim() {
  const [claimType, setClaimType] = useState("reg");

  const countByStatus = (claims, status) =>
    claims.filter((c) => c.status === status).length;

  const regClaims = dummyClaims.reg;
  const clientClaims = dummyClaims.client;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Insurance Claims Management</h1>

      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* REG Claim Overview */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">REG Property Claims</h2>
          <p className="text-sm text-gray-600 mb-4">Overview of REG-submitted property claims</p>
          <ul className="space-y-1 text-sm">
            <li>Pending: <span className="font-semibold">{countByStatus(regClaims, "Pending")}</span></li>
            <li>Completed: <span className="font-semibold">{countByStatus(regClaims, "Completed")}</span></li>
            <li>Failed: <span className="font-semibold">{countByStatus(regClaims, "Failed")}</span></li>
          </ul>
          <Link
            href="/claims/reg"
            className="inline-block mt-4 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
          >
            Go to REG Claims
          </Link>
        </div>

        {/* Client Claim Overview */}
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Client Insurance Claims</h2>
          <p className="text-sm text-gray-600 mb-4">Overview of claims filed by clients</p>
          <ul className="space-y-1 text-sm">
            <li>Pending: <span className="font-semibold">{countByStatus(clientClaims, "Pending")}</span></li>
            <li>Completed: <span className="font-semibold">{countByStatus(clientClaims, "Completed")}</span></li>
            <li>Failed: <span className="font-semibold">{countByStatus(clientClaims, "Failed")}</span></li>
          </ul>
          <Link
            href="/claims/client"
            className="inline-block mt-4 text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
          >
            Go to Client Claims
          </Link>
        </div>

        {/* Add Client Claim Prompt */}
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg shadow col-span-full xl:col-span-2">
          <h2 className="text-lg font-semibold mb-2">Report Property Damage</h2>
          <p className="text-sm text-gray-700 mb-4">
            If your property was damaged due to REG Electricity issues, you can file a claim easily.
          </p>
          <Link
            href="/claims/client/create"
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-md font-medium"
          >
            Add New Client Claim
          </Link>
        </div>
      </div>
    </div>
  );
}
