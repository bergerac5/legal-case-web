"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAllPropertyClaims } from "@/services/insurance.api";
import { FolderX } from "lucide-react";

// Define the types
interface Property {
  id: string;
  name: string;
  department: string;
  location: string;
}

interface InsuranceClaim {
  id: string;
  type: string;
  claimProgress: string;
  claimAmount: number;
  dateOfClaim: string;
  description: string;
  property: Property;
}

interface PaginatedClaimResponse {
  data: InsuranceClaim[];
  total: number;
  page: number;
  totalPages: number;
}

const ROWS_PER_PAGE = 10;

export default function PropertiesClaim() {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery<PaginatedClaimResponse>({
    queryKey: ["reg-claims", page],
    queryFn: () => getAllPropertyClaims(page),
    placeholderData: () => ({
      data: [],
      total: 0,
      page,
      totalPages: 0,
    }),
  });

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-500">
        <FolderX size={48} className="mb-4" />
        <p>No claims available.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">REG Property Claims</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600 text-center">Failed to fetch claims.</p>
      ) : (
        <>
          <table className="w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">#</th>
                <th className="p-2">Property</th>
                <th className="p-2">Location</th>
                <th className="p-2">Type</th>
                <th className="p-2">Progress</th>
                <th className="p-2">Claim Amount</th>
                <th className="p-2">Date</th>
                <th className="p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((claim, index) => (
                <tr
                  key={claim.id}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} text-center border-t`}
                >
                  <td className="p-2">{String((page - 1) * ROWS_PER_PAGE + index + 1).padStart(3, "0")}</td>
                  <td className="p-2">{claim.property.name}</td>
                  <td className="p-2">{claim.property.location}</td>
                  <td className="p-2">{claim.type}</td>
                  <td className="p-2">{claim.claimProgress}</td>
                  <td className="p-2">${claim.claimAmount}</td>
                  <td className="p-2">{new Date(claim.dateOfClaim).toLocaleDateString()}</td>
                  <td className="p-2 max-w-xs truncate">{claim.description}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {data.total > ROWS_PER_PAGE && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm">
                Page {page} of {data.totalPages}
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, data.totalPages))}
                disabled={page === data.totalPages}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
