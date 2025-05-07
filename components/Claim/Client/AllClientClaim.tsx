"use client"
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAllClientClaims } from "@/services/insurance.api";
import { FolderX } from "lucide-react";
import Link from "next/link";
import { PaginatedClientClaimResponse } from "@/lib/types";

const ROWS_PER_PAGE = 10;

export default function ClientsClaims() {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery<PaginatedClientClaimResponse>({
    queryKey: ["client-claims", page],
    queryFn: () => getAllClientClaims(page),
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
        <p>No client claims available.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Client Insurance Claims</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600 text-center">Failed to fetch client claims.</p>
      ) : (
        <>
          <table className="w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">ID</th>
                <th className="p-2">Client</th>
                <th className="p-2">Phone</th>
                <th className="p-2">POC</th>
                <th className="p-2">Address</th>
                <th className="p-2">Progress</th>
                <th className="p-2">Claim Amount</th>
                <th className="p-2">Date</th>
                <th className="p-2">Description</th>
                <th className="p-2">Damaged Items</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
  {data.data.map((claim, index) => (
    <tr key={claim.claimId} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} text-center border-t`}>
      <td className="p-2">{String((page - 1) * ROWS_PER_PAGE + index + 1).padStart(3, "0")}</td>
      <td className="p-2">{claim.client[0]?.names}</td>
      <td className="p-2">{claim.client[0]?.phoneNumber}</td>
      <td className="p-2">{claim.client[0]?.poc}</td>
      <td className="p-2">{claim.client[0]?.address}</td>
      <td className="p-2">{claim.claimProgress}</td>
      <td className="p-2">${claim.claimAmount}</td>
      <td className="p-2">{new Date(claim.dateOfClaim).toLocaleDateString()}</td>
      <td className="p-2 max-w-xs truncate">{claim.description}</td>
      <td className="p-2">
        {claim.damagedItems.slice(0, 2).map((item, i) => (
          <div key={i}>{item.itemName}</div>
        ))}
      </td>
      <td className="p-2">
        <Link href={`/client-claim/${claim.claimId}`} className="text-blue-600 hover:underline">
          View
        </Link>
      </td>
    </tr>
  ))}
</tbody>

          </table>

          {/* Pagination Controls */}
          {data.total > ROWS_PER_PAGE && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm">
                Page {page} of {data.totalPages}
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, data.totalPages))}
                disabled={page === data.totalPages}
                className="px-4 py-2 border rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
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
