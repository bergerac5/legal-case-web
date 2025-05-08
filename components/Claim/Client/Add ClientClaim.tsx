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
  const [error, setError] = useState("");

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
    onSuccess: () => router.push("/client-claims"),
    onError: (error: AxiosError) => {
          setError(
            (error.response?.data as { message?: string })?.message || "Failed to add property.");
        },
  });

  const handleClientChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      client: { ...formData.client, [field]: value },
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleItemChange = (index: number, value: string) => {
    const updatedItems = [...formData.damagedItems];
    updatedItems[index] = { itemName: value };
    setFormData({ ...formData, damagedItems: updatedItems });
  };

   // function to  increase input box when needed on
  const addNewItem = () => {
    setFormData({
      ...formData,
      damagedItems: [...formData.damagedItems, { itemName: "" }],
    });
  };

  // Function to Submit Data In Database
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clientClaimDetails = {
      ...formData,
      claimAmount: Number(formData.claimAmount),
      dateOfClaim: new Date(formData.dateOfClaim).toISOString(),
    }
    addClaimMutation.mutate({
      ...clientClaimDetails
    });
  };

  // function to Decrease input box when needed
  const removeItem = (index: number) => {
    if (formData.damagedItems.length === 1) return;
    const updatedItems = formData.damagedItems.filter((_, i) => i !== index);
    setFormData({ ...formData, damagedItems: updatedItems });
  };
  

  return (
    <div className="p-10 max-w-3xl mx-auto bg-white mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">Submit Insurance Client Claim</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Information */}
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Full Name"
            value={formData.client.names}
            onChange={(e) => handleClientChange("names", e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="POC"
            value={formData.client.poc}
            onChange={(e) => handleClientChange("poc", e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Phone Number"
            value={formData.client.phoneNumber}
            onChange={(e) => handleClientChange("phoneNumber", e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Address"
            value={formData.client.address}
            onChange={(e) => handleClientChange("address", e.target.value)}
            required
          />
        </div>

        {/* Claim Information */}
        <div className="space-y-4">
        <label className="font-semibold">Date Of Claim</label>
          <Input
            type="date"
            placeholder="Date of Claim"
            value={formData.dateOfClaim}
            onChange={(e) => handleChange("dateOfClaim", e.target.value)}
            required
          />
          <textarea
            required
            placeholder="Describe the issue in detail..."
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={5}
            className="w-full pl-10 pr-4 py-2 border border-gray-400 rounded-md focus:outline-none bg-gray-200 resize-none"
          />
          <Input
            type="number"
            placeholder="Claim Amount"
            value={formData.claimAmount}
            onChange={(e) => handleChange("claimAmount", e.target.value)}
            required
          />
        </div>

        {/* Property claimed By Client */}
   <div className="space-y-2">
  <label className="font-semibold">Damaged Properties</label>
  {formData.damagedItems.map((item, index) => (
    <div key={index} className="flex items-center gap-2">
      <Input
        type="text"
        placeholder="Property Name"
        value={item.itemName}
        onChange={(e) => handleItemChange(index, e.target.value)}
        required
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
            className="px-4 py-2 bg-gray-200 rounded"
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

        {error && <p className="text-red-600 mt-4">{error}</p>}
      </form>
    </div>
  );
}
