"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { claimProperty } from "@/services/insurance.api";

export default function ClaimForm() {
  const { id } = useParams();
  const router = useRouter();

  const [description, setDescription] = useState("");
  const [type, setType] = useState("Client");
  const [claimAmount, setClaimAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await claimProperty({
        property_id: id as string,
        type: type as "Client" | "REG",
        claimProgress: "PENDING",
        dateOfClaim: new Date().toISOString(),
        description,
        claimAmount,
      });
      alert("Claim submitted!");
      router.push(`/property/${id}`);
    } catch (err) {
      console.error(err);
      alert("Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white flex justify-center items-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-xl space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Submit a Property Claim
        </h1>
        <p className="text-center text-sm text-gray-500 mb-2">
          Property ID: <span className="font-medium">{id}</span>
        </p>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Claim Initiator (Type)
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          >
            <option value="Client">Client</option>
            <option value="REG">REG</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Estimated Claim Amount (USD)
          </label>
          <input
            type="number"
            value={claimAmount}
            onChange={(e) => setClaimAmount(Number(e.target.value))}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
            min={1}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            required
            placeholder="Describe the issue in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
            rows={5}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Submitting Claim..." : "Submit Claim"}
        </button>
      </form>
    </div>
  );
}
