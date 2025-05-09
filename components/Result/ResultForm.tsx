"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Input from "@/components/UI/Input";
import { addClaimResult } from "@/services/insurance.api";
import { AddClaimResultInput } from "@/lib/types";
export default function AddResultForm() {
  const { id } = useParams(); // Claim ID
  const router = useRouter();

  const [decision, setDecision] = useState("");
  const [reason, setReason] = useState("");
  const [amountApproved, setAmountApproved] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload: AddClaimResultInput = {
        claimId: id as string,
        decision,
        reason,
        amountApproved: parseFloat(amountApproved),
      };
      await addClaimResult(payload);
      alert("Claim result added successfully!");
      router.push("/insurance-claims");
    } catch (err) {
      console.error(err);
      alert("Failed to submit result.");
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
          Submit Claim Result
        </h1>
        <p className="text-center text-sm text-gray-500 mb-2">
          Claim ID: <span className="font-medium">{id}</span>
        </p>

        {/* Decision */}
        <div className="space-y-2">
          <label htmlFor="decision" className="block text-sm font-medium text-gray-700">
            Decision
          </label>
          <Input
            id="decision"
            type="text"
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            required
            placeholder="e.g. Approved, Rejected"
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
        </div>

        {/* Reason */}
        <div className="space-y-2">
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
            Reason
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            placeholder="State the reasoning behind the decision..."
            className="w-full pl-3 pr-4 py-2 border border-gray-400 rounded-md bg-gray-100 resize-none"
            rows={4}
          />
        </div>

        {/* Amount Approved */}
        <div className="space-y-2">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Approved Amount (RWF)
          </label>
          <Input
            id="amount"
            type="number"
            value={amountApproved}
            onChange={(e) => setAmountApproved(e.target.value)}
            required
            min={0}
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-700 text-white py-2 px-6 rounded-md hover:bg-green-800"
        >
          {loading ? "Submitting Result..." : "Submit Result"}
        </button>
      </form>
    </div>
  );
}
