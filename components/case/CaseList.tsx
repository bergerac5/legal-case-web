"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCases, deleteCase } from "@/services/case/cases.api";
import { useState } from "react";
import Link from "next/link";
import { FolderX, Loader2, Pencil, Trash2, Eye } from "lucide-react";
import { PaginatedCaseResponse, CaseStatus } from "@/lib/types";
import toast from "react-hot-toast";

const ROWS_PER_PAGE = 10;

// Type guard for PaginatedCaseResponse
function isPaginatedResponse(data: unknown): data is PaginatedCaseResponse {
  return (
    !!data &&
    typeof data === 'object' &&
    'data' in data && 
    Array.isArray(data.data) &&
    'meta' in data
  );
}

export default function CaseList() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, isFetching, isPlaceholderData } =useQuery<PaginatedCaseResponse>({    
      queryKey: ["cases", page],
      queryFn: () => getAllCases(page),
      placeholderData: (previousData) =>
        previousData ?? {
          data: [],
          meta: {
            total: 0,
            page: 1,
            limit: ROWS_PER_PAGE,
            totalPages: 0,
          },
        },
      staleTime: 1000 * 60 * 5,
      retry: 2,
    });

  const deleteMutation = useMutation({
    mutationFn: deleteCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      toast.success("Case deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting case:", error);
      toast.error("Failed to delete case");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this case?")) {
      deleteMutation.mutate(id);
    }
  };

  const showingFrom = isPaginatedResponse(data)
    ? (page - 1) * ROWS_PER_PAGE + 1
    : 0;
  const showingTo = isPaginatedResponse(data)
    ? Math.min(page * ROWS_PER_PAGE, data.meta.total)
    : 0;

  const handlePageChange = (newPage: number) => {
    if (
      isPaginatedResponse(data) &&
      newPage >= 1 &&
      newPage <= data.meta.totalPages
    ) {
      setPage(newPage);
    }
  };

  // Loading state
  if (isLoading && !isPaginatedResponse(data)) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-gray-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading cases...</span>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2 p-4">
        <FolderX size={48} className="text-red-500" />
        <p className="text-red-600 text-center">
          Error loading cases:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (!data || !data.data.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2 p-4">
        <FolderX size={48} className="text-gray-400" />
        <p className="text-gray-600">No cases found</p>
        <Link
          href="/cases/add"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add your first case
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Case Management</h1>
          {isPaginatedResponse(data) && data.meta.total > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {data.meta.total} {data.meta.total === 1 ? "case" : "cases"} in
              total
            </p>
          )}
        </div>
        <Link href="/cases/add">
          <button
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50"
            disabled={isFetching}
          >
            {isFetching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>+</span>
                <span>Add Case</span>
              </>
            )}
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                Classification
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                Lawyer
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.data.map((caseItem) => (
              <tr
                key={caseItem.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-700">{caseItem.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-700">
                    {caseItem.classification}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-500">{caseItem.classification}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-500">{caseItem.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      caseItem.status === CaseStatus.OPEN
                        ? "bg-green-100 text-green-800"
                        : caseItem.status === CaseStatus.IN_PROGRESS
                        ? "bg-blue-100 text-blue-800"
                        : caseItem.status === CaseStatus.ON_HOLD
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {caseItem.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-500">{caseItem.client?.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-500">{caseItem.lawyer?.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                  <Link
                    href={`/cases/view/${caseItem.id}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="View case"
                  >
                    <Eye className="h-5 w-5" />
                  </Link>
                  <Link
                    href={`/cases/edit/${caseItem.id}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Edit case"
                  >
                    <Pencil className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(caseItem.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    disabled={isFetching || deleteMutation.isPending}
                    title="Delete case"
                  >
                    {deleteMutation.isPending &&
                    deleteMutation.variables === caseItem.id ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isPaginatedResponse(data) && data.meta.total > ROWS_PER_PAGE && (
        <div className="px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{showingFrom}</span> to{" "}
            <span className="font-medium">{showingTo}</span> of{" "}
            <span className="font-medium">{data.meta.total}</span> cases
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || isFetching}
              className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-100"
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from(
                { length: Math.min(5, data.meta.totalPages) },
                (_, i) => {
                  const pageNum =
                    page <= 3
                      ? i + 1
                      : page >= data.meta.totalPages - 2
                      ? data.meta.totalPages - 4 + i
                      : page - 2 + i;

                  if (pageNum < 1 || pageNum > data.meta.totalPages)
                    return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      disabled={page === pageNum || isFetching}
                      className={`w-8 h-8 rounded-md ${
                        page === pageNum
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}
            </div>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === data.meta.totalPages || isFetching}
              className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {isFetching && isPlaceholderData && (
        <div className="p-2 bg-blue-50 text-blue-600 text-sm text-center flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading more cases...
        </div>
      )}
    </div>
  );
}
