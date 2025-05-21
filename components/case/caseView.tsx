"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCaseById, updateCaseStatus } from "@/services/case/cases.api";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  Edit,
  FileText,
  User,
  Gavel,
  Calendar,
  Mail,
  Trash2,
} from "lucide-react";
import Button from "@/components/UI/Button";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CaseStatus } from "@/lib/types";
import { API_BASE_URL } from "@/lib/constants";
import { deleteDocument, documentAPI } from "@/services/document/document.api";
import { hearingAPI } from "@/services/hearing/hearing.api";
import { UpdateHearingDto } from "@/lib/hearing.types";

interface Document {
  id: string;
  filename: string;
  created_at: string;
}

interface Hearing {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  location?: string;
  notes?: string;
}

export default function ViewCasePage({ params }: { params: { id: string } }) {
  const caseId = params.id;
  const router = useRouter();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<CaseStatus>();

  // Fetch case data
  const {
    data: caseData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["case", caseId],
    queryFn: () => getCaseById(caseId),
    retry: false,
  });

  // Status update mutation
  const statusMutation = useMutation({
    mutationFn: (newStatus: CaseStatus) =>
      updateCaseStatus(caseId, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["case", caseId] });
      toast.success("Case status updated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update status");
    },
  });

  useEffect(() => {
    if (caseData) {
      setStatus(caseData.status);
    }
  }, [caseData]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Failed to load case");
      if (error?.message === "Case not found") {
        router.push("/cases");
      }
    }
  }, [isError, error, router]);

  const handleStatusChange = (newStatus: CaseStatus) => {
    setStatus(newStatus);
    statusMutation.mutate(newStatus);
  };

  //Download function
  const downloadDocumentMutation = useMutation({
    mutationFn: ({ docId, filename }: { docId: string; filename: string }) =>
      documentAPI.download(docId).then((res) => ({ ...res, filename })),
    onSuccess: (data) => {
      const { blob, contentType, contentDisposition, filename } = data;

      if (!contentType.includes("application/pdf")) {
        throw new Error("Invalid file type");
      }

      const finalFilename =
        contentDisposition?.match(/filename="?(.+?)"?$/)?.[1] || filename;
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: contentType })
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = finalFilename;
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    },
  });

  const handleDownload = (
    e: React.MouseEvent,
    docId: string,
    filename: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const toastId = toast.loading("Preparing download...");
    downloadDocumentMutation.mutate(
      { docId, filename },
      {
        onSettled: () => toast.dismiss(toastId),
        onSuccess: () => toast.success("Download started"),
        onError: (error) => {
          console.error("Download failed:", error);
          toast.error(error.message || "Failed to download file");
        },
      }
    );
  };

  const deleteDocumentMutation = useMutation({
    mutationFn: deleteDocument,
    onMutate: async (documentId) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["case", caseId] });

      // Snapshot the previous value
      const previousCaseData = queryClient.getQueryData(["case", caseId]);

      // Optimistically update to the new value
      queryClient.setQueryData(["case", caseId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          documents: old.documents?.filter(
            (doc: Document) => doc.id !== documentId
          ),
        };
      });

      // Return a context object with the snapshotted value
      return { previousCaseData };
    },
    onError: (error, documentId, context) => {
      // Rollback to the previous value if the mutation fails
      if (context?.previousCaseData) {
        queryClient.setQueryData(["case", caseId], context.previousCaseData);
      }
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    },
    onSuccess: () => {
      toast.success("Document deleted successfully");
    },
    onSettled: () => {
      // Always refetch after error or success to ensure sync with server
      queryClient.invalidateQueries({ queryKey: ["case", caseId] });
    },
  });

  // Fetch hearings for the case
  const { data: hearings } = useQuery({
    queryKey: ["case-hearings", caseId],
    queryFn: () => hearingAPI.getAll(caseId),
  });

  // Create hearing mutation
  const createHearingMutation = useMutation({
    mutationFn: hearingAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["case-hearings", caseId],
      });
      toast.success("Hearing created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create hearing");
    },
  });

  // Update hearing mutation
  const updateHearingMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateHearingDto }) =>
      hearingAPI.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["case-hearings", caseId],
      });
      toast.success("Hearing updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update hearing");
    },
  });

  const deleteHearingMutation = useMutation({
    mutationFn: hearingAPI.delete,
    onMutate: async (hearingId) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["case-hearings", caseId] });

      // Snapshot the previous value
      const previousHearingsData = queryClient.getQueryData([
        "case-hearings",
        caseId,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(["case", caseId], (old: any) => {
  if (!old) return old;
  return {
    ...old,
    hearings: old.hearings?.filter(
      (hearing: Hearing) => hearing.id !== hearingId
    ),
  };
});

      // Return a context object with the snapshotted value
      return { previousHearingsData };
    },
    onError: (error, hearingId, context) => {
      // Rollback to the previous value if the mutation fails
      if (context?.previousHearingsData) {
        queryClient.setQueryData(
          ["case-hearings", caseId],
          context.previousHearingsData
        );
      }
      console.error("Error deleting hearing:", error);
      toast.error("Failed to delete hearing");
    },
    onSuccess: () => {
      toast.success("Hearing deleted successfully");
    },
    onSettled: () => {
      // Always refetch after error or success to ensure sync with server
      queryClient.invalidateQueries({ queryKey: ["case-hearings", caseId] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-gray-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading case data...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2 p-4">
        <div className="text-red-500 text-center">
          Error loading case: {error.message}
        </div>
        <Button
          onClick={() => router.push("/cases")}
          label="Back to Cases"
          variant="outline"
          icon={<ArrowLeft className="h-4 w-4" />}
        />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2 p-4">
        <div className="text-red-500 text-center">Case not found</div>
        <Button
          onClick={() => router.push("/cases")}
          label="Back to Cases"
          variant="outline"
          icon={<ArrowLeft className="h-4 w-4" />}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Gavel className="h-6 w-6 text-blue-600" />
            {caseData.classification} - {caseData.type}
          </h1>
          <p className="text-gray-500">Case ID: {caseData.id}</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push("/cases")}
            label="Back"
            variant="outline"
            icon={<ArrowLeft className="h-4 w-4" />}
          />
          <Link href={`/cases/edit/${caseData.id}`}>
            <Button
              label="Edit"
              variant="primary"
              icon={<Edit className="h-4 w-4" />}
            />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Case Information Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Gavel className="h-5 w-5 text-blue-500" />
            Case Details
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Classification</p>
              <p className="font-medium">{caseData.classification}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium">{caseData.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <select
                value={status}
                onChange={(e) =>
                  handleStatusChange(e.target.value as CaseStatus)
                }
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                disabled={statusMutation.isPending}
              >
                {Object.values(CaseStatus).map((status) => (
                  <option key={status} value={status}>
                    {status.replace("_", " ")}
                  </option>
                ))}
              </select>
              {statusMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin ml-2 inline" />
              )}
            </div>
          </div>
        </div>

        {/* Client Information Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            Client Information
          </h2>
          {caseData.client ? (
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{caseData.client.names}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">POC</p>
                <p className="font-medium">{caseData.client.poc}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{caseData.client.phoneNumber}</p>
              </div>
              <Link href={`/clients/view/${caseData.client.id}`}>
                <Button
                  label="View Client"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                />
              </Link>
            </div>
          ) : (
            <p className="text-gray-500">No client assigned</p>
          )}
        </div>

        {/* Lawyer Information Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            Lawyer Information
          </h2>
          {caseData.lawyer ? (
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{caseData.lawyer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{caseData.lawyer.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{caseData.lawyer.phone}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No lawyer assigned</p>
          )}
        </div>
      </div>

      {/* Documents Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5`/cases/edit/${case}` text-blue-500" />
            Case Documents
          </h2>
          <Link href={`/cases/edit/${caseData.id}`}>
            <Button label="Upload Document" variant="primary" size="sm" />
          </Link>
        </div>

        {caseData.documents && caseData.documents.length > 0 ? (
          <div className="space-y-4">
            {caseData.documents.map((doc: Document) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium">
                      {doc.filename.split(/[\\/]/).pop()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Uploaded: {formatDate(doc.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`${API_BASE_URL}/documents/${doc.id}/download`}
                    onClick={(e) => handleDownload(e, doc.id, doc.filename)}
                    className="text-blue-600 hover:underline block truncate"
                    title={`Download ${doc.filename}`}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      label=""
                      icon={
                        downloadDocumentMutation.isPending &&
                        downloadDocumentMutation.variables?.docId === doc.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )
                      }
                      onClick={(e) => handleDownload(e, doc.id, doc.filename)}
                      disabled={downloadDocumentMutation.isPending}
                      title="Download"
                    />
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    label=""
                    icon={
                      deleteDocumentMutation.isPending &&
                      deleteDocumentMutation.variables === doc.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-red-500" />
                      )
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        confirm(
                          "Are you sure you want to delete this document?"
                        )
                      ) {
                        deleteDocumentMutation.mutate(doc.id);
                      }
                    }}
                    disabled={deleteDocumentMutation.isPending}
                    title="Delete"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No documents
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Upload your first document to get started
            </p>
          </div>
        )}
      </div>

      {/* Hearings Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Case Hearings
          </h2>
          <Link href={`/hearings/add/${caseId}`}>
            <Button label="Schedule Hearing" variant="primary" size="sm" />
          </Link>
        </div>

        {caseData.hearings && caseData.hearings.length > 0 ? (
          <div className="space-y-4">
            {caseData.hearings.map((hearing: Hearing) => (
              <div
                key={hearing.id}
                className="p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      {formatDate(hearing.start_time)}
                    </h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">Time:</span>{" "}
                        {formatDate(hearing.start_time)} -{" "}
                        {formatDate(hearing.end_time)}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Location:</span>{" "}
                        {hearing.location || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/hearings/edit/${hearing.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        label=""
                        icon={<Edit className="h-4 w-4" />}
                        title="Edit"
                      />
                    </Link>
                    {/* Delete button inline - no separate component needed */}
                    <Button
                      variant="outline"
                      size="sm"
                      label=""
                      icon={
                        deleteHearingMutation.isPending &&
                        deleteHearingMutation.variables === hearing.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-red-500" />
                        )
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          confirm(
                            "Are you sure you want to delete this hearing?"
                          )
                        ) {
                          deleteHearingMutation.mutate(hearing.id);
                        }
                      }}
                      disabled={deleteHearingMutation.isPending}
                      title="Delete Hearing"
                    />
                  </div>
                </div>
                {hearing.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                    <p className="font-medium">Notes:</p>
                    <p className="text-gray-700">{hearing.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No hearings
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Schedule your first hearing to get started
            </p>
          </div>
        )}
      </div>

      {/* Metadata Section */}
      <div className="mt-6 text-sm text-gray-500 flex justify-between">
        <div>Created: {formatDate(caseData.created_at)}</div>
        <div>Last Updated: {formatDate(caseData.updated_at)}</div>
      </div>
    </div>
  );
}
