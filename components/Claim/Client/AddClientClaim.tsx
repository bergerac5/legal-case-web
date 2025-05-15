"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { addClientClaim } from "@/services/insurance.api";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import { AxiosError } from "axios";

export default function AddClientClaim() {
  const router = useRouter();

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    client: {
      names: "",
      poc: "",
      phoneNumber: "",
      address: "",
    },
    type: "Client",
    claimProgress: "PENDING",
    dateOfClaim: "",
    description: "",
    claimAmount: "",
    damagedItems: [{ itemName: "" }],
  });

  const addClaimMutation = useMutation({
    mutationFn: addClientClaim,
    onSuccess: (data) => {
  if (data.message === "Client claim successfully submitted.") {
    router.push("/client-claims");
  } else if (data.status === "error") {
    // show message directly
    setErrors({ general: data.message || "An error occurred" });
  }
},
onError: (error: AxiosError) => {
  const response = error.response?.data as any;
  if (response?.message) {
    setErrors({ general: response.message });
  } else {
    setErrors({ general: "Failed to add claim. Please try again." });
  }
},

  });

  

  const updateClientField = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      client: { ...prev.client, [field]: value },
    }));
    clearError(`client.${field}`);
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearError(field);
  };

  const updateItemField = (index: number, value: string) => {
    const updatedItems = [...formData.damagedItems];
    updatedItems[index] = { itemName: value };
    setFormData((prev) => ({ ...prev, damagedItems: updatedItems }));
    clearError(`damagedItems[${index}].itemName`);
  };

  const clearError = (field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const addNewItem = () => {
    setFormData((prev) => ({
      ...prev,
      damagedItems: [...prev.damagedItems, { itemName: "" }],
    }));
  };

  const removeItem = (index: number) => {
    if (formData.damagedItems.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      damagedItems: prev.damagedItems.filter((_, i) => i !== index),
    }));
    clearError(`damagedItems[${index}].itemName`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const errorBag: { [key: string]: string } = {};

    if (!formData.client.names.trim()) errorBag["client.names"] = "Full name is required.";
    if (!formData.client.poc.trim()) errorBag["client.poc"] = "POC is required.";
    if (!formData.client.phoneNumber.trim()) errorBag["client.phoneNumber"] = "Phone number is required.";
    if (!formData.client.address.trim()) errorBag["client.address"] = "Address is required.";

    if (!formData.dateOfClaim) {
      errorBag.dateOfClaim = "Please select a valid date of claim.";
    } else if (isNaN(new Date(formData.dateOfClaim).getTime())) {
      errorBag.dateOfClaim = "Invalid date format.";
    }

    if (!formData.description.trim()) errorBag.description = "Description is required.";
    if (!formData.claimAmount || isNaN(Number(formData.claimAmount))) {
      errorBag.claimAmount = "Claim amount must be a valid number.";
    }

    formData.damagedItems.forEach((item, index) => {
      if (!item.itemName.trim()) {
        errorBag[`damagedItems[${index}].itemName`] = "Item name is required.";
      }
    });

    if (Object.keys(errorBag).length > 0) {
      setErrors(errorBag);
      return;
    }

    const clientClaimDetails = {
      ...formData,
      claimAmount: Number(formData.claimAmount),
      dateOfClaim: new Date(formData.dateOfClaim).toISOString(),
    };

    addClaimMutation.mutate(clientClaimDetails);
  };

  return (
    <div className="p-10 max-w-3xl mx-auto bg-white mt-10 shadow rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">
        Submit Insurance Client Claim
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Info */}
        <div className="space-y-4">
          {[{ label: "Full Name", field: "names" },
            { label: "POC", field: "poc" },
            { label: "Phone Number", field: "phoneNumber" },
            { label: "Address", field: "address" }].map(({ label, field }) => (
            <div key={field}>
              <Input
                type="text"
                placeholder={label}
                value={formData.client[field as keyof typeof formData.client]}
                onChange={(e) => updateClientField(field, e.target.value)}
              />
              {errors[`client.${field}`] && (
                <p className="text-red-600 text-sm mt-1">
                  {errors[`client.${field}`]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Claim Info */}
        <div className="space-y-4">
          <label className="font-semibold">Date of Claim</label>
          <Input
            type="date"
            value={formData.dateOfClaim}
            onChange={(e) => updateField("dateOfClaim", e.target.value)}
          />
          {errors.dateOfClaim && (
            <p className="text-red-600 text-sm mt-1">{errors.dateOfClaim}</p>
          )}

          <textarea
            placeholder="Describe the issue in detail..."
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={5}
            className="w-full pl-4 pr-4 py-2 border border-gray-400 rounded-md focus:outline-none bg-gray-200 resize-none"
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description}</p>
          )}

          <Input
            type="number"
            placeholder="Claim Amount"
            value={formData.claimAmount}
            onChange={(e) => updateField("claimAmount", e.target.value)}
          />
          {errors.claimAmount && (
            <p className="text-red-600 text-sm mt-1">{errors.claimAmount}</p>
          )}
        </div>

        {/* Damaged Items */}
        <div className="space-y-2">
          <label className="font-semibold">Damaged Properties</label>
          {formData.damagedItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Property Name"
                value={item.itemName}
                onChange={(e) => updateItemField(index, e.target.value)}
              />
              {formData.damagedItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-900 font-bold text-xl px-2 cursor-pointer"
                  title="Remove Item"
                >
                  -
                </button>
              )}
              {errors[`damagedItems[${index}].itemName`] && (
                <p className="text-red-600 text-sm mt-1">
                  {errors[`damagedItems[${index}].itemName`]}
                </p>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addNewItem}
            className="text-blue-600 font-medium mt-2 cursor-pointer"
          >
            + Add Item
          </button>
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
            label={addClaimMutation.isPending ? "Submitting..." : "Submit"}
            className="bg-pink-800 text-white py-2 px-6 rounded-md hover:bg-pink-900 cursor-pointer"
            disabled={addClaimMutation.isPending}
          />
        </div>

        {/* General Error */}
        {errors.general && (
          <p className="text-red-600 text-center mt-4 font-semibold">
            {errors.general}
          </p>
        )}
      </form>
    </div>
  );
}
