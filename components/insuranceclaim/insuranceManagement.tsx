"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getClaimSummary } from "@/services/insurance.api";
import { Loader2} from "lucide-react";

export default function InsuranceClaim() {
  const {
    data: summary,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["claim-summary"],
    queryFn: getClaimSummary,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-600">
        <p>Failed to load insurance claims summary.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-center mb-6">Insurance Claims Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* REG Claims Summary */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">REG Property Claims</h2>
          <p className="text-sm text-gray-600 mb-4">Overview of REG-submitted property claims</p>
          <ul className="space-y-1 text-sm">
            <li>Total: <span className="font-semibold">{summary.REG.total}</span></li>
            <li>Pending: <span className="font-semibold">{summary.REG.pending}</span></li>
            <li>Completed: <span className="font-semibold">{summary.REG.completed}</span></li>
            <li>Failed: <span className="font-semibold">{summary.REG.failed}</span></li>
          </ul>
          <Link
            href="/property-claims"
            className="inline-block mt-4 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
          >
            View Available REG Claims
          </Link>
        </div>

        {/* Client Claims Summary */}
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Client Insurance Claims</h2>
          <p className="text-sm text-gray-600 mb-4">Overview of claims filed by clients</p>
          <ul className="space-y-1 text-sm">
            <li>Total: <span className="font-semibold">{summary.Client.total}</span></li>
            <li>Pending: <span className="font-semibold">{summary.Client.pending}</span></li>
            <li>Completed: <span className="font-semibold">{summary.Client.completed}</span></li>
            <li>Failed: <span className="font-semibold">{summary.Client.failed}</span></li>
          </ul>
          <Link
            href="/client-claims"
            className="inline-block mt-4 text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
          >
            View Available Client Claims
          </Link>
        </div>

        {/* Call-to-Action for New Claim */}
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg shadow col-span-full xl:col-span-2">
          <h2 className="text-lg font-semibold mb-2">Report Client Claim</h2>
          <p className="text-sm text-gray-700 mb-4">
          Submit insurance Client claim, report property damaged caused by 
          electricity issues. <br/>Please ensure accurate client and 
          incident details are provided for proper claim processing.
          </p>
          <Link
            href="/add-client-claim"
            className="inline-block bg-pink-800 text-white py-2 px-6 rounded-md hover:bg-pink-900 cursor-pointer"
          >
            Add New Client Claim
          </Link>
        </div>
      </div>
    </div>
  );
}
