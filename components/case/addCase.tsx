"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCase } from "@/services/case/cases.api";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Button from "@/components/UI/Button";
import toast from "react-hot-toast";
import { CaseStatus } from "@/lib/types";
import { useEffect } from "react";
import { getClientByPoc } from "@/services/client/clients.api";
import { getLawyers } from "@/services/user/users.api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CreateDocumentDto } from "@/lib/documentType";
import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";
import { createDocument } from "@/services/document/document.api";

// Define validation schema
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

interface CaseRegistrationFormProps {
  clientId?: string; // Optional pre-selected client
}

export default function CaseRegistrationForm({
  clientId,
}: CaseRegistrationFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  //poc
  const [poc, setPoc] = useState("");
  const [pocClient, setPocClient] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [pocError, setPocError] = useState<string | null>(null);

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

  // Fetch clients and lawyers for dropdowns
  const { data: clients } = useQuery({
    queryKey: ["clients"],
    queryFn: () => getClientByPoc(""),
  });

  const {
    data: lawyers,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["lawyers"],
    queryFn: getLawyers,
  });

  useEffect(() => {
    if (error) {
      console.error("Error fetching lawyers:", error);
    }
  }, [error]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<CaseFormValues>({
    resolver: zodResolver(caseFormSchema),
    defaultValues: {
      status: CaseStatus.OPEN,
      client_id: clientId || "",
      document: undefined,
    },
  });

  // Add this to handle file changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setValue("document", e.target.files[0]);
    } else {
      setValue("document", undefined);
    }
  };

  // Set client_id if provided via props
  useEffect(() => {
    if (clientId) {
      setValue("client_id", clientId);
    }
  }, [clientId, setValue]);

  const createCaseMutation = useMutation({
    mutationFn: async (data: CaseFormValues) => {
      // First create the case
      const caseResponse = await axios.post(`${API_BASE_URL}/cases`, {
        classification: data.classification,
        type: data.type,
        status: data.status || CaseStatus.OPEN,
        client_id: data.client_id,
        lawyer_id: data.lawyer_id,
      });

      const caseId = caseResponse.data.id;

      // Then upload document if exists
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

      return caseResponse.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      toast.success("Case created successfully");
      router.push(`/cases`);
    },
    onError: (error: Error) => {
      console.error("Error creating case:", error);
      toast.error(error.message || "Failed to create case");
    },
  });

  const onSubmit = async (data: CaseFormValues) => {
    try {
      console.log("Starting case creation...");

      // 1. Create case
      const caseResponse = await axios.post(`${API_BASE_URL}/cases`, {
        classification: data.classification,
        type: data.type,
        status: data.status || CaseStatus.OPEN,
        client_id: data.client_id,
        lawyer_id: data.lawyer_id,
      });

      console.log("Full case response:", caseResponse.data);

      // 2. Verify and extract case ID from nested data property
      if (!caseResponse.data?.data?.id) {
        throw new Error("Case created but no ID found in response");
      }

      const caseId = caseResponse.data.data.id;
      console.log("Extracted case ID:", caseId);

      // 3. Optional delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // 4. Document upload
      if (data.document) {
        console.log(`Uploading to case ${caseId}`);
        try {
          await createDocument(
            {
              case_id: caseId,
              filename: data.document.name,
              file_type: data.document.type,
            },
            data.document
          );
          console.log("Upload successful");
        } catch (error) {
          console.error("Upload failed:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to upload document";
          throw new Error(`Document upload failed: ${errorMessage}`);
        }
      }

      // 5. Success
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      toast.success("Case created successfully");
      router.push(`/cases`);
    } catch (error) {
      console.error("Complete error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">Register New Case</h1>
          <p className="text-gray-500">
            Fill in the details below to register a new case
          </p>
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
                <label
                  htmlFor="classification"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Classification*
                </label>
                <input
                  id="classification"
                  type="text"
                  {...register("classification")}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.classification ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., Criminal, Civil, Family"
                />
                {errors.classification && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.classification.message}
                  </p>
                )}
              </div>

              {/* Type */}
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Type*
                </label>
                <input
                  id="type"
                  type="text"
                  {...register("type")}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.type ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., Divorce, Contract, Theft"
                />
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.type.message}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
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

          {/* Add the file upload field here */}
          <div className="col-span-2">
            <label
              htmlFor="document"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Upload Document (PDF only)
            </label>
            <input
              id="document"
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

          {/* Client and Lawyer Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Assignments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client by POC */}
              <div>
                <label
                  htmlFor="poc"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Client POC*
                </label>
                <div className="flex gap-2">
                  <input
                    id="poc"
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
                <label
                  htmlFor="lawyer_id"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Lawyer*
                </label>
                <select
                  id="lawyer_id"
                  {...register("lawyer_id")}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.lawyer_id ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a lawyer</option>
                  {lawyers && lawyers.length > 0 ? (
                    lawyers.map((lawyer) => (
                      <option key={lawyer.id} value={lawyer.id}>
                        {lawyer.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No lawyers available</option>
                  )}
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
            onClick={() => reset()}
            label="Reset"
            variant="outline"
            disabled={createCaseMutation.isPending}
          />
          <Button
            type="submit"
            label={createCaseMutation.isPending ? "Creating..." : "Create Case"}
            variant="primary"
            icon={
              createCaseMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )
            }
            disabled={createCaseMutation.isPending}
          />
        </div>
      </form>
    </div>
  );
}
