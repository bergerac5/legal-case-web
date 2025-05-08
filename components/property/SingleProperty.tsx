"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { getPropertyById } from "@/services/insurance.api";
import { Loader2 } from "lucide-react";

export default function PropertyDetails() {
  const { id } = useParams();
  const router = useRouter();

  const {
    data: property,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["property", id],
    queryFn: () => getPropertyById(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <Loader2 className="animate-spin h-10 w-10 text-gray-600" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100 text-red-600 text-center">
        Failed to load property details.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Property Details</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <div><strong>Name:</strong> {property.name}</div>
          <div><strong>Price:</strong> {property.price} RWF</div>
          <div><strong>Department:</strong> {property.department}</div>
          <div><strong>Location:</strong> {property.location}</div>
          <div><strong>Bought Time:</strong> {new Date(property.boughtTime).toLocaleDateString()}</div>
          <div><strong>Manufacturer:</strong> {property.manufacturer}</div>
          <div>
            <strong>Status:</strong>{" "}
            <span className={`inline-block px-2 py-1 rounded text-white text-sm ${property.status ? "bg-green-600" : "bg-red-500"}`}>
              {property.status ? "Active" : "Damaged"}
            </span>
          </div>
          <div><strong>Supplier:</strong> {property.supplier}</div>
        </div>

        <div className="pt-4 text-center">
          <button
            onClick={() => router.push(`/property/${id}/claim`)}
            className="bg-pink-800 text-white py-2 px-6 rounded-md hover:bg-pink-900 cursor-pointer"
          >
            Claim This Property
          </button>
        </div>
      </div>
    </div>
  );
}
