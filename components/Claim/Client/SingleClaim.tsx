"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getClaimClaimById, updateClaimProgress } from "@/services/insurance.api";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function ClaimDetails() {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { id } = useParams();
  const queryClient = useQueryClient();

  const {
    data: claim,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["claim", id],
    queryFn: () => getClaimClaimById(id as string),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: updateClaimProgress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["claim", id] });
      setMessage({ type: "success", text: "Claim Progress updated successfully!" });
      setTimeout(() => setMessage(null), 3000);
    },
    onError: () => {
      setMessage({ type: "error", text: "Failed to update claim status." });
      setTimeout(() => setMessage(null), 3000);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <Loader2 className="animate-spin h-10 w-10 text-gray-600" />
      </div>
    );
  }

  if (error || !claim) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100 text-red-600 text-center">
        Failed to load claim details.
      </div>
    );
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    mutation.mutate({
      id: claim.claimId,
      claimProgress: e.target.value as "PENDING" | "COMPLETED" | "FAILED",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Client Claim Details</h1>

        {message && (
          <div
            className={`p-3 rounded text-sm font-medium ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-400"
                : "bg-red-100 text-red-700 border border-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <div><strong>Type:</strong> {claim.type} Properties</div>
          <div><strong>Date of Claim:</strong> {new Date(claim.dateOfClaim).toLocaleDateString()}</div>
          <div><strong>Description:</strong> {claim.description}</div>
          <div><strong>Claim Amount:</strong> {claim.claimAmount} RWF</div>
          <div>
            <label htmlFor="progress"><strong>Progress:</strong></label>
            <select
              id="progress"
              className="ml-2 p-1 border rounded"
              value={claim.claimProgress}
              onChange={handleStatusChange}
              disabled={mutation.isPending}
            >
              <option value="PENDING">PENDING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>
        </div>

        {/* Damaged Items */}
        <div className="pt-6">
          <h2 className="text-xl font-semibold mb-2">Properties Claimed By Client</h2>
          {claim.damagedItems?.length > 0 ? (
            <ul className="list-disc pl-5 text-gray-700">
              {claim.damagedItems.map((item) => (
                <li key={item.id}>{item.itemName}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No damaged items listed.</p>
          )}
        </div>

        {/* Client Info & Result Side-by-Side */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Info */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Client Info</h2>
            <div className="space-y-1 text-gray-700">
              <p><strong>Name:</strong> {claim.client?.names}</p>
              <p><strong>Phone:</strong> {claim.client?.phoneNumber}</p>
              <p><strong>POC:</strong> {claim.client?.poc}</p>
              <p><strong>Address:</strong> {claim.client?.address}</p>
            </div>
          </div>

          {/* Result On Claim */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Result On Claim</h2>
            {claim.result ? (
              <div className="space-y-1 text-gray-700">
                <p><strong>Decision:</strong> {claim.result.decision}</p>
                <p><strong>Reason:</strong> {claim.result.reason}</p>
                <p><strong>Amount Approved:</strong> {claim.result.amountApproved} RWF</p>
                <p><strong>Resolved At:</strong> {new Date(claim.result.createdAt).toLocaleDateString()}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No result has been added to this claim yet.
              </p>
            )}
          </div>
        </div>

        {/* View Result Button */}
        <div className="pt-6 flex justify-end">
          <Link
            href={`/add-result`}
            className="inline-block bg-pink-800 hover:bg-pink-900 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Add Result On This Claim
          </Link>
        </div>
      </div>
    </div>
  );
}
