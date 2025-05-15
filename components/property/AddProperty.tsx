"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { addProperty } from "@/services/insurance.api";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { AxiosError } from "axios";

export default function AddProperty() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    department: "",
    location: "",
    boughtTime: "",
    manufacturer: "",
    supplier: "",
    status: true
  });

  const [error, setError] = useState("");

  const registerPropertyMutation = useMutation({
    mutationFn: addProperty,
    onSuccess: () => {
      router.push("/properties");
    },
    onError: (error: AxiosError) => {
      setError(
        (error.response?.data as { message?: string })?.message || "Failed to add property.");
    },
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const propertyData = {
      ...formData,
      price: Number(formData.price),
      boughtTime: new Date(formData.boughtTime).toISOString(),
    };
  

    registerPropertyMutation.mutate({
      ...propertyData,
      status: formData.status,
    });
  };

  return (
    <div className="p-10 max-w-3xl mx-auto bg-white mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">Register Property</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        
      <div className="space-y-4">
            <Input
              type="text"
              placeholder="Name Of Property"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Price Of Property"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
            />
            <Input
              type="Text"
              placeholder="Department Property Belong"
              value={formData.department}
              onChange={(e) => handleChange("department", e.target.value)}
            />
             <Input
              type="Text"
              placeholder="Location Of Property"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
            <label className="font-semibold">Date Of Bought</label>
            <Input
              type="Date"
              placeholder="Bought Date"
              value={formData.boughtTime}
              onChange={(e) => handleChange("boughtTime", e.target.value)}
            />
            <Input
              type="Text"
              placeholder="Manufacturer Of Property"
              value={formData.manufacturer}
              onChange={(e) => handleChange("manufacturer", e.target.value)}
            />
            <Input
              type="Text"
              placeholder="Supplier Of Property"
              value={formData.supplier}
              onChange={(e) => handleChange("supplier", e.target.value)}
            />
          </div>
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
           label={registerPropertyMutation.isPending ? "Saving..." : "Save"}
           className="bg-pink-800 text-white py-2 px-6 rounded-md hover:bg-pink-900 cursor-pointer"
           disabled={registerPropertyMutation.isPending}
          />
        </div>

        {error && <p className="text-red-600 mt-4">{error}</p>}
      </form>
    </div>
  );
}
