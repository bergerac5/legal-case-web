"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { claimProperty } from "@/services/insurance.api";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import { AxiosError } from "axios";

export default function ClaimForm() {
  const { id } = useParams();
  const router = useRouter();

  const [description, setDescription] = useState("");
  const [claimAmount, setClaimAmount] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const claimMutation = useMutation({
    mutationFn: claimProperty,
    onSuccess: () => {
      router.push("/property-claims");
    },
    onError: (error: AxiosError) => {
  const message = (error.response?.data as { message?: string })?.message;
  setErrors({
    general: message ?? "Failed to submit claim. Please try again.",
  });
  },

  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const errorBag: { [key: string]: string } = {};

    if (!claimAmount || isNaN(Number(claimAmount)) || Number(claimAmount) <= 0) {
      errorBag.claimAmount = "Claim amount must be a positive number.";
    }

    if (!description.trim()) {
      errorBag.description = "Description is required.";
    }

    if (Object.keys(errorBag).length > 0) {
      setErrors(errorBag);
      return;
    }

    claimMutation.mutate({
      property_id: id as string,
      type: "REG",
      claimProgress: "PENDING",
      dateOfClaim: new Date().toISOString(),
      description,
      claimAmount: Number(claimAmount),
    });
  };

  return (
    <div className="p-10 max-w-3xl mx-auto bg-white mt-10 shadow rounded-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800"> Submit a Property Claim </h1>
       <form
        onSubmit={handleSubmit}
         className="space-y-6"
      >
        <p className="text-center text-sm text-gray-500 mb-2">
          Property ID: <span className="font-medium">{id}</span>
        </p>

        {/* Claim Type */}
        <div className="space-y-2">
       <label htmlFor="type" className="block text-sm font-medium text-gray-700">
    Claim Type
    </label>
      <Input
       type="text"
      id="type"
      value="REG"
      readOnly
        className="w-full border border-gray-300 rounded px-4 py-2"
     />
   </div>

        {/* Claim Amount */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Estimated Claim Amount (RWF)
          </label>
          <Input
            type="number"
            value={claimAmount}
            onChange={(e) => setClaimAmount(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
            min={1}
          />
          {errors.claimAmount && (
            <p className="text-red-600 text-sm mt-1">{errors.claimAmount}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            placeholder="Describe the issue in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full pl-4 pr-4 py-2 border border-gray-400 rounded-md focus:outline-none bg-gray-200 resize-none"
            rows={5}
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 rounded cursor-pointer"
          >
            Cancel
          </button>
          <Button
            type="submit"
            label={claimMutation.isPending ? "Submitting..." : "Submit Claim"}
            disabled={claimMutation.isPending}
            className="bg-pink-800 text-white py-2 px-6 rounded-md hover:bg-pink-900 cursor-pointer"
          />
        </div>

        {/* General error */}
        {errors.general && (
          <p className="text-red-600 text-center mt-4 font-semibold">
            {errors.general}
          </p>
        )}
      </form>
    </div>
  );
}
