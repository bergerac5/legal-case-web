"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save, Trash2, FileText } from "lucide-react";
import Button from "@/components/UI/Button";
import toast from "react-hot-toast";
import { CaseStatus } from "@/lib/types";
import { useEffect, useState } from "react";
import { getClientByPoc } from "@/services/client/clients.api";
import { getLawyers } from "@/services/user/users.api";
import { API_BASE_URL } from "@/lib/constants";
import {
  createDocument,
  deleteDocument,
  getAllDocuments,
} from "@/services/document/document.api";
import { getCaseById, updateCase } from "@/services/case/cases.api";
import { extractFilename } from "@/lib/documentUtils";

// Reuse your validation schema
const caseFormSchema = z.object({
  classification: z.string().min(1, "Classification is required"),
  type: z.string().min(1, "Type is required"),
  status: z.nativeEnum(CaseStatus).optional(),
  client_id: z.string().min(1, "Client is required"),
  lawyer_id: z.string().min(1, "Lawyer is required"),
  document: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "File size must be less than 5MB"
    )
    .refine(
      (file) => file.type === "application/pdf",
      "Only PDF files are allowed"
    )
    .optional(),
});

type CaseFormValues = z.infer<typeof caseFormSchema>;

interface CaseEditFormProps {
  caseId: string;
}

export default function CaseEditForm({ caseId }: CaseEditFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [existingDocuments, setExistingDocuments] = useState<any[]>([]);
  const [poc, setPoc] = useState("");
  const [pocClient, setPocClient] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [pocError, setPocError] = useState<string | null>(null);

  // Fetch case data
  const { data: caseData, isLoading: isCaseLoading } = useQuery({
    queryKey: ["case", caseId],
    queryFn: () => getCaseById(caseId),
  });

  // Fetch existing documents
  const { data: documents } = useQuery({
    queryKey: ["case-documents", caseId],
    queryFn: () => getAllDocuments(caseId),
  });

  // Fetch clients and lawyers
  const { data: lawyers } = useQuery({
    queryKey: ["lawyers"],
    queryFn: getLawyers,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<CaseFormValues>({
    resolver: zodResolver(caseFormSchema),
  });

  // Handle side effects when data loads
  useEffect(() => {
    if (caseData) {
      reset({
        classification: caseData.classification,
        type: caseData.type,
        status: caseData.status,
        client_id: caseData.client_id,
        lawyer_id: caseData.lawyer_id,
        document: undefined,
      });
      setPocClient(
        caseData.client
          ? { id: caseData.client.id, name: caseData.client.name }
          : null
      );
    }
  }, [caseData, reset]);

  useEffect(() => {
    if (documents) {
      setExistingDocuments(documents || []);
    }
  }, [documents]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setValue("document", e.target.files[0]);
    } else {
      setValue("document", undefined);
    }
  };

  const handlePocSearch = async () => {
    try {
      const client = await getClientByPoc(poc);
      setPocClient(client);
      setValue("client_id", client.id);
      setPocError(null);
    } catch (error: any) {
      setPocClient(null);
      setValue("client_id", "");
      setPocError(error.message || "Failed to fetch client");
    }
  };

  const updateCaseMutation = useMutation({
    mutationFn: async (data: CaseFormValues) => {
      // Update case details
      const updatedCase = await updateCase(caseId, {
        classification: data.classification,
        type: data.type,
        status: data.status || CaseStatus.OPEN,
        client_id: data.client_id,
        lawyer_id: data.lawyer_id,
      });

      // Upload new document if provided
      if (data.document) {
        await createDocument(
          {
            case_id: caseId,
            filename: data.document.name,
            file_type: data.document.type,
          },
          data.document
        );
      }

      return updatedCase;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["case", caseId] });
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      queryClient.invalidateQueries({ queryKey: ["case-documents", caseId] });
      toast.success("Case updated successfully");
    },
    onError: (error: Error) => {
      console.error("Error updating case:", error);
      toast.error(error.message || "Failed to update case");
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["case-documents", caseId] });
      toast.success("Document deleted successfully");
    },
    onError: (error: Error) => {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    },
  });

  const onSubmit = async (data: CaseFormValues) => {
    updateCaseMutation.mutate(data);
  };

  if (isCaseLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-gray-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading case data...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Case</h1>
          <p className="text-gray-500">Update the details of this case</p>
        </div>
        <Button
          onClick={() => router.back()}
          label="Back"
          variant="outline"
          icon={<ArrowLeft className="h-4 w-4" />}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Case Information Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Case Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Classification */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Classification*
                </label>
                <input
                  {...register("classification")}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.classification ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.classification && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.classification.message}
                  </p>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type*
                </label>
                <input
                  {...register("type")}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.type ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.type.message}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  {...register("status")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {Object.values(CaseStatus).map((status) => (
                    <option key={status} value={status}>
                      {status.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload New Document (PDF only)
            </label>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.document ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.document && (
              <p className="mt-1 text-sm text-red-600">
                {errors.document.message}
              </p>
            )}
            {watch("document") && (
              <p className="mt-1 text-sm text-gray-500">
                Selected file: {watch("document")?.name}
              </p>
            )}
          </div>

          {/* Existing Documents */}
          {existingDocuments.length > 0 && (
  <div className="col-span-2">
    <h3 className="text-md font-medium mb-2">Existing Documents</h3>
    <div className="space-y-2">
      {existingDocuments.map((doc) => {
        const filename = extractFilename(doc.filename);
        const displayName = filename.replace(/^\d+-(\d+-)?/, "");

        const handleDownload = async (
          e: React.MouseEvent,
          docId: string,
          filename: string
        ) => {
          e.preventDefault();

          try {
            const toastId = toast.loading("Preparing download...");
            const response = await fetch(
              `${API_BASE_URL}/documents/${docId}/download`
            );

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(
                errorData.message || `Server responded with ${response.status}`
              );
            }

            const contentType = response.headers.get("content-type");
            if (!contentType?.includes("application/pdf")) {
              throw new Error("Invalid file type");
            }

            const contentDisposition = response.headers.get(
              "content-disposition"
            );
            const finalFilename =
              contentDisposition?.match(/filename="?(.+?)"?$/)?.[1] ||
              filename;

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = finalFilename;
            document.body.appendChild(link);
            link.click();

            setTimeout(() => {
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
              toast.success("Download started", { id: toastId });
            }, 100);
          } catch (error: unknown) {
            console.error("Download failed:", error);
            toast.error(
              error instanceof Error 
                ? error.message 
                : "Failed to download file"
            );
          }
        };

        return (
          <div
            key={doc.id}
            className="flex items-center justify-between group hover:bg-gray-50 rounded p-1"
          >
            <div className="flex items-center flex-1 min-w-0">
              <FileText className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
              <div className="min-w-0">
                <a
                  href={`${API_BASE_URL}/documents/${doc.id}/download`}
                  onClick={(e) => handleDownload(e, doc.id, filename)}
                  className="text-blue-600 hover:underline block truncate"
                  title={`Download ${filename}`}
                >
                  {displayName}
                </a>
                <div className="text-xs text-gray-500">
                  Uploaded: {new Date(doc.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteDocumentMutation.mutate(doc.id);
              }}
              className="text-red-600 hover:text-red-800 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              disabled={deleteDocumentMutation.isPending}
              title="Delete document"
            >
              {deleteDocumentMutation.isPending &&
              deleteDocumentMutation.variables === doc.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        );
      })}
    </div>
  </div>
)}

          {/* Client and Lawyer Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Assignments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client by POC */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client POC*
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={poc}
                    onChange={(e) => setPoc(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.client_id ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter POC"
                  />
                  <Button
                    type="button"
                    label="Search"
                    onClick={handlePocSearch}
                  />
                </div>
                {pocError && (
                  <p className="mt-1 text-sm text-red-600">{pocError}</p>
                )}
                {pocClient && (
                  <p className="mt-1 text-sm text-green-600">
                    Client: {pocClient.name}
                  </p>
                )}
                <input type="hidden" {...register("client_id")} />
                {errors.client_id && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.client_id.message}
                  </p>
                )}
              </div>

              {/* Lawyer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lawyer*
                </label>
                <select
                  {...register("lawyer_id")}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.lawyer_id ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a lawyer</option>
                  {lawyers?.map((lawyer) => (
                    <option key={lawyer.id} value={lawyer.id}>
                      {lawyer.name}
                    </option>
                  ))}
                </select>
                {errors.lawyer_id && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.lawyer_id.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            onClick={() => router.back()}
            label="Cancel"
            variant="outline"
            disabled={updateCaseMutation.isPending}
          />
          <Button
            type="submit"
            label={updateCaseMutation.isPending ? "Saving..." : "Save Changes"}
            variant="primary"
            icon={
              updateCaseMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )
            }
            disabled={updateCaseMutation.isPending}
          />
        </div>
      </form>
    </div>
  );
}
