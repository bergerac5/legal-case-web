"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getSinglePropertyClaim, updateClaimProgress } from "@/services/insurance.api";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function PropertyClaimDetails() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    data: claim,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["property-claim", id],
    queryFn: () => getSinglePropertyClaim(id as string),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: updateClaimProgress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property-claim", id] });
      setMessage({ type: "success", text: "Claim  Progress updated successfully!" });
      setTimeout(() => setMessage(null), 3000); // auto hide notification message after 3 sec
    },
    onError: () => {
      setMessage({ type: "error", text: "Failed to update claim Progress." });
      setTimeout(() => setMessage(null), 3000);
    },
  });

  const handleProgressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    mutation.mutate({
      id: claim.id,
      claimProgress: e.target.value as "PENDING" | "COMPLETED" | "FAILED",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <Loader2 className="animate-spin h-10 w-10 text-gray-600" />
      </div>
    );
  }

  if (error || !claim) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600 text-center">
        Failed to load property claim.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Property Insurance Claim Details</h1>

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
          <div><strong>Type Of Claim:</strong> {claim.type} Property</div>
          <div><strong>Date Of Claim:</strong> {new Date(claim.dateOfClaim).toLocaleDateString()}</div>
          <div><strong>Description:</strong> {claim.description}</div>
          <div><strong>Claim Amount:</strong> {claim.claimAmount} RWF</div>

          <div>
            <label htmlFor="progress"><strong>Claim Progress:</strong></label>
            <select
              id="progress"
              className="ml-2 p-1 border rounded"
              value={claim.claimProgress}
              onChange={handleProgressChange}
              disabled={mutation.isPending}
            >
              <option value="PENDING">PENDING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>
        </div>

        <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
          <h2 className="text-xl font-semibold mb-2">Property Info</h2>
          <div className="space-y-1 text-gray-700">
            <p><strong>Name:</strong> {claim.property?.name}</p>
            <p><strong>Owner:</strong> {claim.type}</p>
            <p><strong>Location:</strong> {claim.property?.location}</p>
            <p><strong>BouhtDate:</strong> {new Date(claim.property?.boughtTime).toLocaleDateString()} </p>
            <p><strong>Department:</strong> {claim.property?.department}</p>
            <p><strong>Property Value:</strong> {claim.property?.price} RWF</p>
            <p><strong>Supplier:</strong> {claim.property?.supplier}</p>
            <p><strong>Manufacturer:</strong> {claim.property?.manufacturer}</p>
          </div>
          </div>
          <div>
  <h2 className="text-xl font-semibold mb-2">Result On Claim</h2>
  {claim.result ? (
  <div className="space-y-1 text-gray-700">
    <p><strong>Decision:</strong> {claim.result.decision}</p>
    <p><strong>Reason:</strong> {claim.result.reason}</p>
    <p><strong>Amount Approved:</strong> {claim.result.amountApproved ?? "N/A"} RWF</p>
    <p>
      <strong>Resolved At:</strong>{" "}
      {claim.result.reviewedAt
        ? new Date(claim.result.reviewedAt).toLocaleDateString()
        : "Not reviewed yet"}
    </p>
  </div>
) : (
  <p className="text-sm text-gray-500 italic">
    No result has been added to this claim yet.
  </p>
)}

</div>

          </div>
          
          {/* Result Button */}
        <div className="pt-6 text-center">
          <Link
            href={"/add-result"}
            className="inline-block bg-pink-800 hover:bg-pink-900  text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Add Result On This Claim
          </Link>
          </div>
      </div>
    </div>
  );
}
