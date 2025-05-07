"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { claimProperty } from "@/services/insurance.api";
import Input from "@/components/UI/Input";

export default function ClaimForm() {
  const { id } = useParams();
  const router = useRouter();

  const [description, setDescription] = useState("");
  const [type, setType] = useState<"Client" | "REG">("REG");
  const [claimAmount, setClaimAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await claimProperty({
        property_id: id as string,
        type,
        claimProgress: "PENDING",
        dateOfClaim: new Date().toISOString(), // auto-generated timestamp
        description,
        claimAmount: Number(claimAmount), // convert to number
      });
      alert("Claim submitted!");
      router.push("/property-claim");
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

        {/* Claim Type */}
        <div className="space-y-2">
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Claim Type
          </label>
          <select
             id="type"
            value={type}
            onChange={(e) => setType(e.target.value as "Client" | "REG")}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          >
            <option value="Client">Client</option>
            <option value="REG">REG</option>
          </select>
        </div>

        {/* Estimated Amount */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Estimated Claim Amount (USD)
          </label>
          <Input
            type="number"
            value={claimAmount}
            onChange={(e) => setClaimAmount(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
            min={1}
          />
        </div>

        {/* Description */}
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-800 text-white py-2 px-6 rounded-md hover:bg-pink-900 cursor-pointer"
        >
          {loading ? "Submitting Claim..." : "Submit Claim"}
        </button>
      </form>
    </div>
  );
}
