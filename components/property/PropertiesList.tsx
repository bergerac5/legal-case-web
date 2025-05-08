"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllProperties } from "@/services/insurance.api";
import { useState } from "react";
import Link from "next/link";
import { Plus, FolderX, Loader2 } from "lucide-react";
const ROWS_PER_PAGE = 10;

export default function PropertiesPage() {
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["properties", page],
    queryFn: () => getAllProperties(page),
    placeholderData: () => ({
      data: [],
      total: 0,
      page,
      totalPages: 0,
    }),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="h-8 w-8 text-gray-600 animate-spin" />
      </div>
    );
  }
  if (!data) {
    return (
      <div className="min-h-screen flex gap-2 items-center justify-center py-10 bg-gray-100">
        <FolderX size={48} className="mb-4" />
        <p>No data available.</p>
      </div>
    );
  }


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-center mb-6">List Of Available Property</h1>
        <Link href="/add-property">
          <button className="bg-pink-800 text-white py-2 px-6 rounded-md hover:bg-pink-900 cursor-pointer">
          <p className="flex">
          <Plus size={16} /> Add Property
          </p>
          </button>
        </Link>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600 text-center">Failed to fetch properties.</p>
      ) : (
        <>
          <table className="w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Price</th>
                <th className="p-2">Department</th>
                <th className="p-2">Location</th>
                <th className="p-2">Bought Time</th>
                <th className="p-2">Manufacturer</th>
                <th className="p-2">Status</th>
                <th className="p-2">Supplier</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((property, index) => (
                <tr
                  key={property.id}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} text-center border-t`}
                >
                  <td className="p-2">{String((page - 1) * ROWS_PER_PAGE + index + 1).padStart(3, "0")}</td>
                  <td className="p-2">{property.name}</td>
                  <td className="p-2">{property.price} RWF</td>
                  <td className="p-2">{property.department}</td>
                  <td className="p-2">{property.location}</td>
                  <td className="p-2">{new Date(property.boughtTime).toLocaleDateString()}</td>
                  <td className="p-2">{property.manufacturer}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-white text-sm ${property.status ? "bg-green-600" : "bg-red-500"}`}>
                      {property.status ? "Active" : "Damaged"}
                    </span>
                  </td>
                  <td className="p-2">{property.supplier}</td>
                  <td className="p-2">
                    <Link href={`/property/${property.id}`} className="text-blue-600 hover:underline">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            {/*Pagination Controls */}
          {data?.total > ROWS_PER_PAGE && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm">
                Page {page} of {data?.totalPages}
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, data?.totalPages || 1))}
                disabled={page === data?.totalPages}
                className="px-4 py-2 border rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
