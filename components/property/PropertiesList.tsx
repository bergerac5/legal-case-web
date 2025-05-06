"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllProperties } from "@/services/insurance.api";
import Link from "next/link";
import { useState } from "react";

const ROWS_PER_PAGE = 5;

export default function PropertiesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["properties"],
    queryFn: getAllProperties,
  });

  const [page, setPage] = useState(1);

  const startIndex = (page - 1) * ROWS_PER_PAGE;
  const paginatedData = data?.slice(startIndex, startIndex + ROWS_PER_PAGE) || [];

  const totalPages = data ? Math.ceil(data.length / ROWS_PER_PAGE) : 0;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Property Management</h1>
        <Link href="/add-property">
          <button className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">
            + Add Property
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
    {paginatedData.map((property, index) => (
      <tr
        key={property.id}
        className={`${
          index % 2 === 0 ? "bg-white" : "bg-gray-100"
        } text-center border-t`}
      >
        <td className="p-2">
          {String((page - 1) * ROWS_PER_PAGE + index + 1).padStart(3, "0")}
        </td>
        <td className="p-2">{property.name}</td>
        <td className="p-2">${property.price}</td>
        <td className="p-2">{property.department}</td>
        <td className="p-2">{property.location}</td>
        <td className="p-2">
          {new Date(property.boughtTime).toLocaleDateString()}
        </td>
        <td className="p-2">{property.manufacturer}</td>
        <td className="p-2">
          <span
            className={`px-2 py-1 rounded text-white text-sm ${
              property.status ? "bg-green-600" : "bg-red-500"
            }`}
          >
            {property.status ? "Active" : "Damaged"}
          </span>
        </td>
        <td className="p-2">{property.supplier}</td>
        <td className="p-2">
          <Link
            href={`/properties/${property.id}`}
            className="text-blue-600 hover:underline"
          >
            View
          </Link>
        </td>
      </tr>
    ))}
  </tbody>
</table>
    {/* Pagination Controls */}
    <div className="flex justify-center items-center gap-4 mt-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
