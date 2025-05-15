"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Input from "@/components/UI/Input";
import { useMutation } from "@tanstack/react-query";
import { addClaimResult } from "@/services/insurance.api";
import { AddClaimResultInput } from "@/lib/types";
import { AxiosError } from "axios";

export default function AddResultForm() {
  const { id } = useParams(); // Claim ID
  const router = useRouter();

  const [decision, setDecision] = useState("");
  const [reason, setReason] = useState("");
  const [amountApproved, setAmountApproved] = useState("");
  
  // Error state for each field
  const [errors, setErrors] = useState<{ decision?: string; reason?: string; amountApproved?: string }>({});

  const mutation = useMutation({
    mutationFn: (payload: AddClaimResultInput) => addClaimResult(payload),
    onSuccess: () => {
      router.back();
    },
    onError: (err: AxiosError) => {
      setErrors({ decision: undefined, reason: undefined, amountApproved: undefined });
      alert(
        (err.response?.data as { message?: string })?.message ||
          "Failed to submit result."
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors: typeof errors = {};

    if (!decision.trim()) validationErrors.decision = "Decision is required.";
    if (!reason.trim()) validationErrors.reason = "Reason is required.";
    if (!amountApproved.trim()) {
      validationErrors.amountApproved = "Approved amount is required.";
    } else {
      const parsedAmount = parseFloat(amountApproved);
      if (isNaN(parsedAmount) || parsedAmount < 0) {
        validationErrors.amountApproved = "Approved amount must be a positive number.";
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({}); // Clear previous errors

    const payload: AddClaimResultInput = {
      claimId: id as string,
      decision: decision.trim(),
      reason: reason.trim(),
      amountApproved: parseFloat(amountApproved),
    };

    mutation.mutate(payload);
  };

  return (
    <div className="p-10 max-w-3xl mx-auto bg-white mt-10 shadow rounded-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800">Submit Result On Claim</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
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
            placeholder="e.g. Approved, Rejected"
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
          {errors.decision && (
            <p className="text-red-600 text-sm mt-1">{errors.decision}</p>
          )}
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
            placeholder="State the reasoning behind the decision..."
            className="w-full pl-4 pr-4 py-2 border border-gray-400 rounded-md focus:outline-none bg-gray-200 resize-none"
            rows={4}
          />
          {errors.reason && (
            <p className="text-red-600 text-sm mt-1">{errors.reason}</p>
          )}
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
            min={0}
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
          {errors.amountApproved && (
            <p className="text-red-600 text-sm mt-1">{errors.amountApproved}</p>
          )}
        </div>

        {/* Submit & Cancel */}
        <div className="flex items-center gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-pink-800 text-white py-2 px-6 rounded-md hover:bg-pink-900 disabled:opacity-60 cursor-pointer"
          >
            {mutation.isPending ? "Submitting..." : "Submit Result"}
          </button>
        </div>
      </form>
    </div>
  );
}
