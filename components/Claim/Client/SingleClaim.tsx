"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getClaimClaimById, updateClaimProgress } from "@/services/insurance.api";
import { Loader2 } from "lucide-react";
export default function ClaimDetails() {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <div><strong>Type:</strong> {claim.type}</div>
          <div><strong>Date:</strong> {new Date(claim.dateOfClaim).toLocaleDateString()}</div>
          <div><strong>Description:</strong> {claim.description}</div>
          <div><strong>Claim Amount:</strong>{claim.claimAmount} RWF</div>

          <div>
          <label htmlFor="progress" className="block text-sm font-medium text-gray-700"> Progress:</label>
            <select id="progress"
              className="ml-2 p-1 border rounded"
              value={claim.claimProgress}
              onChange={handleStatusChange}
              disabled={mutation.isPending}
            >
              <option value="PENDING">PENDING</option>
              <option value="COMPLETED">COMPLATED</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>
        </div>

        <div className="pt-6">
          <h2 className="text-xl font-semibold mb-2">Client Info</h2>
          <div className="space-y-1 text-gray-700">
            <p><strong>Name:</strong> {claim.client?.names}</p>
            <p><strong>Phone:</strong> {claim.client?.phoneNumber}</p>
            <p><strong>POC:</strong> {claim.client?.poc}</p>
            <p><strong>Address:</strong> {claim.client?.address}</p>
          </div>
        </div>

        <div className="pt-6">
          <h2 className="text-xl font-semibold mb-2">Damaged Items</h2>
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
      </div>
    </div>
  );
}
