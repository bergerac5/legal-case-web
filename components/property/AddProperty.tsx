"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { addProperty } from "@/services/insurance.api";
import Input from "../UI/Input";

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
  });

  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: addProperty,
    onSuccess: () => {
      router.push("/properties");
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || "Failed to add property.");
    },
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      ...formData,
      price: Number(formData.price),
    });
  };

  return (
    <div className="p-10 max-w-3xl mx-auto bg-white mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">Register Property</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        
      <div className="space-y-4">
            <Input
              type="text"
              placeholder="Property Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
            <Input
              type="number"
              placeholder="Property Price"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
              required
            />
            <Input
              type="Text"
              placeholder="Department"
              value={formData.department}
              onChange={(e) => handleChange("department", e.target.value)}
              required
            />
             <Input
              type="Text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              required
            />
            <Input
              type="Date"
              placeholder="Bought Date"
              value={formData.boughtTime}
              onChange={(e) => handleChange("boughtTime", e.target.value)}
              required
            />
            <Input
              type="Text"
              placeholder="Manufacturer"
              value={formData.manufacturer}
              onChange={(e) => handleChange("manufacturer", e.target.value)}
              required
            />
            <Input
              type="Text"
              placeholder="Supplier"
              value={formData.supplier}
              onChange={(e) => handleChange("supplier", e.target.value)}
              required
            />
          </div>
        <div className="flex items-center gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-pink-700 text-white rounded hover:bg-pink-800"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </button>
        </div>

        {error && <p className="text-red-600 mt-4">{error}</p>}
      </form>
    </div>
  );
}
